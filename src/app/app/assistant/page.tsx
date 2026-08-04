import { AssistantClient } from "@/components/app/AssistantClient";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { opsSource } from "@/lib/ops";

export default async function AssistantPage() {
  const presets = await opsSource.getAssistantPresets();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">AI assistant</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Ask ops questions</h1>
          <p className="mt-2 text-sm text-muted">
            Plain-language answers with cited sample sources and next steps. Demo replies are canned.
          </p>
        </div>
        <SampleDataBadge />
      </header>
      <AssistantClient presets={presets} />
    </div>
  );
}
