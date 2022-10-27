export class User {
  socketId: string;
  name: string;
  createdAt: number;

  constructor(socketId: string, name: string) {
    this.socketId = socketId;
    this.name = name;
    this.createdAt = new Date().getTime();
  }
}
