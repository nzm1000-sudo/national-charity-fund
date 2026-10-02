import { cn } from "@/lib/cn";
import Image from "next/image";
import hesedOriginal from "../../../public/hesed-original.png";

export function Emblem({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("organization-seal", className)} style={{ width: size, height: size, padding: size * 0.12 }}>
      <Image src={hesedOriginal} alt="הלוגו המקורי של ארגון חסד יסובבנו" width={640} height={656} unoptimized />
    </span>
  );
}
