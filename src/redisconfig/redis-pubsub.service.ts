import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy{

  private logger = new Logger(RedisPubSubService.name);
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private readonly configService: ConfigService){}



    onModuleInit() {
      const host = this.configService.get<string>('REDIS_HOST');
      const port = this.configService.get<number>('REDIS_PORT');
      this.publisher = new Redis({host, port});
      this.subscriber = new Redis({host, port});
    }

    async publish(channel: string, message: any){
      await this.publisher.publish(channel, JSON.stringify(message));
      this.logger.log(`Published message to channel ${channel}: ${JSON.stringify(message)}`);
    }

    subscribe(channel: string, handler: (message: any) => void): void {
    this.subscriber.subscribe(channel);
    
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        handler(JSON.parse(message));
      }
    });
    this.logger.log(`Subscribed to channel: ${channel}`);
  }

    onModuleDestroy() {
      this.publisher.disconnect();
      this.subscriber.disconnect();
    }
}