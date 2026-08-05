import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function isR2Configured(): boolean {
  return Boolean(
    clean(process.env.R2_ACCOUNT_ID) &&
      clean(process.env.R2_ACCESS_KEY_ID) &&
      clean(process.env.R2_SECRET_ACCESS_KEY) &&
      clean(process.env.R2_BUCKET),
  );
}

export function getR2PublicBase(): string {
  const explicit = clean(process.env.R2_PUBLIC_URL).replace(/\/$/, "");
  if (explicit) return explicit;
  const account = clean(process.env.R2_ACCOUNT_ID);
  const bucket = clean(process.env.R2_BUCKET);
  if (account && bucket) return `https://${bucket}.${account}.r2.dev`;
  return "";
}

function getClient(): S3Client {
  const accountId = clean(process.env.R2_ACCOUNT_ID);
  const accessKeyId = clean(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.R2_SECRET_ACCESS_KEY);
  const endpoint =
    clean(process.env.R2_ENDPOINT) ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.");
  }
  return new S3Client({
    region: clean(process.env.R2_REGION) || "auto",
    endpoint: endpoint.replace(/\/$/, ""),
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}

function bucket(): string {
  const b = clean(process.env.R2_BUCKET);
  if (!b) throw new Error("R2_BUCKET is not set.");
  return b;
}

export type ListedObject = {
  key: string;
  size: number;
  lastModified: string | null;
  url: string;
};

export async function r2PutObject(options: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ key: string; url: string }> {
  const key = options.key.replace(/^\/+/, "");
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: options.body,
      ContentType: options.contentType,
    }),
  );
  const base = getR2PublicBase();
  return { key, url: base ? `${base}/${key}` : key };
}

export async function r2GetObjectBuffer(key: string): Promise<Buffer | null> {
  const client = getClient();
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: bucket(), Key: key.replace(/^\/+/, "") }),
    );
    if (!res.Body) return null;
    const bytes = await res.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch {
    return null;
  }
}

export async function r2DeleteObject(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({ Bucket: bucket(), Key: key.replace(/^\/+/, "") }),
  );
}

export async function r2ListObjects(prefix = "", maxKeys = 200): Promise<ListedObject[]> {
  const client = getClient();
  const res = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket(),
      Prefix: prefix.replace(/^\/+/, ""),
      MaxKeys: maxKeys,
    }),
  );
  const base = getR2PublicBase();
  return (res.Contents ?? [])
    .filter((o) => o.Key && !o.Key.endsWith("/"))
    .map((o) => ({
      key: o.Key!,
      size: o.Size ?? 0,
      lastModified: o.LastModified?.toISOString() ?? null,
      url: base ? `${base}/${o.Key}` : o.Key!,
    }));
}
