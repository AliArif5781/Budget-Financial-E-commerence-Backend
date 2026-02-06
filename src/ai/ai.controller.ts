import { Controller, Get, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-product')
  @SkipThrottle()
  async generate(@Body() createAiDto: CreateAiDto) {
    return this.aiService.generateProduct(createAiDto);
  }
}
