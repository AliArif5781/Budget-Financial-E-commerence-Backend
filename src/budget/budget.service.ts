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
            budgetAmount: createBudgetDto.budgetAmount,
            budgetCurrency: createBudgetDto.budgetCurrency,
            user: userId,
          },
          {
            new: true,
            upsert: true,
          },
        )
        .populate('user');

      return budget;
    } catch (error) {
      throw new Error('Failed To set Budget, Try Again');
    }
  }
  async getUserBudget(userId: string) {
    return await this.budgetModel.findOne({ user: userId });
  }
}

// findOne(id: number) {
//   return `This action returns a #${id} budget`;
// }

// update(id: number, updateBudgetDto: UpdateBudgetDto) {
//   return `This action updates a #${id} budget`;
// }

// remove(id: number) {
//   return `This action removes a #${id} budget`;
// }
