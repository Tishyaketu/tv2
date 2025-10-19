import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
