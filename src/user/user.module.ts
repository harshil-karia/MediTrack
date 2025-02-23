import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthLabService } from 'src/auth-lab/auth-lab.service';

@Module({
  imports: [
    JwtModule.register({})
  ],
  providers: [UserService,AuthLabService],
  controllers: [UserController]
})
export class UserModule {}
