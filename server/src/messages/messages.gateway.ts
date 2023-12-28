import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'messages',
  cors: { origin: '*' },
})
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected to gateway');
    });
  }

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody('text') text: string,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(text, client.id);
    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    const messages = await this.messagesService.findAll();
    return messages;
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.identity(name, client.id);
  }
}
