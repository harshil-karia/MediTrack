import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/common/guards';
import { AuthLabModule } from './auth-lab/auth-lab.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthLabModule,
    CloudinaryModule,
    MedicalHistoryModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
  ],
})
export class AppModule {}
