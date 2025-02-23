import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

export class SignUpDto{

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    registration: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
    mobile: string
    
    @IsNotEmpty()
    @IsString()
    doctorName: string
}