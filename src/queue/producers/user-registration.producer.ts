import { InjectQueue } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { QueueName } from "src/common/constants/queue.constant";


export class UserRegistrationProducer{

  private logger = new Logger(UserRegistrationProducer.name);


  constructor(@InjectQueue(QueueName.USER_REGISTRATION) private readonly queue: Queue){}


  async addUserRegistrationJob(data: {email: string, password: string}): Promise<void>{
    await this.queue.add('user-registration-job', data);
  }
}