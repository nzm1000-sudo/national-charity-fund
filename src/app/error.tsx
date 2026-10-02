"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">תקלה זמנית</h1>
        <p className="mt-2 text-ink-soft">
          לא ניתן להציג את הדף כעת. אפשר לנסות שוב.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>ניסיון נוסף</Button>
          <ButtonLink href="/" variant="secondary">
            לדף הבית
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
