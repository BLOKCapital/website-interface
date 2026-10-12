"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/lib/data/team";

/**
 * Team photo with an initials fallback if the image fails to load. In
 * greyscale and multiplied onto the tile's raised backdrop, so studio shots
 * on white and illustrations sit on the same tone as the darker snapshots
 * (VIS-20); the photo files are unchanged. Colour returns on hover.
 */
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
      sizes="(max-width: 768px) 45vw, 220px"
      unoptimized
      onError={() => setFailed(true)}
      className="object-cover mix-blend-multiply grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
    />
  );
}
