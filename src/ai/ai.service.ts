import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Ai, AiSchema } from './schema/ai.schema';

const CATEGORY_LIST = ['Electronic', 'Grocery', 'Fashion', 'Cosmetics'];
const SIZE_LIST = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'standard'];

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is missing in environment variables',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateProduct(createAiDto: CreateAiDto) {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const prompt = `
You are an eCommerce product content writer.

Product Name: ${createAiDto.name}
Price: ${createAiDto.price}
Gender: ${createAiDto.gender}

Choose ONLY ONE category from the list below:
[Electronic, Grocery, Fashion, Cosmetics]

Choose ONLY ONE size from the list below:
[xs, sm, md, lg, xl, xxl, standard]

Generate SEO-friendly content.
Return ONLY valid JSON in this format:

{
  "title": "",
  "description": "",
  "category": "",
  "size": ""
}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean markdown code blocks
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate category
    if (!CATEGORY_LIST.includes(parsed.category)) {
      parsed.category = 'Fashion'; // default
    }

    // Validate size
    if (!SIZE_LIST.includes(parsed.size)) {
      parsed.size = 'standard'; // default
    }

    return {
      name: createAiDto.name,
      price: createAiDto.price,
      stock: createAiDto.stock,
      gender: createAiDto.gender,
      ...parsed,
    };
  }
}
