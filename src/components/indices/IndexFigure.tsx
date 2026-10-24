import { BalanceMachine } from "@/components/iso/BalanceMachine";
import { PriceRingMachine } from "@/components/iso/PriceRingMachine";
import { DriftScanMachine } from "@/components/iso/DriftScanMachine";

/**
 * Each index's own machine figure, for its page: BLOKC2 as a two-pan
 * steelyard (Fig 6), BLOKC5 as a ring round its price mast (Fig 7), BLOKC10
 * under a sweeping drift check (Fig 8). Each tells the same rule its own way:
 * a holding past its 2% band, then one pooled trade.
 */
const FIGURES = { blokc2: BalanceMachine, blokc5: PriceRingMachine, blokc10: DriftScanMachine } as const;

export function IndexFigure({ id, className }: { id: string; className?: string }) {
  const Figure = FIGURES[id as keyof typeof FIGURES];
  return Figure ? <Figure className={className} /> : null;
}
