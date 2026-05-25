// src/decorators/response-message.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) => 
  SetMetadata('response_message', message);

//please pay attention to this method:
//const message = this.reflector.get<string>(
    //   'response_message',
    //   context.getHandler()
    // ) ?? 'Success';
// which is written in transform-interceptors