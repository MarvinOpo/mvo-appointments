import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  DepartmentAiAssistantDto,
  GenerateSoapDto,
} from './dto/create-ai-assistant.dto';

import { mvo_appointments } from '../db/prisma';

@Injectable()
export class AiAssistantService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async departmentHelp(dto: DepartmentAiAssistantDto) {
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

  async generateSoap(dto: GenerateSoapDto) {
    const prompt = this.buildSoapPrompt(dto);
    return this.callGeminiAndParse(prompt);
  }

  private async callGeminiAndParse(prompt: string, attempt = 1): Promise<any> {
    const interaction = await this.ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
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

  private buildPrompt(dto: DepartmentAiAssistantDto, departments: unknown[]) {
    return `You are helping match a patient to the correct hospital department for a consultation.

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
            }

            Patient info:
            - Complaint: ${dto.complaint}
            ${dto.location ? `- Location of symptom: ${dto.location}` : ''}
            - Symptom duration: ${dto.duration}
            - Severity: ${dto.severity}
            - Sex: ${dto.sex}
            - Age: ${dto.age}`;
  }

  private buildSoapPrompt(dto: GenerateSoapDto) {
    return `You are a clinical documentation assistant helping a doctor draft a SOAP note
            from teleconsultation call notes. This is a remote consultation — no physical
            exam was performed, so do not invent findings that require hands-on examination
            (e.g. palpation, auscultation) unless explicitly reported below.

            Instructions:
            - Subjective: summarize the patient's reported complaint, history, and symptoms
              in clinical narrative form, based only on what's given below.
            - Objective: include only what was actually observable remotely (visual/audio
              observations, self-reported vitals if given). If nothing objective was
              recorded, state that no objective findings were obtained via this
              teleconsultation.
            - Assessment: give a working clinical impression based on the subjective and
              objective data. Do not state a definitive diagnosis if genuinely uncertain —
              phrase as differential/impression instead.
            - Plan: reasonable next steps (e.g. medication, referral, follow-up, in-person
              exam if needed) consistent with the assessment.
            - Do not fabricate details not present in the notes below.
            - Write in professional clinical documentation style, concise, no bullet lists
              unless naturally appropriate.

            Respond ONLY with JSON, no other text, in this exact shape:
            {
              "subjective": string,
              "objective": string,
              "assessment": string,
              "plan": string
            }

            Call notes:
            - Chief complaint: ${dto.chief_complaint}
            ${dto.history_of_present_illness ? `- History of present illness: ${dto.history_of_present_illness}` : ''}
            ${dto.symptoms_reported ? `- Symptoms reported: ${dto.symptoms_reported}` : ''}
            ${dto.relevant_history ? `- Relevant history: ${dto.relevant_history}` : ''}
            ${dto.visual_audio_observations ? `- Visual/audio observations: ${dto.visual_audio_observations}` : ''}
            ${dto.self_reported_vitals ? `- Self-reported vitals: ${dto.self_reported_vitals}` : ''}
            ${dto.additional_notes ? `- Additional notes: ${dto.additional_notes}` : ''}`;
  }
}
