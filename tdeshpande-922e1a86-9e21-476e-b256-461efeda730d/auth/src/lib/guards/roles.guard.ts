import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return this.hasRequiredRole(user.role, requiredRoles);
  }

  private hasRequiredRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    const roleHierarchy = {
      [UserRole.OWNER]: 3,
      [UserRole.ADMIN]: 2,
      [UserRole.VIEWER]: 1,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    return requiredRoles.some(role => {
      const requiredLevel = roleHierarchy[role] || 0;
      return userLevel >= requiredLevel;
    });
  }
}
