import { SizeChart } from '../types/charts';
import { UserMeasurements, FitRecommendationResult, calculateFitRecommendation } from '../lib/fit-scoring';

const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com/chat/completions';

export interface DeepSeekOptions {
  apiKey?: string;
  model?: 'deepseek-chat' | 'deepseek-reasoner';
  customInstructions?: string;
}

/**
 * Validates a DeepSeek API key by making a lightweight test request.
 */
export async function testDeepSeekConnection(
  apiKey: string,
  model: string = 'deepseek-chat'
): Promise<{ success: boolean; message: string; model?: string }> {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return { success: false, message: 'API key is required.' };
  }

  const cleanKey = apiKey.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(DEEPSEEK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a test assistant.' },
          { role: 'user', content: 'Ping' },
        ],
        max_tokens: 10,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData?.error?.message ||
        `DeepSeek API responded with HTTP status ${response.status} (${response.statusText})`;
      return { success: false, message: errorMsg };
    }

    const data = await response.json();
    return {
      success: true,
      message: `Successfully connected to DeepSeek (${data.model || model})!`,
      model: data.model || model,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: false, message: 'Connection timed out after 10 seconds.' };
    }
    return { success: false, message: err.message || 'Failed to connect to DeepSeek API.' };
  }
}

/**
 * Uses DeepSeek AI to analyze customer measurements against a size chart and produce
 * an intelligent, personalized fit recommendation with explanations and tips.
 * Falls back to deterministic rule-based calculation if AI is unavailable or fails.
 */
export async function calculateAIFitRecommendation(
  chart: SizeChart,
  user: UserMeasurements,
  unit: 'cm' | 'in' = 'cm',
  options?: DeepSeekOptions
): Promise<FitRecommendationResult | null> {
  const fallbackResult = calculateFitRecommendation(chart, user, unit);

  // Determine API key from options, chart config, or process.env
  const apiKey =
    options?.apiKey?.trim() ||
    chart.fitFinderConfig?.deepseekApiKey?.trim() ||
    (typeof globalThis !== 'undefined' ? (globalThis as any).process?.env?.DEEPSEEK_API_KEY?.trim() : undefined) ||
    (import.meta as any).env?.DEEPSEEK_API_KEY?.trim();

  if (!apiKey) {
    // No API key available: return deterministic scoring result
    return fallbackResult;
  }

  const model = options?.model || chart.fitFinderConfig?.aiModel || 'deepseek-chat';
  const customInstructions =
    options?.customInstructions ||
    chart.fitFinderConfig?.aiCustomInstructions ||
    '';

  // Format chart rows and columns for the AI
  const availableSizes = chart.rows.map((r) => r.size);
  const chartTableFormatted = chart.rows
    .map((r) => {
      const colDetails = chart.columns
        .filter((c) => !c.isSizeColumn)
        .map((c) => `${c.name}: ${r.values[c.id] || 'N/A'}`)
        .join(', ');
      return `Size [${r.size}]: ${colDetails}`;
    })
    .join('\n');

  // Format user inputs
  const userMeasurementsFormatted = Object.entries(user)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${v}${typeof v === 'number' && k !== 'age' && k !== 'weight' ? unit : k === 'weight' ? 'kg' : ''}`)
    .join(', ');

  const systemPrompt = `You are an expert fashion sizing specialist and fit advisor for an e-commerce apparel store.
Your job is to analyze customer measurements against a merchant's size chart and recommend the single best size.

Available sizes in this chart: ${JSON.stringify(availableSizes)}.
Unit used in user inputs: ${unit}.
Chart default unit: ${chart.defaultUnit}.

Guidelines:
1. ALWAYS choose "recommendedSize" strictly from the available sizes list: ${JSON.stringify(availableSizes)}.
2. If customer is between two sizes, set "isBetweenSizes" to true and provide "alternativeSize".
3. Consider user's fit preference (slim, regular, or relaxed).
4. Provide "aiReasoning": A friendly, reassuring 1-2 sentence explanation of why this size fits best.
5. Provide "fitTips": Practical tip for wearing or choosing this item.
6. Provide "confidence": A number from 50 to 99 representing your confidence percentage.
7. Return ONLY valid JSON matching this exact structure:
{
  "recommendedSize": string,
  "confidence": number,
  "isBetweenSizes": boolean,
  "alternativeSize": string or null,
  "aiReasoning": string,
  "fitTips": string,
  "explanation": {
    "fitNote": string,
    "matchingMeasurements": [
      { "name": string, "userValue": number, "chartRange": string, "status": "exact" | "close" | "outside" }
    ]
  }
}`;

  const userPrompt = `Size Chart Name: ${chart.name}
Garment Type: ${chart.chartType}
${customInstructions ? `Brand Fit Notes: ${customInstructions}\n` : ''}
Size Chart Data:
${chartTableFormatted}

Customer Measurements & Fit Preference:
${userMeasurementsFormatted}

Please evaluate and return the JSON recommendation.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const response = await fetch(DEEPSEEK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[DeepSeek AI] Request failed with status ${response.status}. Using fallback scoring.`);
      return fallbackResult;
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      return fallbackResult;
    }

    const parsed = JSON.parse(rawContent);

    // Validate that recommended size exists in chart
    if (!parsed.recommendedSize || !availableSizes.includes(parsed.recommendedSize)) {
      console.warn(`[DeepSeek AI] Recommended size "${parsed.recommendedSize}" not found in chart sizes. Using fallback.`);
      return fallbackResult;
    }

    return {
      recommendedSize: parsed.recommendedSize,
      confidence: typeof parsed.confidence === 'number' ? Math.min(99, Math.max(50, parsed.confidence)) : (fallbackResult?.confidence || 85),
      isBetweenSizes: Boolean(parsed.isBetweenSizes),
      alternativeSize: parsed.alternativeSize && availableSizes.includes(parsed.alternativeSize) ? parsed.alternativeSize : undefined,
      aiGenerated: true,
      aiReasoning: parsed.aiReasoning || parsed.explanation?.fitNote || `Based on your measurements and ${user.preference || 'regular'} fit preference, size ${parsed.recommendedSize} is ideal.`,
      fitTips: parsed.fitTips,
      explanation: {
        matchingMeasurements: Array.isArray(parsed.explanation?.matchingMeasurements) && parsed.explanation.matchingMeasurements.length > 0
          ? parsed.explanation.matchingMeasurements
          : (fallbackResult?.explanation.matchingMeasurements || []),
        fitNote: parsed.aiReasoning || parsed.explanation?.fitNote || (fallbackResult?.explanation.fitNote),
      },
    };
  } catch (error: any) {
    console.warn('[DeepSeek AI] Error calculating fit recommendation:', error.message);
    return fallbackResult;
  }
}
