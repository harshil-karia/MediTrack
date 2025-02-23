import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[ConfigModule],
  providers: [CloudinaryService,CloudinaryProvider],
  controllers: [CloudinaryController],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
