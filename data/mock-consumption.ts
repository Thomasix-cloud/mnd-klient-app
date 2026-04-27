import { ConsumptionData } from "@/types";

// Generate daily data for last 30 days
function generateDailyData(baseValue: number, unit: "kWh" | "m3"): { date: string; value: number; unit: "kWh" | "m3" }[] {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * baseValue * 0.4;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue + variation),
      unit,
    });
  }
  return data;
}

export const mockConsumption: ConsumptionData[] = [
  {
    supplyPointId: "sp1",
    daily: generateDailyData(15, "kWh"),
    monthly: [
      { date: "2025-05", value: 298, unit: "kWh" },
      { date: "2025-06", value: 265, unit: "kWh" },
      { date: "2025-07", value: 245, unit: "kWh" },
      { date: "2025-08", value: 258, unit: "kWh" },
      { date: "2025-09", value: 298, unit: "kWh" },
      { date: "2025-10", value: 312, unit: "kWh" },
      { date: "2025-11", value: 456, unit: "kWh" },
      { date: "2025-12", value: 489, unit: "kWh" },
      { date: "2026-01", value: 520, unit: "kWh" },
      { date: "2026-02", value: 478, unit: "kWh" },
      { date: "2026-03", value: 395, unit: "kWh" },
      { date: "2026-04", value: 320, unit: "kWh" },
    ],
  },
  {
    supplyPointId: "sp2",
    daily: generateDailyData(3, "m3"),
    monthly: [
      { date: "2025-05", value: 15, unit: "m3" },
      { date: "2025-06", value: 8, unit: "m3" },
      { date: "2025-07", value: 5, unit: "m3" },
      { date: "2025-08", value: 5, unit: "m3" },
      { date: "2025-09", value: 18, unit: "m3" },
      { date: "2025-10", value: 45, unit: "m3" },
      { date: "2025-11", value: 78, unit: "m3" },
      { date: "2025-12", value: 95, unit: "m3" },
      { date: "2026-01", value: 102, unit: "m3" },
      { date: "2026-02", value: 88, unit: "m3" },
      { date: "2026-03", value: 62, unit: "m3" },
      { date: "2026-04", value: 35, unit: "m3" },
    ],
  },
  {
    supplyPointId: "sp3",
    daily: generateDailyData(12, "kWh"),
    monthly: [
      { date: "2025-05", value: 245, unit: "kWh" },
      { date: "2025-06", value: 220, unit: "kWh" },
      { date: "2025-07", value: 198, unit: "kWh" },
      { date: "2025-08", value: 210, unit: "kWh" },
      { date: "2025-09", value: 255, unit: "kWh" },
      { date: "2025-10", value: 280, unit: "kWh" },
      { date: "2025-11", value: 350, unit: "kWh" },
      { date: "2025-12", value: 380, unit: "kWh" },
      { date: "2026-01", value: 410, unit: "kWh" },
      { date: "2026-02", value: 365, unit: "kWh" },
      { date: "2026-03", value: 310, unit: "kWh" },
      { date: "2026-04", value: 275, unit: "kWh" },
    ],
  },
];
