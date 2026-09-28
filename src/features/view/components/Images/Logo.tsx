import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  if (compact) {
    return <Image src="/tec_logo.png" alt="TEC Energy Solutions" width={36} height={36} priority />;
  }

  return <Image src="/Tec_ES_logo.png" alt="TEC Energy Solutions" width={210} height={72} priority className="h-auto w-[210px]" />;
}
