import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min } from "class-validator";

export class TwoAccountsTransactionDto {
  
  @ApiProperty({
    description: 'Amount to transfer',
    example: 67.42,
  })
  @IsNumber()
  @Min(0)
  amount: number;
  
  @ApiProperty({
    description: 'Account generated ID to transfer from',
    example: 'k8ojs7zx',
  })
  @IsString()
  account: string;
  
  @ApiProperty({
    description: 'Account generated ID to transfer to',
    example: 'sl92zpxk',
  })
  @IsString()
  transferTo: string;
}

export class OneAccountTransactionDto {
  @ApiProperty({
    description: 'Amount to deposit/withdraw',
    example: 21.88,
  })
  @IsNumber()
  @Min(0)
  amount: number;
  
  @ApiProperty({
    description: 'Account generated ID to deposit/withdraw',
    example: 'sl92zpxk',
  })
  @IsString()
  account: string;
}
