import { Redis } from "@upstash/redis";

const kv = Redis.fromEnv();

export async function GET() {
  try {
    await kv.ping();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
