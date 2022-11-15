import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, LocalStrategy],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
