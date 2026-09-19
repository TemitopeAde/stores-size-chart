import type { APIRoute } from 'astro';
import { updateAssignment, deleteAssignment } from '../../../services/assignment-service';
import { ChartAssignmentPayloadSchema } from '../../../lib/validation';

export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ID' } }), { status: 400 });

  try {
    const body = await request.json();
    const validated = ChartAssignmentPayloadSchema.partial().parse(body);
    const updated = await updateAssignment(id, validated as any);

    if (!updated) return new Response(JSON.stringify({ success: false, error: { code: 'NOT_FOUND' } }), { status: 404 });

    return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ success: false, error: { code: 'INVALID_ID' } }), { status: 400 });

  const success = await deleteAssignment(id);
  return new Response(JSON.stringify({ success }), { status: 200 });
};

