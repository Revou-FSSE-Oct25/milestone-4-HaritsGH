import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  favnum?: number;
  
  @IsString()
  @IsOptional()
  fullname?: string;
}
