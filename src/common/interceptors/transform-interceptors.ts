import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {

  constructor(private reflector: Reflector){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    
    const message = this.reflector.get<string>(
      'response_message',
      context.getHandler()
    ) ?? 'Success';


    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response.statusCode,
          message,
          data: data
          // instanceToPlain(data), 
        };
      }),
    );
  }
}