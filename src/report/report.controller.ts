import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/user/role.guard';
import { Roles } from 'src/user/role.decrorator';
import { Role } from 'src/user/types/user.type';
import { Auth } from 'src/auth/entities/auth.entity';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('saveUserReport')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async create(@Body() createReportDto: CreateReportDto, @Req() req) {
    const userId = req.user.sub;
    return await this.reportService.create(createReportDto, userId);
  }

  @Get('allReport')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  findAll() {
    return this.reportService.findAllReport();
  }

  @Get('getUserReport')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async findOne(@Req() req) {
    const userId = req.user.sub;
    return await this.reportService.findOne(userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.reportService.solvedReport(id, userId, updateReportDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reportService.remove(+id);
  // }
}
