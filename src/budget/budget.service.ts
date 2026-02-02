import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './schema/budget.schema';
import { Model } from 'mongoose';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    try {
      const budget = await this.budgetModel
        .findOneAndUpdate(
          { user: userId }, // ✅ correct filter
          {
            budgetAmount: createBudgetDto.budgetAmount.toFixed(2),
            budgetCurrency: createBudgetDto.budgetCurrency,
            user: userId,
          },
          {
            new: true,
            upsert: true,
          },
        )
        .populate('user');

      console.log(budget);
      return budget;
    } catch (error) {
      throw new Error('Failed To set Budget, Try Again');
    }
  }
  async getUserBudget(userId: string) {
    return await this.budgetModel.findOne({ user: userId });
  }
}
