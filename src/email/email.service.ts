import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisChannel } from 'src/common/constants/redis-channel.constants';
import { RedisPubSubService } from 'src/redisconfig/redis-pubsub.service';

@Injectable()
export class EmailService implements OnModuleInit{


  private logger = new Logger(EmailService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly redisPubSubService: RedisPubSubService
  ){}



    onModuleInit() {
      this.redisPubSubService.subscribe(RedisChannel.USER_REGISTERED, (message) => {
        this.logger.log(`Received message on channel ${RedisChannel.USER_REGISTERED}: ${JSON.stringify(message)}`);
        this.logger.log(`Sending welcome email to ${message.email}`);

        this.sendEmail(message.email, 'Welcome to Our Service', `Hello, welcome to our service!`);
      });
      
    }

  async sendEmail(to: string, subject: string, message: string): Promise<void>{

    try{
      await this.mailService.sendMail({
        to,
        subject,
        text: message
      });
    } catch (error) {
      if(error instanceof Error){
        this.logger.warn(`Failed to send email, with message: ${error.message}`);
      }
    }
  }
  
}
