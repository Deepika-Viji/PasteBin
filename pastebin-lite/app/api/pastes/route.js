import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";
import { getNow } from "../lib/time";

export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json({ error: "invalid ttl_seconds" }, { status: 400 });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json({ error: "invalid max_views" }, { status: 400 });
  }

  const id = randomUUID();
  const now = getNow(request.headers);

  const paste = {
    id,
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };

  await kv.set(`paste:${id}`, paste);

  return Response.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
