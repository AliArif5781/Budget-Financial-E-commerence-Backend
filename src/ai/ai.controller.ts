import { Controller, Get, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-product')
  async generate(@Body() createAiDto: CreateAiDto) {
    return this.aiService.generateProduct(createAiDto);
  }
}
