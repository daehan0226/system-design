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

    const adapter: RedisAdapter = socket.adapter;
    const sockets = await adapter.allRooms();
    this.nsp.emit('users', Array.from(sockets));
  }

  async handleDisconnect(@ConnectedSocket() socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
    rooms.forEach((room) => {
      if (room.users.includes(socket.id)) {
        room.users = room.users.filter((u) => u !== socket.id);
        socket.broadcast.to(room.name).emit('message', {
          message: `${socket.id}님이 나가셨습니다.`,
          room,
        });
      }
    });

    const adapter: RedisAdapter = socket.adapter;
    const sockets = await adapter.allRooms();
    this.nsp.emit('users', Array.from(sockets));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomName, message }: MessagePayload,
  ) {
    this.logger.debug(`send message to room name ${roomName}: ${message}`);
    socket.broadcast.to(roomName).emit('message', {
      username: socket.id,
      message,
      room: rooms.find((r) => r.name === roomName),
    });

    return {
      username: socket.id,
      message,
      room: rooms.find((r) => r.name === roomName),
    };
  }

  @SubscribeMessage('rooms')
  handleRooms() {
    this.logger.debug(`send room info`);
    console.log('rooms', rooms);
    return rooms;
  }

  @SubscribeMessage('room')
  handleRoom(@MessageBody() { roomName }) {
    return rooms.find((r) => r.name === roomName);
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    const exists = rooms.find(({ name }) => name === roomName);
    if (exists) {
      return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
    }
    const data: IRoom = {
      name: roomName,
      number: rooms.length,
      createdAt: new Date(),
      users: [socket.id],
      creater: socket.id,
    };

    this.logger.debug(`${socket.id} created room: ${roomName}`);
    socket.join(roomName); // 요청 소켓 해당 채팅방에 추가
    rooms.push(data);
    console.log(rooms);
    this.nsp.emit('create-room', rooms); // 대기중인 유저들에게 전달
    return { success: true, payload: roomName };
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    rooms.forEach((room) => {
      if (room.name === roomName) {
        room.users = [...room.users, socket.id];
      }
    });
    socket.join(roomName); // 요청 소켓에 채팅방 추가
    this.nsp.emit('create-room', rooms); // 대기실에 대기중인 유저에게 보내주기
    this.logger.debug(`${socket.id} joined room: ${roomName}`);
    socket.broadcast.to(roomName).emit('message', {
      // 해당 채팅방에 전체 채팅
      message: `${socket.id}가 들어왔습니다.`,
      room: rooms.find((r) => r.name === roomName),
    });
    return { success: true };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.leave(roomName);
    rooms.forEach((room) => {
      if (room.name === roomName) {
        room.users = room.users.filter((u) => u !== socket.id);
      }
    });
    socket.broadcast.to(roomName).emit('message', {
      message: `${socket.id}가 나갔습니다.`,
      room: rooms.find((r) => r.name === roomName),
    });

    this.logger.debug(`${socket.id} left from room: ${roomName}`);
    return { success: true };
  }
}
