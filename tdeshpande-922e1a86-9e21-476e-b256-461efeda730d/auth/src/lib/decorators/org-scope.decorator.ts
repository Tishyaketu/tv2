import { SetMetadata } from '@nestjs/common';

export const ORG_SCOPE_KEY = 'orgScope';
export const OrgScope = () => SetMetadata(ORG_SCOPE_KEY, true);
