import { AdvancePayment } from "@/types";

export const mockAdvancePayments: AdvancePayment[] = [
  {
    supplyPointId: "sp1",
    monthlyAdvance: 2450,
    recommendedAdvance: 2450,
    status: "OPTIMAL",
    history: [
      { month: "2026-01", amount: 2450, paid: true },
      { month: "2026-02", amount: 2450, paid: true },
      { month: "2026-03", amount: 2450, paid: true },
      { month: "2026-04", amount: 2450, paid: false },
    ],
  },
  {
    supplyPointId: "sp2",
    monthlyAdvance: 1850,
    recommendedAdvance: 2100,
    status: "TOO_LOW",
    history: [
      { month: "2026-01", amount: 1850, paid: true },
      { month: "2026-02", amount: 1850, paid: true },
      { month: "2026-03", amount: 1850, paid: true },
      { month: "2026-04", amount: 1850, paid: false },
    ],
  },
  {
    supplyPointId: "sp3",
    monthlyAdvance: 1980,
    recommendedAdvance: 1800,
    status: "TOO_HIGH",
    history: [
      { month: "2026-01", amount: 1980, paid: true },
      { month: "2026-02", amount: 1980, paid: true },
      { month: "2026-03", amount: 1980, paid: true },
      { month: "2026-04", amount: 1980, paid: false },
    ],
  },
];
