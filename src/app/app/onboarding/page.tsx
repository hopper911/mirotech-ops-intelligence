import { OnboardingClient } from "@/components/app/OnboardingClient";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <SampleDataBadge />
      <OnboardingClient />
    </div>
  );
}
