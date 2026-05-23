import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../common/decorators/public-decorators";
import { Reflector } from "@nestjs/core";


@Injectable()
export class AuthGuard implements CanActivate {




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

    const token = request.headers.authorization?.replace('Bearer ', '');

    const dataToken = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('You are not authorized to access this resource. Please login to continue.');
    }

    try {
      const payload = await this.jwtService.verify(token);

      request['user'] = payload;
      

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