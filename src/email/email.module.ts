import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigModule } from 'src/redisconfig/redis-config.module';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          // auth: { //When using the real email server, activate this auth. This is commented as I am using mailtip docker which no need to use auth.... 
          //   user: configService.get<string>('EMAIL_USER'),
          //   pass: configService.get<string>('EMAIL_PASSWORD'),
          // },
        },
        template: {
          dir: join(__dirname, 'templates'), // folder tempat welcome.hbs
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_FROM')}>`,
        },
      }),
    }),

    RedisConfigModule
  ],

  providers: [EmailService],
  exports: [EmailService],
  controllers: []
})
export class EmailModule {}
