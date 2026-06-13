import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QueueName } from "src/common/constants/queue.constant";
import { RedisChannel } from "src/common/constants/redis-channel.constants";
import { RedisPubSubService } from "src/redisconfig/redis-pubsub.service";
import { UsersService } from "src/users/users.service";


@Processor(QueueName.USER_REGISTRATION, {concurrency: 5})
export class UserRegistrationProcessor extends WorkerHost{
  
  constructor(
    private readonly userService: UsersService, 
    private readonly redisPubSubService: RedisPubSubService,)
    {super();

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
      await this.sendEmail(user.email);

      this.logger.log(`Registering user: ${user.email}`);
  }


  private async sendEmail(userEmail: string){

    this.logger.log(`TRY SENDING AN EMAIL TO ${userEmail}`);
    
    await this.redisPubSubService.publish(RedisChannel.USER_REGISTERED, {email: userEmail});
   
  }
}