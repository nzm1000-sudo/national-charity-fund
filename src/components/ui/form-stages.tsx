"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { Steps } from "./steps";
import { Button } from "./button";

/** Presentation-only pagination. Inputs remain mounted; form state and submit handlers are unchanged. */
export function FormStages({ labels, children }: { labels: string[]; children: ReactNode }) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const panels = Children.toArray(children);
  function navigate(next: number) {
    setStep(next);
    requestAnimationFrame(() => ref.current?.focus());
  }
  return <div ref={ref} tabIndex={-1} className="outline-none">
    <Steps current={step + 1} total={panels.length} labels={labels} />
    {panels.map((panel,i) => <div key={i} hidden={i !== step} className="form-stage">{panel}</div>)}
    <div className="flex justify-between gap-4 border-t border-border pt-6">
      <Button type="button" variant="secondary" disabled={step === 0} onClick={() => navigate(step - 1)}>חזרה</Button>
      {step < panels.length - 1 && <Button type="button" onClick={() => navigate(step + 1)}>המשך</Button>}
    </div>
  </div>;
}
