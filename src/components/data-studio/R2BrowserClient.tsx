"use client";

import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { useCallback, useEffect, useState } from "react";

type ListedObject = {
  key: string;
  size: number;
  lastModified: string | null;
  url: string;
};

type ListResponse = {
  backend: "r2" | "blob" | "none";
  r2Configured: boolean;
  publicBase: string;
  objects: ListedObject[];
  message?: string;
  error?: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function R2BrowserClient() {
  const [prefix, setPrefix] = useState("media/");
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async (p: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/r2?prefix=${encodeURIComponent(p)}`, {
        cache: "no-store",
        credentials: "same-origin",
      });
      const json = (await res.json()) as ListResponse;
      if (!res.ok) throw new Error(json.error || "Could not list objects.");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "List failed.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/r2?prefix=${encodeURIComponent("media/")}`, {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (res) => {
        const json = (await res.json()) as ListResponse;
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error || "Could not list objects.");
        setData(json);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "List failed.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onUpload(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("key", `${prefix.replace(/\/?$/, "/")}${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
      const res = await fetch("/api/admin/r2", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      setMessage(`Uploaded ${json.key}`);
      await load(prefix);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(key: string) {
    if (!confirm(`Delete ${key}?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/r2", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ key }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      setMessage(`Deleted ${key}`);
      await load(prefix);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Object storage</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">R2 / media browser</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Browse, upload, and delete sales media objects. Prefers Cloudflare R2 when credentials
            are set; otherwise uses the linked Vercel Blob store.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <section className="glass-app rounded-2xl p-5 text-sm">
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <span>
            Backend:{" "}
            <span className="text-cyan">{data?.backend ?? "…"}</span>
          </span>
          <span>
            R2 configured:{" "}
            <span className={data?.r2Configured ? "text-green" : "text-muted"}>
              {data?.r2Configured ? "yes" : "no"}
            </span>
          </span>
          {data?.publicBase ? (
            <span className="truncate">
              Public base: <span className="text-white/80">{data.publicBase}</span>
            </span>
          ) : null}
        </div>
        {!data?.r2Configured ? (
          <p className="mt-3 text-xs text-muted">
            To use Cloudflare R2, set{" "}
            <code className="text-cyan">R2_ACCOUNT_ID</code>,{" "}
            <code className="text-cyan">R2_ACCESS_KEY_ID</code>,{" "}
            <code className="text-cyan">R2_SECRET_ACCESS_KEY</code>,{" "}
            <code className="text-cyan">R2_BUCKET</code>, and{" "}
            <code className="text-cyan">R2_PUBLIC_URL</code> in Vercel env, then redeploy.
          </p>
        ) : null}
        {data?.message ? <p className="mt-3 text-xs text-cyan">{data.message}</p> : null}
      </section>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-muted">
          Prefix
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="mt-1 block w-64 rounded-lg border border-white/10 bg-navy/50 px-3 py-2 text-sm text-white"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void load(prefix)}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm"
        >
          Refresh
        </button>
        <label className="btn-specular cursor-pointer rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy">
          {busy ? "Working…" : "Upload file"}
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onUpload(file);
            }}
          />
        </label>
      </div>

      {error ? <p className="text-sm text-cyan">{error}</p> : null}
      {message ? <p className="text-sm text-green">{message}</p> : null}

      <div className="glass-app overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Object</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Modified</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(data?.objects ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-muted">
                  {busy ? "Loading…" : "No objects in this prefix."}
                </td>
              </tr>
            ) : (
              data!.objects.map((obj) => (
                <tr key={obj.key} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <a
                      href={obj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-cyan hover:underline"
                    >
                      {obj.key}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatBytes(obj.size)}</td>
                  <td className="px-4 py-3 text-muted">
                    {obj.lastModified ? new Date(obj.lastModified).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onDelete(obj.key)}
                      className="text-xs text-muted hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
