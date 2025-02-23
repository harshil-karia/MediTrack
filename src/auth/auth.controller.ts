import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { RefreshTokenGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorator';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentLabId } from '../auth-lab/common/decorator/get-current-lab-id.decorator';


@Controller('user/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signUp(@Body() dto: SignUpDto){
        return this.authService.signUp(dto)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() dto: SignInDto): Promise<any>{
        return this.authService.signIn(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@GetCurrentLabId() userId: number){
        // const user = req.user;
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string
    ){
        //const user = req.user;
        return this.authService.refreshTokens(userId,refreshToken)
    }

    @Public()
    @Get('google')
    @UseGuards(AuthGuard('oauth'))
    googleAuth() {
    }


}
