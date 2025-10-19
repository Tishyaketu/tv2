export class LoginDto {
  email!: string;
  password!: string;
}

export class LoginResponseDto {
  access_token!: string;
  user!: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
  };
}
