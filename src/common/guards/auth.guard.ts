import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorators";
import { Reflector } from "@nestjs/core";


@Injectable()
export class AuthGuard implements CanActivate {

  private logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {

     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token =  this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('You are not authorized to access this resource. Please login to continue.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      request['user'] = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
      
    }catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;

  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}