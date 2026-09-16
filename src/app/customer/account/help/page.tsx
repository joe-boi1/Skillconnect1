import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

const FAQS = [
  {
    q: "How do I book an artisan?",
    a: "Open an artisan's profile from Search or Home and tap Book Now. Choose a service, pick a date, and add your address — the artisan will confirm the request.",
  },
  {
    q: "What does the verified badge mean?",
    a: "A verified artisan has had their identity or trade documents reviewed and approved by the SkillConnect team.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Booking cancellation is coming in a later phase. For now, message the artisan directly to reschedule or cancel.",
  },
  {
    q: "How do I report a problem with an artisan?",
    a: "Complaint filing is coming in a later phase. In the meantime, contact support using the details below.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Help & Support" />
      <Card>
        <h3 className="font-display text-sm font-semibold text-ink">Contact us</h3>
        <p className="mt-1 text-sm text-ink/60">support@skillconnect.ng · +234 800 000 0000</p>
      </Card>
      <div className="space-y-2">
        {FAQS.map((f) => (
          <Card key={f.q}>
            <p className="text-sm font-medium text-ink">{f.q}</p>
            <p className="mt-1 text-sm text-ink/60">{f.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
