import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { userId: string; role: 'student' | 'admin' } | undefined;
    const targetId = req.params?.id as string | undefined;

    if (!user) throw new UnauthorizedException();
    const allowed = user.role === 'admin' || (targetId && user.userId === targetId);
    if (!allowed) throw new ForbiddenException('Not allowed to perform this action');
    return true;
  }
}