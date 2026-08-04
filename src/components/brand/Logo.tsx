import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
};

const sizes = {
  sm: { mark: 28, title: "text-sm", sub: "text-[9px]" },
  md: { mark: 36, title: "text-base", sub: "text-[10px]" },
  lg: { mark: 48, title: "text-xl", sub: "text-xs" },
} as const;

export function Logo({
  href = "/",
  variant = "dark",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const s = sizes[size];
  const titleColor = variant === "dark" ? "text-navy" : "text-white";
  const subColor = variant === "dark" ? "text-blue" : "text-cyan";

  const content = (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/brand/logo-mark.svg"
        alt=""
        width={s.mark}
        height={s.mark}
        className="shrink-0"
        priority
      />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className={`brand-display font-bold ${s.title} ${titleColor}`}>
            Mirotech
          </span>
          <span className={`brand-sub mt-1 font-medium ${s.sub} ${subColor}`}>
            Ops Intelligence
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center no-underline">
      {content}
    </Link>
  );
}
