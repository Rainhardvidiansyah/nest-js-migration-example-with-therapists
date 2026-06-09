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
    console.log('=== PROCESSOR IS CALLED ===');
    console.log('=== job name:', job.name);
    console.log('=== job data:', job.data);

    switch(job.name){
      case 'user-registration-job':
        await this.handleRegistration(job);
        break;
    }
  }


  private async handleRegistration(job: Job){
    const {email, password} = job.data;

    try{
      //Save USER HERE. ASSUME CONCURRENT USER DOING REGISTRATION AT THE SAME TIME
      const user = await this.userService.createLocalUser({email: email, password: password});

      //send email
      await this.redisPubSubService.publish(RedisChannel.USER_REGISTERED, {email: user.email})

      this.logger.log(`Registering user: ${email}`);

    }catch(error){
      this.logger.error(`Failed to register user: ${email}`, error instanceof Error ? error.message : String(error));
      throw error
    }
    
  }
}