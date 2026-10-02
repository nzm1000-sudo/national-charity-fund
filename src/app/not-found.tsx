import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="font-display text-5xl text-gold">404</p>
        <h1 className="mt-3 font-display text-2xl">הדף לא נמצא</h1>
        <p className="mt-2 text-ink-soft">
          ייתכן שהקישור שגוי או שהתוכן הועבר. אפשר לחזור לדף הבית ולהמשיך משם.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/">לדף הבית</ButtonLink>
          <ButtonLink href="/faq" variant="secondary">
            שאלות נפוצות
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
