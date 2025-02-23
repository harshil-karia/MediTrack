import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2'

@Injectable()
export class AuthLabService {
    constructor(
            private prisma: PrismaService,
            private jwtService: JwtService,
            private config: ConfigService
        ){}
    
        //Creating and storing lab (signUp)
        async signUp(dto: SignUpDto): Promise<any>{
            
            const password = await argon.hash(dto.password)
            try {
                const lab = await this.prisma.laboratory.create({
                    data: {
                        email: dto.email,
                        password,
                        name: dto.name,
                        mobile: dto.mobile,
                        doctorName: dto.doctorName,
                        registration: dto.registration
                    }
                })
                const tokens = await this.getTokens(lab.id, lab.email) //fetch the tokens
                //await this.updateRefreshToken(lab.id, tokens.refresh_token) //put the refresh token in database
                return tokens  
            } catch (error) {
                // Exception for the duplicate entry and to find which value is duplicate
                if(error.code === 'P2002'){
                    const mobile = await this.prisma.laboratory.findUnique({
                        where: {
                            mobile: dto.mobile
                        }
                    })
                    if(mobile){
                        throw new HttpException('Duplicate mobile',HttpStatus.CONFLICT)
                    }
                    const email = await this.prisma.laboratory.findUnique({
                        where: {
                            email: dto.email
                        }
                    })
                    if(email) {
                        throw new HttpException('Duplicate email',HttpStatus.CONFLICT)
                    }
                }
            }
            
        }
    
        //For login
        async signIn(dto: SignInDto): Promise<any>{
            const lab = await this.prisma.laboratory.findUnique({
                where: {
                    email: dto.email
                }
            })
    
            //For invalid email id
            if(!lab) {
                throw new ForbiddenException('Invalid email id')
            }
            
            // Check for the password conversion
            const success = await argon.verify(lab.password,dto.password)
            if(!success) {
                throw new ForbiddenException('Invalid Password')
            }
    
            //Genrate tokens
            const tokens = await this.getTokens(lab.id, lab.email) //fetch the tokens
            //await this.updateRefreshToken(lab.id, tokens.refresh_token) //put the refresh token in database
            return tokens
    
        }
    
        //For logout
        async logout(labId: number){
            await this.prisma.laboratory.updateMany({
                where:{
                    id: labId,
                    refreshToken: {
                        not: null
                    }
                },
                data: {
                    refreshToken: null
                }
            })
            return {
                msg: 'Lab User logged out'
            }
        }
    
        //For refresh the refresh token (increase validity of access token)
        async refreshTokens(labId: number, refreshToken: string) {
            const lab = await this.prisma.laboratory.findUnique({
                where: {
                    id: labId
                }
            })
            if(!lab || !lab.refreshToken) {
                throw new ForbiddenException('Invalid Lab User')
            }
            //console.log(lab.refreshToken)
            console.log()
            const success = await argon.verify(lab.refreshToken, refreshToken)
            if(!success) {
                throw new ForbiddenException('Invalid Credentials')
            }
            //Genrate tokens
            const tokens = await this.getTokens(lab.id, lab.email) //fetch the tokens
            //await this.updateRefreshToken(lab.id, tokens.refresh_token) //put the refresh token in database
            return tokens
        }
    
    
        //Create the refresh and access tokens
        async getTokens(labId: number, email: string){
            const [at, rt] = await Promise.all([
                this.jwtService.signAsync({
                    sub: labId,
                    email,
                }, {
                    secret: 'at-secret',
                    expiresIn: '15m',
                }),
                this.jwtService.signAsync({
                    sub: labId,
                    email,
                }, {
                    secret: 'rt-secret',
                    expiresIn:'15d'
                })
    
            ])
            await this.updateRefreshToken(labId, rt)
            return {
                access_token: at,
                refresh_token: rt,
            }
        }
    
        //function to add the refresh token in lab table
        async updateRefreshToken(labId: number, refreshToken: string){
            const hash = await argon.hash(refreshToken);
            await this.prisma.laboratory.update({
                where: {
                    id: labId
                }, 
                data: {
                    refreshToken: hash
                }
            })
        }   
}
