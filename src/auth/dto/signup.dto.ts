import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

enum Rating {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
}

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{12}$/, { message: 'Aadhar number must be exactly 12 digits' })
    aadharNumber: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be exactly 10 digits' })
    mobile: string
    
    @IsNotEmpty()
    @IsString()
    location: string

    @IsOptional()
    @IsDate()
    dob?: Date|null
}