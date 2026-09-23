"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/lib/data/team";

/** Team photo with an initials fallback if the image fails to load. */
export function TeamPhoto({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);
  if (!member.image || failed) {
    return (
      <span className="flex size-full items-center justify-center bg-raised text-[28px] text-fg-muted display">{member.initials}</span>
    );
  }
  return (
    <Image
      src={member.image}
      alt=""
      fill
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
      unoptimized
      onError={() => setFailed(true)}
      className="object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
    />
  );
}
