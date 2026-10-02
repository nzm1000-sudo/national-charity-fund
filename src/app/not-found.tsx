import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
export default function NotFound() { return <Section><div className="container-page text-center"><SectionHeading title="הדף אינו נמצא" lead="ייתכן שהכתובת שגויה, או שהדף הועבר." /><div className="mt-8"><ButtonLink href="/">לדף הבית</ButtonLink></div></div></Section>; }
