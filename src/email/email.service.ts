import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService{


  private logger = new Logger(EmailService.name);

  constructor(
    private readonly mailService: MailerService,
  ){}


  async sendEmail(to: string, subject: string, context: Record<string, any>): Promise<void>{

    try{
      await this.mailService.sendMail({
        to,
        subject,
        template: 'welcome',
        context
      });
    } catch (error) {
      if(error instanceof Error){
        this.logger.warn(`Failed to send email, with message: ${error.message}`);
      }
    }
  }
  
}
