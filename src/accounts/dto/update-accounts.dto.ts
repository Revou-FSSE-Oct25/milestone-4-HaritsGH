import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Balance amount to update',
    example: 21.88,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
