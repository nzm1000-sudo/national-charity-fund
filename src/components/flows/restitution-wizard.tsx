"use client";

import { useState } from "react";
import { ChoiceGroup } from "@/components/ui/choice";
import { ButtonLink } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";
import { DonationForm, type DonationFormFund } from "@/components/flows/donation-form";
import {
  classifyRestitution,
  type RestitutionAnswers,
  type OwnerKnown,
  type Reachability,
} from "@/lib/domain/restitution";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { publicCopy } from "@/components/ui/public-copy";

export function RestitutionWizard({ fund }: { fund: DonationFormFund }) {
  const [answers, setAnswers] = useState<RestitutionAnswers>({
    ownerKnown: undefined as unknown as OwnerKnown,
  });
  const [started, setStarted] = useState(false);

  const hasOwner = answers.ownerKnown !== undefined;
  const done =
    hasOwner &&
    ((answers.ownerKnown === "yes" && answers.reachable !== undefined) ||
      (answers.ownerKnown === "no" && answers.manyPeople !== undefined) ||
      answers.ownerKnown === "unsure");

  const total = answers.ownerKnown === "no" ? 2 : answers.ownerKnown === "unsure" ? 1 : 2;
  const step = done
    ? total
    : !hasOwner
      ? 1
      : answers.ownerKnown === "yes"
        ? 2
        : 2;

  function update(patch: Partial<RestitutionAnswers>) {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <p className="flex items-center gap-2 text-sm text-muted">
        <Badge tone="primary">מצב צנעה</Badge>
        אין צורך לפרט מה אירע.
      </p>

      {!done && (
        <Steps
          current={step}
          total={total}
          labels={["מצב הבעלים", "פרטים משלימים"]}
        />
      )}

      {!hasOwner && (
        <ChoiceGroup
          name="ownerKnown"
          legend="האם ידוע לך למי שייך הממון?"
          value={null}
          onChange={(v) => {
            setStarted(true);
            update({ ownerKnown: v as OwnerKnown });
          }}
          columns={3}
          options={[
            { value: "yes", label: "כן, ידוע לי", description: "אני יודע למי להשיב" },
            { value: "no", label: "לא", description: "אינני יודע ממי" },
            { value: "unsure", label: "אינני בטוח", description: "יש ספק" },
          ]}
        />
      )}

      {answers.ownerKnown === "yes" && answers.reachable === undefined && (
        <ChoiceGroup
          name="reachable"
          legend="האם יש אפשרות סבירה להשיב לבעלים?"
          value={null}
          onChange={(v) => update({ reachable: v as Reachability })}
          columns={3}
          options={[
            { value: "yes", label: "כן", description: "ניתן להשיב לו ישירות" },
            { value: "no", label: "לא", description: "אין דרך להשיב לו" },
            { value: "unknown", label: "איני יודע" },
          ]}
        />
      )}

      {answers.ownerKnown === "no" && answers.manyPeople === undefined && (
        <ChoiceGroup
          name="manyPeople"
          legend="ממי נלקח הממון?"
          value={null}
          onChange={(v) => update({ manyPeople: v === "many" })}
          columns={2}
          options={[
            { value: "many", label: "מאנשים רבים", description: "הציבור, גבייה, קופה" },
            { value: "one", label: "מאדם או גוף בודד", description: "אך איני יודע מי" },
          ]}
        />
      )}

      {done && started && <Outcome answers={answers} fund={fund} />}

      {started && (
        <button
          type="button"
          onClick={() => {
            setAnswers({ ownerKnown: undefined as unknown as OwnerKnown });
            setStarted(false);
          }}
          className="text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-primary"
        >
          להתחיל מחדש
        </button>
      )}
    </div>
  );
}

function Outcome({
  answers,
  fund,
}: {
  answers: RestitutionAnswers;
  fund: DonationFormFund;
}) {
  const outcome = classifyRestitution(answers);

  if (outcome.route === "return_direct") {
    return (
      <Card className="border-primary/30">
        <CardBody>
          <Badge tone="primary">השבה ישירה</Badge>
          <h3 className="mt-4 font-display text-xl">{publicCopy(outcome.headlineHe)}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {publicCopy(outcome.explanationHe)}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/faq" variant="secondary">
              לפרטי ההשבה
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-primary/30">
        <CardBody>
          <Badge tone="primary">המסלול המתאים</Badge>
          <h3 className="mt-4 font-display text-xl">{publicCopy(outcome.headlineHe)}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {publicCopy(outcome.explanationHe)}
          </p>
          <p className="mt-3 text-sm text-muted">
            אם הסכום המדויק אינו זכור, אפשר להעריך אותו ולהוסיף מרווח ביטחון.
          </p>
        </CardBody>
      </Card>

      <DonationForm
        fund={fund}
        mode="restitution"
        showCause={false}
        defaultCauseSlug="public-needs"
      />
    </div>
  );
}
