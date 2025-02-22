import { Module } from '@nestjs/common';
import { AuthLabService } from './auth-lab.service';
import { AuthLabController } from './auth-lab.controller';

@Module({
  providers: [AuthLabService],
  controllers: [AuthLabController]
})
export class AuthLabModule {}
