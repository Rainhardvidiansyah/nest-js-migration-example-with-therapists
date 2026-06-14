import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueName } from 'src/common/constants/queue.constant';
import { UserRegistrationProducer } from './producers/user-registration.producer';
import { UsersModule } from 'src/users/users.module';
import { UserRegistrationProcessor } from './processors/user-registration.processor';
import { EmailModule } from 'src/email/email.module';

@Module({

  imports: [
    UsersModule,
    EmailModule,

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT')
        }
      })
    }),

    BullModule.registerQueue({
      name: QueueName.USER_REGISTRATION,
      defaultJobOptions: {
        removeOnFail: false,
        removeOnComplete: false
      }
    }),
  ],
  
  providers:[UserRegistrationProducer, UserRegistrationProcessor],
  exports: [BullModule, UserRegistrationProducer]

})
export class QueueModule {}
