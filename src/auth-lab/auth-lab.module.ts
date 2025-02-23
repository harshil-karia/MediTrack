import { Module } from '@nestjs/common';
import { AuthLabService } from './auth-lab.service';
import { AuthLabController } from './auth-lab.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule
  ],
  providers: [AuthLabService],
  controllers: [AuthLabController]
})
export class AuthLabModule {}
