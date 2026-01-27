import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('setUserBudget')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async create(@Body() createBudgetDto: CreateBudgetDto, @Req() req) {
    const userId = req.user.sub;
    return (await this.budgetService.create(createBudgetDto, userId)).populate(
      'user',
    );
  }

  @Get('getUserBudget')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  // getMyBudget(@Res({ passthrough: true }) res: Response) {
  getMyBudget(@Req() req) {
    const userId = req.user.sub;
    return this.budgetService.getUserBudget(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.budgetService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
  //   return this.budgetService.update(+id, updateBudgetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.budgetService.remove(+id);
  // }
}
