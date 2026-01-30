import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { getNow } from "../../lib/time";

const kv = Redis.fromEnv();

export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  // validations
  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return Response.json({ error: "invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "invalid max_views" }, { status: 400 });
  }

  const id = randomUUID();
  const now = getNow(request);

  const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

  const paste = {
    id,
    content,
    created_at: now,
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  };

  const key = `paste:${id}`;
  await kv.set(key, paste);

  // Redis automation
  if (ttl_seconds) {
    await kv.expire(key, ttl_seconds);
  }

  return Response.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}