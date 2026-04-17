import { IsNumber, Min } from "class-validator";

export class UpdateAccountDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
