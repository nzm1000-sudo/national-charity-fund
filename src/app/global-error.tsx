"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#f6f3ea",
          color: "#1a1814",
          display: "grid",
          placeItems: "center",
          minHeight: "100dvh",
          margin: 0,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem" }}>תקלה זמנית</h1>
          <p style={{ color: "#454034" }}>אנא נסו לרענן את הדף.</p>
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              background: "#0f4c46",
              color: "#fff",
              border: 0,
              borderRadius: "10px",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            רענון
          </button>
        </div>
      </body>
    </html>
  );
}
