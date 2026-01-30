async function getPaste(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return <h1>404 – Paste not found or expired</h1>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Paste</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>

      {paste.expires_at && (
        <p>
          <strong>Expires at:</strong>{" "}
          {new Date(paste.expires_at).toLocaleString()}
        </p>
      )}

      {paste.remaining_views !== null && (
        <p>
          <strong>Remaining views:</strong> {paste.remaining_views}
        </p>
      )}
    </div>
  );
}
