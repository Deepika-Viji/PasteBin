"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste(e) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setResultUrl(data.url);
    setContent("");
    setTtl("");
    setMaxViews("");
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={createPaste}>
        <textarea
          rows={6}
          style={{ width: "100%" }}
          placeholder="Enter your text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div style={{ marginTop: "1rem" }}>
          <input
            type="number"
            placeholder="TTL (seconds, optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="number"
            placeholder="Max views (optional)"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button style={{ marginTop: "1rem" }} type="submit">
          Create Paste
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultUrl && (
        <p>
          Shareable URL: <br />
          <a href={resultUrl}>{resultUrl}</a>
        </p>
      )}
    </div>
  );
}
