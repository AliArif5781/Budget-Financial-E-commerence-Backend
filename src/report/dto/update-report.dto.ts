import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @IsOptional()
  @IsBoolean()
  solved: boolean;

  //   @IsString()
  //   _id: string;
}
