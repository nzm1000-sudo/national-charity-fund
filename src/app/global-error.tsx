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
          background: "#fdfbf6",
          color: "#241e17",
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
          <p style={{ color: "#5f5648" }}>אפשר לנסות לטעון את הדף מחדש.</p>
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              background: "#241e17",
              color: "#fff",
              border: 0,
              borderRadius: "4px",
              minHeight: "44px",
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
