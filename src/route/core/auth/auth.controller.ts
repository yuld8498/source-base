import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../../guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import UserSignIn from './schema/user-sign-in.schema';

@ApiTags('Auth')
@ApiExtraModels(UserSignIn)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
