import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthLabService } from 'src/auth-lab/auth-lab.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthLabService,
    ) {}

    async getUserByAadhar(aadhar: string, labId: number) {
        if(!aadhar) {
            throw new BadRequestException("Please Enter Aadhar Number")
        }
        if(!labId) {
            throw new ForbiddenException('Invalid Credentials')
        }

        const lab = await this.prisma.laboratory.findUnique({
            where: {
                id: labId
            }
        })
        if(!lab) {
            throw new ForbiddenException('Invalid Credentials')
        }

        const user = await this.prisma.user.findUnique({
            where: {
                aadharNumber: aadhar
            }
        })

        const tokens = await this.authService.getTokens(labId, lab.email)
        const at = tokens.access_token
        return {
            at,
            user
        }
    }
}
