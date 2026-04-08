import { Body, Controller, Param, Post, Request, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, IS_PUBLIC_KEY } from './decorators/public.decorator';
import { IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

class ResetPasswordDto {
  @IsString() token!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @SetMetadata(IS_PUBLIC_KEY, false) // Override class-level @Public() — requires JWT
  resendVerification(@Request() req: { user: { userId: string } }) {
    return this.auth.resendVerification(req.user.userId);
  }

  @Post('change-password')
  @SetMetadata(IS_PUBLIC_KEY, false) // Override class-level @Public() — requires JWT
  changePassword(
    @Request() req: { user: { userId: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(req.user.userId, dto.currentPassword, dto.newPassword);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Post('social/:provider')
  social(
    @Param('provider') provider: 'google' | 'apple',
    @Body() dto: SocialLoginDto,
  ) {
    return this.auth.socialLogin(provider, dto.idToken, dto.fullName);
  }
}
