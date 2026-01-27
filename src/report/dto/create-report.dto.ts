import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/schema/user.schema';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsBoolean()
  solved?: boolean;
}
