import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
    constructor( private configService: ConfigService) {
        cloudinary.config({
            cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.get('CLOUDINARY_API_KEY'),
            api_secret: configService.get('CLOUDINARY_API_SECRET')
        })
    }

    async uploadOnCloudinary(localFilePath: string) {
        try {
            if(!localFilePath) {
                throw new InternalServerErrorException("Unable to upload File")
            }
            const response = await cloudinary.uploader.upload(
                localFilePath, 
                {
                    folder: 'uploads',
                    resource_type: 'raw',
                    access_mode: 'public'
                }
            );
            return response
        } catch (error) {
            throw new InternalServerErrorException("Unable to upload file in cloudinary ", error)
        }
    }
    async deleteFromCloudinary(public_id: string) {
        try {
            if(!public_id) {
                throw new NotFoundException("Public Id not found")
            }
            const response = await cloudinary.uploader.destroy(public_id)
            return response
        } catch (error) {
            throw new InternalServerErrorException("Unable to delete reports", error)
        }
    }
}
