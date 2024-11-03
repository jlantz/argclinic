import type { NextApiRequest, NextApiResponse } from 'next';
import { getAIResponse } from '../../utils/ai'; // Update import path
import { Argument, ParsedArgumentsResponse } from '../../types/argument';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, format, resolution } = req.body;

  // Enhanced input validation
  if (!text?.trim()) {
    return res.status(400).json({ 
      error: 'Please enter your argument text',
      field: 'text'
    });
  }

  if (!format) {
    return res.status(400).json({ 
      error: 'Please select a debate format',
      field: 'format'
    });
  }

  if (!resolution?.trim()) {
    return res.status(400).json({ 
      error: 'Please select or enter a resolution',
      field: 'resolution'
    });
  }

  // Check for required environment variables
  const requiredEnvVars = ['ANTHROPIC_API_KEY', 'MAX_TOKENS_TO_SAMPLE'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      return res.status(500).json({
        error: `Environment variable ${envVar} is not set. Please set it in the .env file.`,
      });
    }
  }

  // Detect if running in a Codespace and use GitHub Codespace Secrets instructions if so
  const isCodespace = process.env.CODESPACES === 'true';
  if (isCodespace) {
    const codespaceEnvVars = ['GITHUB_CODESPACE_SECRET_ANTHROPIC_API_KEY', 'GITHUB_CODESPACE_SECRET_MAX_TOKENS_TO_SAMPLE'];
    for (const envVar of codespaceEnvVars) {
      if (!process.env[envVar]) {
        return res.status(500).json({
          error: `Environment variable ${envVar} is not set. Please set it in the GitHub Codespace Secrets.`,
        });
      }
    }
  }

  try {
    const prompt = `Analyze this debate argument in relation to the resolution, using standard debate terminology and logical analysis. Provide specific reasons for each score.

Resolution: ${resolution}
Format: ${format}
Argument Text: ${text}

Return a JSON object with this exact structure:
{
  "arguments": [{
    "assertion": "claim",
    "reasoning": "logic",
    "evidence": [{"content": "evidence", "source": "source", "date": "date"}],
    "significance": "impact",
    "result": "conclusion",
    "certainty": 0.0-1.0,
    "assessment": {
      "aScore": {"value": 0.0-1.0, "reason": "why"},
      "rScore": {"value": 0.0-1.0, "reason": "why"},
      "eScore": {"value": 0.0-1.0, "reason": "why"},
      "sScore": {"value": 0.0-1.0, "reason": "why"},
      "overallScore": {"value": 0.0-1.0, "reason": "why"},
      "aStrength": "strength description",
      "rStrength": "strength description",
      "eStrength": "strength description",
      "sStrength": "strength description",
      "rWeakness": "weakness description"
    },
    "tagline": "summary of the argument"
  }]
}`;

    const aiResponse = await getAIResponse(prompt);
    
    // Enhanced validation of AI response
    if (!aiResponse?.arguments?.length) {
      return res.status(400).json({ 
        error: 'The AI could not identify any valid arguments in the text. Please ensure your text contains clear debate arguments.',
        field: 'text'
      });
    }

    // Validate and filter responses with detailed feedback
    const filteredArguments = aiResponse.arguments
      .filter((arg: any) => {
        const isValid = 
          arg.certainty > 0.2 && 
          !arg.assertion.includes('suck') &&
          arg.reasoning?.length > 0;

        if (!isValid) {
          console.log(`Filtered argument with certainty ${arg.certainty}, reasoning length ${arg.reasoning?.length}`);
        }

        return isValid;
      })
      .map((arg: any) => ({
        ...arg,
        id: generateId(),
        format,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

    if (filteredArguments.length === 0) {
      return res.status(400).json({ 
        error: 'No valid arguments found. Your arguments may be too weak or inappropriate. Please provide clear, relevant debate arguments.',
        field: 'text',
        details: 'Arguments should have clear assertions, reasoning, and be relevant to the resolution.'
      });
    }

    res.status(200).json({ arguments: filteredArguments });
  } catch (error: any) {
    console.error('Error in parse-argument:', error);
    res.status(500).json({ 
      error: 'Failed to analyze arguments. Please try again.',
      details: error.message
    });
  }
}

function generateId() {
  return `arg_${Math.random().toString(36).substr(2, 9)}`;
}
