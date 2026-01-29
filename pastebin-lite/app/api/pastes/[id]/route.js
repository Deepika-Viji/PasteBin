import { kv } from "@vercel/kv";
import { getNow } from "../../lib/time";

export async function GET(request, { params }) {
  const { id } = await params;

  const paste = await kv.get(`paste:${id}`);
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(request.headers);

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment views
  paste.views += 1;
  await kv.set(`paste:${id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
