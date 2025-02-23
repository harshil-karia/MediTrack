import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddHistoryDto } from './dto';
import * as fs from 'fs'

@Injectable()
export class MedicalHistoryService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
        private authService: AuthService
    ) {}

    async getHistory(user: any) {
        if(user == null) {
            throw new ForbiddenException("Please Login")
        }
        const history = await this.prisma.medicalHistory.findMany({
            select: {
                description: true,
                date: true,
                name: true,
                doctorName: true,
                laboratory: {
                    select: {
                        name: true,
                    }
                },
                reports: {
                    select: {
                        url: true,
                    }
                }
            }
        })
        const tokens = await this.authService.getTokens(user.sub,user.email)
        const at = tokens.access_token
        return {
            at,
            history
        }

    }
    
    async addHistory(dto: AddHistoryDto,report: Express.Multer.File, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if(!user) {
            throw new ForbiddenException("Invalid User")
        }

        try {
            const uploadResult = await this.cloudinaryService.uploadOnCloudinary(report.path)
            const history = await this.prisma.medicalHistory.create({
                data: {
                    user: {
                        connect: {id: userId}
                    },
                    description: dto.description,
                    name: dto.name,
                    doctorName: dto.doctorName,
                    date: dto.date,
                    reports: {
                        create: {
                            url: uploadResult.secure_url,
                            public_id: uploadResult.public_id,
                            user: {
                                connect: {id: userId}
                            }
                        }
                    }
                }
            })
            const tokens = await this.authService.getTokens(userId,user.email)
            const at = tokens.access_token
            return {
            at,
            history
        }
        } catch (error) {
            throw new InternalServerErrorException("Unable to add history",error)   
        } finally {
            fs.unlink(report.path, (err) => {})
        }
    }
}
