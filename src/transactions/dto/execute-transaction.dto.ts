import { IsNumber, IsString, Min } from "class-validator";

export class TwoAccountsTransactionDto {
  
  @IsNumber()
  @Min(0)
  amount: number;
  
  @IsString()
  account: string;
  
  @IsString()
  transferTo: string;
}

export class OneAccountTransactionDto {
  @IsNumber()
  @Min(0)
  amount: number;
  
  @IsString()
  account: string;
}
