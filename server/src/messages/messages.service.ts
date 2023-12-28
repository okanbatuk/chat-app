import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  #messages: Message[];
  #users: {};

  identity(name: string, clientId: string) {
    this.#users[clientId] = name;
  }

  async create(text: string, clientId: string) {
    const message = {
      author: this.#users[clientId],
      text,
    };
    this.#messages.push(message);
    return message;
  }

  async findAll() {
    return this.#messages;
  }
}
