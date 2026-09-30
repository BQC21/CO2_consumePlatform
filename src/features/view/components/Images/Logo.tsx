import { LogoProps } from "@/lib/types/components/components";
import Image from "next/image";

export function Logo({ compact = false }: LogoProps) {
  if (compact) {
    return (
      <Image
        src="/tec_logo.png"
        alt="TEC Energy Solutions"
        width={225}
        height={307}
        priority
        style={{ width: 36, height: "auto" }}
      />
    );
  }

  return (
    <Image
      src="/Tec_ES_logo.png"
      alt="TEC Energy Solutions"
      width={380}
      height={165}
      priority
      style={{ width: 210, height: "auto" }}
    />
  );
}
