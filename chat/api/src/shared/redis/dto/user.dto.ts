export class User {
  socketId: string;
  isChatting: boolean;
  name: string;
  createdAt: number;

  constructor(socketId: string, name: string, isChatting: boolean) {
    this.socketId = socketId;
    this.name = name;
    this.isChatting = isChatting;
    this.createdAt = new Date().getTime();
  }
}
