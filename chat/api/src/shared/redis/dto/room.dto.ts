import { User } from './user.dto';

export class Room {
  name: string;
  creater: User;
  createdAt: number;
  users: User[];

  constructor(name: string, user: User) {
    this.name = name;
    this.creater = user;
    this.createdAt = new Date().getTime();
    this.users = [user];
  }
}
