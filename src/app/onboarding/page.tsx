import { OnboardingWizard } from "@/components/onboarding-wizard";
import { getLang } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const lang = await getLang();
  return <OnboardingWizard initialLang={lang} />;
}
