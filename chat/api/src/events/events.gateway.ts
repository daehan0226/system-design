import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisAdapter } from '@socket.io/redis-adapter';
import { Namespace, Socket } from 'socket.io';
import { RedisManger } from 'src/shared/redis/redis.manager';

interface MessagePayload {
  roomName: string;
  message: string;
}

interface IRoom {
  creater: string;
  name: string;
  number: number;
  users: string[];
  maxUser?: number;
  password?: string;
  createdAt: Date;
}

let rooms: IRoom[] = [];

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Gateway');
  @WebSocketServer() nsp: Namespace;

  constructor(private readonly _redisManager: RedisManger) {}

  afterInit() {
    this.nsp.adapter.on('delete-room', (name) => {
      const deletedRoom = rooms.find((r) => r.name === name);
      if (!deletedRoom) return;

      this.nsp.emit('delete-room', deletedRoom);
      rooms = rooms.filter((r) => r.name !== name);
    });

    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  async handleConnection(@ConnectedSocket() socket) {
    this.logger.log(`${socket.id} 소켓 연결됨`);
    const users = await this.getUsers(socket);
    socket.broadcast.emit('users', users);
  }

  async handleDisconnect(@ConnectedSocket() socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
    await this._redisManager.removeUser(socket.id);
    const users = await this.getUsers(socket);
    socket.broadcast.emit('users', users);

    // 특정 소켓을 키로 참가중인 방을 가져와야함. socket-room
    // rooms.forEach((room) => {
    //   if (room.users.includes(socket.id)) {
    //     room.users = room.users.filter((u) => u !== socket.id);
    //     socket.broadcast.to(room.name).emit('message', {
    //       message: `${socket.id}님이 나가셨습니다.`,
    //       room,
    //     });
    //   }
    // });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomName, message }: MessagePayload,
  ) {
    const user = await this._redisManager.getUser(socket.id);
    this.logger.debug(`send message to room name ${roomName}: ${message}`);
    socket.broadcast.to(roomName).emit('message', {
      user,
      message,
    });

    return {
      user,
      message,
    };
  }

  @SubscribeMessage('init')
  async handleInit(@ConnectedSocket() socket: Socket) {
    this.logger.debug(`init ${socket.id}`);
    await this._redisManager.removeUser(socket.id);
    const users = await this.getUsers(socket);
    socket.broadcast.emit('users', users);
    return users;
  }

  @SubscribeMessage('users')
  async handleUsers(@ConnectedSocket() socket) {
    this.logger.debug(`send users`);
    const users = await this.getUsers(socket);
    socket.broadcast.emit('users', users);
    return users;
  }

  @SubscribeMessage('rooms')
  async handleRooms(@ConnectedSocket() socket: Socket) {
    const socketIds = await this.getSockets(socket);
    const rooms = await this._redisManager.getAllRooms(socketIds);
    return rooms;
  }

  @SubscribeMessage('room')
  async handleRoom(@MessageBody() { roomName }) {
    const room = await this._redisManager.getRoom(roomName);
    return room;
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() name: string,
  ) {
    const user = await this._redisManager.getUser(socket.id);
    const room = await this._redisManager.createRoom(name, user);
    if (!room) {
      return { success: false, payload: `${name} 방이 이미 존재합니다.` };
    }

    this.logger.debug(`${socket.id} created room: ${room.name}`);
    socket.join(name); // 요청 소켓 해당 채팅방에 추가

    const socketIds = await this.getSockets(socket);
    const rooms = await this._redisManager.getAllRooms(socketIds);
    socket.broadcast.emit('create-room', rooms);
    return { success: true, payload: room };
  }

  @SubscribeMessage('create-user')
  async handleCreateUser(
    @ConnectedSocket() socket,
    @MessageBody() name: string,
  ) {
    const result = await this._redisManager.createUserName(
      name,
      socket.id,
      socket,
    );
    if (!result) {
      return { success: false, payload: `${name} 이 이미 존재합니다.` };
    }
    await this._redisManager.addUser(socket.id, name);
    const users = await this.getUsers(socket);
    socket.broadcast.emit('users', users);
    return { success: true };
  }

  async getUsers(socket) {
    const socketIds = await this.getSockets(socket);
    return await this._redisManager.getAllUserNames(socketIds);
  }

  async getSockets(socket): Promise<string[]> {
    const adapter: RedisAdapter = socket.adapter;
    const sockets = await adapter.allRooms();
    return Array.from(sockets);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    const room = await this._redisManager.getRoom(roomName);
    if (!room) {
      // 참가실패(나중에 기획에 따른)
      return false;
    }
    const user = await this._redisManager.getUser(socket.id);
    const updatedRoom = {
      ...room,
      users: [...room.users, user],
    };
    await this._redisManager.updateRoom(updatedRoom);

    this.logger.debug(`${socket.id} joined room: ${roomName}`);
    socket.join(roomName); // 요청 소켓에 채팅방 추가

    const socketIds = await this.getSockets(socket);
    const rooms = await this._redisManager.getAllRooms(socketIds);
    socket.broadcast.emit('rooms', rooms);
    socket.broadcast.to(roomName).emit('message', {
      // 해당 채팅방에 전체 채팅
      message: `${user.name}가 들어왔습니다.`,
      room: updatedRoom,
    });
    return { success: true };
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.leave(roomName);
    const user = await this._redisManager.getUser(socket.id);
    const room = await this._redisManager.getRoom(roomName);
    const updatedRoom = {
      ...room,
      users: room.users.filter((u) => u.socketId !== socket.id),
    };
    await this._redisManager.updateRoom(updatedRoom);
    socket.broadcast.emit('rooms', rooms);

    socket.broadcast.to(roomName).emit('message', {
      message: `${user.name}가 나갔습니다.`,
      room: updatedRoom,
    });

    this.logger.debug(`${user.name} left from room: ${roomName}`);
    return { success: true };
  }
}
