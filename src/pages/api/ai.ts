import axios from 'axios';

export interface AIResponse {
  arguments: any; // Replace 'any' with a specific type if you have one
}

export async function getAIResponse(prompt: string): Promise<AIResponse> {
  // Check for required environment variables
  const requiredEnvVars = ['ANTHROPIC_API_KEY', 'MAX_TOKENS_TO_SAMPLE'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set. Please set it in the .env file.`);
    }
  }

  // Detect if running in a Codespace and use GitHub Codespace Secrets instructions if so
  if (process.env.CODESPACES) {
    const codespaceEnvVars = ['GITHUB_CODESPACE_SECRET_ANTHROPIC_API_KEY', 'GITHUB_CODESPACE_SECRET_MAX_TOKENS_TO_SAMPLE'];
    for (const envVar of codespaceEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is not set. Please set it in the GitHub Codespace Secrets.`);
      }
    }
  }

  try {
    const anthropicResponse = await axios.post(
      'https://api.anthropic.com/v1/complete',
      {
        prompt: prompt,
        max_tokens_to_sample: parseInt(process.env.MAX_TOKENS_TO_SAMPLE as string, 10),
        temperature: 0.5,
        stop_sequences: ["\n\n", "\nHuman:", "\nAssistant:"],
        model: 'claude-v1',
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY as string,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const completion = anthropicResponse.data.completion;

    if (!completion) {
      throw new Error('No completion in AI response');
    }

    // Log the completion for debugging purposes
    console.log('AI Completion:', completion);

    // Extract JSON from the completion
    const jsonString = extractJSON(completion);

    // Attempt to parse jsonString as JSON
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Invalid JSON String:', jsonString);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!parsed.arguments) {
      throw new Error('AI response JSON does not contain "arguments"');
    }

    return parsed;
  } catch (error: any) {
    console.error('Error communicating with Anthropic API:', error.response?.data || error.message);
    throw new Error('Failed to communicate with AI engine');
  }
}

// Helper function to extract JSON from the AI response
function extractJSON(text: string): string {
  // Attempt to find the JSON object starting from the first {
  const jsonStartIndex = text.indexOf('{');
  if (jsonStartIndex !== -1) {
    const jsonString = text.substring(jsonStartIndex).trim();
    return jsonString;
  }
  throw new Error('Failed to extract JSON from AI response');
}
