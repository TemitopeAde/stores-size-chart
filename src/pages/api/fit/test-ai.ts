import type { APIRoute } from 'astro';
import { TestDeepSeekRequestSchema } from '../../../lib/validation';
import { testDeepSeekConnection } from '../../../services/deepseek-service';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = TestDeepSeekRequestSchema.parse(body);

    const result = await testDeepSeekConnection(validated.apiKey, validated.model);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Validation error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
