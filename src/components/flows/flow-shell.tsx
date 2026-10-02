import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";

export function FlowShell({ eyebrow, title, lead, aside, children }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; aside?: ReactNode; children: ReactNode }) {
  return <Section><div className="container-page">
    <nav aria-label="מיקום באתר" className="text-column mb-8 text-meta text-muted"><Link href="/" className="inline-flex min-h-11 items-center text-link">בית</Link><span aria-hidden="true" className="px-3">·</span><span>{title}</span></nav>
    <header className="text-center">{eyebrow && <p className="eyebrow mx-auto">{eyebrow}</p>}<h1 className="section-title">{title}</h1>{lead && <p className="section-lead">{lead}</p>}</header>
    <div className="text-column mt-12">{aside && <aside className="mb-8" aria-label="על פי ההלכה">{aside}</aside>}<div className="flow-panel">{children}</div></div>
  </div></Section>;
}
