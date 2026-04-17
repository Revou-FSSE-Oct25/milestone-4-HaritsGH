import { IsEmail, IsInt, IsOptional, IsString, Min } from "class-validator";

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  userpw: string;

  @IsString()
  fullname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  favNum?: number;
}