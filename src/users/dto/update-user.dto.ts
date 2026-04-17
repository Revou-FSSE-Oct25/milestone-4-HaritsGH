import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional, Min } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Favorite number',
    example: 7,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  favnum?: number;
  
  @ApiPropertyOptional({
    description: 'Full name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  fullname?: string;
}
