import { LogoProps } from "@/lib/types/components/components";
import Image from "next/image";

export function Logo({ compact = false }: LogoProps) {
  if (compact) {
    return (
      <Image
        src="/tec_logo.png"
        alt="TEC Energy Solutions"
        width={36}
        height={36}
        priority
        style={{ width: 36, height: "auto" }}
      />
    );
  }

  return (
    <Image
      src="/Tec_ES_logo.png"
      alt="TEC Energy Solutions"
      width={210}
      height={72}
      priority
      style={{ width: 210, height: "auto" }}
    />
  );
}
