export type DebateFormat = 'Policy' | 'LD' | 'Public Forum' | 'MSPDP';

export interface Evidence {
  content: string;
  source: string;
  date: string;
}

export interface Score {
  value: number;
  reason: string;
}

export interface Assessment {
  aStrength?: string;
  rStrength?: string;
  eStrength?: string;
  sStrength?: string;
  rWeakness?: string;
  aScore: Score;
  rScore: Score;
  eScore: Score;
  sScore: Score;
  overallScore: Score;
}

export interface ArgumentContext {
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface ArgumentGroup {
  topic: string;
  relevance: number;
  arguments: Argument[];
}

export interface Argument {
  id: string;
  assertion: string;
  reasoning: string;
  evidence: Evidence[];
  significance: string;
  result: string;
  certainty: number;
  format: DebateFormat; // Ensure format is included
  title: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  assessment?: Assessment; // Add assessment field
  context?: ArgumentContext;
  relevance: number;
  topic: string;
}

export interface ParsedArgumentsResponse {
  arguments: Argument[];
}
