import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

const FAQS = [
  {
    q: "How do customers find me?",
    a: "Customers browse by category or search — the more complete your profile, services and portfolio are, the higher you rank in recommendations.",
  },
  {
    q: "How do I get verified?",
    a: "Verification request submission is coming in a later phase. For now your status is shown on your Dashboard and profile.",
  },
  {
    q: "Can I set prices per job?",
    a: "Yes — each service has its own starting price, maximum price and price basis (per job, per hour, or per day).",
  },
  {
    q: "What happens if I go Offline?",
    a: "Your profile is hidden from customer search and recommendations until you switch back to Available.",
  },
];

export default function ArtisanHelpPage() {
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
