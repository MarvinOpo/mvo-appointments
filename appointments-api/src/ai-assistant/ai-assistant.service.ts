import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateAiAssistantDto } from './dto/create-ai-assistant.dto';

import { mvo_appointments } from '../db/prisma';

@Injectable()
export class AiAssistantService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async departmentHelp(dto: CreateAiAssistantDto) {
    const departments = await mvo_appointments.departments.findMany({
      where: {
        schedules: {
          some: { type: dto.type },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const prompt = this.buildPrompt(dto, departments);

    return this.callGeminiAndParse(prompt);
  }

  private async callGeminiAndParse(prompt: string, attempt = 1): Promise<any> {
    const interaction = await this.ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: prompt,
    });

    const rawOutput = interaction.output_text;

    if (!rawOutput) {
      console.error(`[AiAssistant] Empty response (attempt ${attempt})`);
      if (attempt < 2) return this.callGeminiAndParse(prompt, attempt + 1);
      throw new Error('AI returned an empty response');
    }

    const match = rawOutput.match(/\{[\s\S]*\}/);

    if (!match) {
      console.error(
        `[AiAssistant] No JSON object found (attempt ${attempt}):`,
        rawOutput,
      );
      if (attempt < 2) return this.callGeminiAndParse(prompt, attempt + 1);
      throw new Error('AI returned an unparseable response');
    }

    try {
      return JSON.parse(match[0]);
    } catch (err) {
      console.error(
        `[AiAssistant] JSON.parse failed (attempt ${attempt}):`,
        match[0],
      );
      if (attempt < 2) return this.callGeminiAndParse(prompt, attempt + 1);
      throw new Error('AI returned an unparseable response');
    }
  }

  private buildPrompt(dto: CreateAiAssistantDto, departments: unknown[]) {
    return `You are helping match a patient to the correct hospital department for a consultation.
            Patient info:
            - Complaint: ${dto.complaint}
            ${dto.location ? `- Location of symptom: ${dto.location}` : ''}
            - Symptom duration: ${dto.duration}
            - Severity: ${dto.severity}
            - Sex: ${dto.sex}F
            - Age: ${dto.age}

            Available departments:
            ${JSON.stringify(departments, null, 2)}

            Instructions:
            - Match based on the department's description, not just keyword overlap.
            - Consider anatomical location and likely cause, not just the symptom word.
              e.g. bone/joint pain in limbs or spine -> Orthopedics; pain in jaw, face,
              or teeth -> ENT or Dental, not Orthopedics; ear/nose/throat symptoms -> ENT
              even if described as "pain" or "swelling".
            - Return your top 1-2 candidates. If genuinely ambiguous, return 2.

            Respond ONLY with JSON, no other text, in this exact shape:
            {
              "recommendations": [
                { "department_id": number, "confidence": "high" | "medium" | "low", "reason": string }
              ]
            }`;
  }
}
