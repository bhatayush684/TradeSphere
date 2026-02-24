export type AIInsightType = 'preTrade' | 'live' | 'postTrade' | 'behavioral';

export type AISeverity = 'info' | 'warning' | 'critical';

export interface AIInsight {
  id: string;
  type: AIInsightType;
  message: string;
  severity: AISeverity;
  timestamp: string;
}

