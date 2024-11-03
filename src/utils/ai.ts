import axios from 'axios';

export interface AIResponse {
  arguments: Array<{
    assertion: string;
    reasoning: string;
    evidence: Array<{
      content: string;
      source: string;
      date: string;
    }>;
    significance: string;
    result: string;
    certainty: number;
    assessment: {
      aStrength: string;
      rStrength: string;
      eStrength: string;
      sStrength: string;
      rWeakness: string;
    };
  }>;
}

export async function getAIResponse(prompt: string): Promise<AIResponse> {
  try {
    const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/complete';
    
    // Format prompt according to Anthropic's requirements
    const formattedPrompt = `\n\nHuman: ${prompt}\n\nAssistant:`;
    
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        prompt: formattedPrompt,
        max_tokens_to_sample: 2000,
        temperature: 0.7,
        model: 'claude-v1',
        stop_sequences: ["\n\nHuman:", "\n\nAssistant:"],
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const completion = response.data.completion;
    if (!completion) {
      throw new Error('No completion in AI response');
    }

    const jsonStr = extractJSON(completion);
    const parsed = JSON.parse(jsonStr);

    if (!parsed.arguments || !Array.isArray(parsed.arguments)) {
      throw new Error('Invalid response format');
    }

    return parsed;
  } catch (error: any) {
    console.error('AI API Error:', error.response?.data || error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
}

function extractJSON(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON found in response');
  }
  
  const jsonStr = text.slice(start, end + 1);
  try {
    JSON.parse(jsonStr); // Validate JSON
    return jsonStr;
  } catch {
    throw new Error('Invalid JSON in response');
  }
}
