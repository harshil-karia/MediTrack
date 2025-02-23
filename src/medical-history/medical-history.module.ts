import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer/multer.options';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    JwtModule.register({}),
    CloudinaryModule,
    MulterModule.register(multerOptions)
  ],
  providers: [MedicalHistoryService,AuthService],
  controllers: [MedicalHistoryController]
})
export class MedicalHistoryModule {}
