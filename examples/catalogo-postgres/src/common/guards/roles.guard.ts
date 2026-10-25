import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY, type Role } from './roles.decorator';

type AuthenticatedRequest = Request & { user?: { roles?: Role[] } };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const grantedRoles = request.user?.roles ?? [];
    const allowed = requiredRoles.some((role) => grantedRoles.includes(role));
    if (!allowed) throw new ForbiddenException('No tienes el rol requerido');
    return true;
  }
}
