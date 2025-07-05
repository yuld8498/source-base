import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.entity';

export default class UserSignIn {
  readonly accessToken: string = '';

  readonly user: User | undefined;
}
