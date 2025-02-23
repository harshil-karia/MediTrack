import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MedicalHistoryService } from './medical-history.service';
import { AddHistoryDto } from './dto';
import { GetCurrentUser, GetCurrentUserId } from 'src/auth/common/decorator';

MulterModule.register({
    storage: diskStorage({
        destination: './uploads',
        filename(req,file,callback) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = extname(file.originalname)
            callback(null,`${file.fieldname}-${uniqueSuffix}-${ext}`);
        },
    })
})


@Controller('medical-history')
export class MedicalHistoryController {
    constructor(private medicalHistoryService: MedicalHistoryService) {}

    @Get('getHistory')
    @HttpCode(HttpStatus.OK)
    async getHistory(@GetCurrentUser() user: any) {
        return this.medicalHistoryService.getHistory(user)
    }

    @Post('addHistory')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('report'))
    async addHistory(
        @Body() dto: AddHistoryDto,
        @UploadedFile() report: Express.Multer.File,
        @GetCurrentUserId() userId: number

    ) {
        return this.medicalHistoryService.addHistory(dto,report,userId)
    }

}
