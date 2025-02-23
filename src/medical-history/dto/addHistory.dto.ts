import { IsArray, IsDate, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class AddHistoryDto {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    date: string

    @IsString()
    @IsOptional()
    doctorName: string
}