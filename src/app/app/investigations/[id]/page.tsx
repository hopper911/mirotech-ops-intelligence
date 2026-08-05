import { InvestigationCanvas } from "@/components/app/InvestigationCanvas";

export default async function InvestigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvestigationCanvas investigationId={id} />;
}
