import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Ai, AiSchema } from './schema/ai.schema';

@Module({
  // imports: [MongooseModule.forFeature([{ name: Ai.name, schema: AiSchema }])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
