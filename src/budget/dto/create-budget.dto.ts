import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export enum BudgetLevel {
  $ = '$',
  Rs = 'Rs',
}

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  budgetAmount: number;

  @IsOptional()
  @IsBoolean()
  budgetSet: boolean;

  @IsNotEmpty()
  budgetCurrency: BudgetLevel;
}
