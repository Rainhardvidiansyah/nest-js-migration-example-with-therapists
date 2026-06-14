import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { Email_Subject } from "src/common/constants/email-subject.constants";
import { QueueName } from "src/common/constants/queue.constant";
import { EmailService } from "src/email/email.service";
import { UsersService } from "src/users/users.service";


@Processor(QueueName.USER_REGISTRATION, {concurrency: 5})
export class UserRegistrationProcessor extends WorkerHost{
  
  constructor(
    private readonly userService: UsersService, 
    private readonly emailService: EmailService){
      super();
    }

  private logger = new Logger(UserRegistrationProcessor.name);


  async process(job: Job<any, any, string>): Promise<any>{

    switch(job.name){
      case 'user-registration-job':
        await this.handleRegistration(job);
        break;
    }
  }


  private async handleRegistration(job: Job){
    const {email, password} = job.data; //put email and password at queue. Then, send them to createLocalUser

    //Save USER HERE. ASSUME CONCURRENT USER DOING REGISTRATION AT THE SAME TIME
    const user = await this.userService.createLocalUser({email: email, password: password});

    
    //send email
    await this.emailService.sendEmail(user.email, Email_Subject.USER_REGISTRATION, 
    {name: user.email, activationLink: 'link activation should be put here'});

      this.logger.log(`Registering user: ${user.email}`);
  }

}