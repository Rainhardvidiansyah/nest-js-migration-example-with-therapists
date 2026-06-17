import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorators";


@Injectable()
export class RolesGuard implements CanActivate{

  private logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector){}
  
  
  canActivate(context: ExecutionContext): boolean{

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
        

  if(!requiredRoles){
    return true;
  }

  const { user } = context.switchToHttp().getRequest();
  
  this.logger.log(`User information in roles guard class ${JSON.stringify(user)}`);

  if(!user){
    throw new UnauthorizedException(`No roles in user`);
  }

  this.logger.log(`Extracted user: ${JSON.stringify(user)}`);
  
  const hasRole = requiredRoles.some((role) => user.roles.includes(role));
  
  if (!hasRole) {
    this.logger.warn(`User ${user.email} does not have access. Required: ${requiredRoles}`);
  }

  return hasRole;

}

}