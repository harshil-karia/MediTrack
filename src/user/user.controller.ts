import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentLabId } from 'src/auth-lab/common/decorator/get-current-lab-id.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('getUser/:aadhar')
    getUser(@Param('aadhar') aadhar: string,
        @GetCurrentLabId() labId: number
    ) {
        return this.userService.getUserByAadhar(aadhar,labId)
    }
}
