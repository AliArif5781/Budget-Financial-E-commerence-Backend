import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './entities/report.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  async create(createReportDto: CreateReportDto, userId: string) {
    try {
      return await this.reportModel.create({
        message: createReportDto.message,
        user: userId,
      });
    } catch (error) {
      throw new Error('Failed to send report');
    }
  }

  async findAllReport() {
    return await this.reportModel
      .find()
      .lean()
      .populate('user', 'firstName LastName email');
  }

  async findOne(userId: string) {
    const check = await this.reportModel.find({ user: userId });

    if (!check) throw new NotFoundException('Didnot found report');

    return check;
  }

  async solvedReport(
    reportId: string,
    adminId: string,
    updateReportDto: UpdateReportDto,
  ) {
    const report = await this.reportModel.findById(reportId);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.solved) {
      return { message: 'Report already solved' };
    }

    report.solved = updateReportDto.solved ?? true;
    await report.save();

    await this.reportModel.findByIdAndDelete(reportId);

    return {
      reportId: report._id,
    };
  }
}
