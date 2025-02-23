import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthLabService } from './auth-lab.service';
import { SignInDto, SignUpDto } from './dto';
import { GetCurrentLabId } from './common/decorator/get-current-lab-id.decorator';
import { Public } from './common/decorator/public.decorator';
import { RefreshTokenGuard } from './common/guards';
import { GetCurrentLab } from './common/decorator/get-current-lab.decorator';

@Controller('lab/auth')
export class AuthLabController {
    constructor(private authService: AuthLabService) {}

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto)
    }

@Public()   
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@GetCurrentLabId() labId: number) {
        return this.authService.logout(labId)
    }

    
    @Public()
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshTokens(
        @GetCurrentLabId() labId: number,
        @GetCurrentLab('refreshToken') refreshToken: string
    ){
        return this.authService.refreshTokens(labId,refreshToken)
    }
}
