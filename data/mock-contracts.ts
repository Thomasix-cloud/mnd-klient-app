import { Contract } from "@/types";

export const mockContracts: Contract[] = [
  {
    id: "c1",
    supplyPointId: "sp1",
    type: "ELECTRICITY",
    pricePlan: "MND Elektřina Standard 2025",
    fixation: {
      active: false,
      type: "NONE",
      pricePerMWh: 3200,
    },
    status: "ACTIVE",
    startDate: "2024-01-15",
    businessOpportunities: ["Cenová fixace", "Cross-sell: Plyn"],
  },
  {
    id: "c2",
    supplyPointId: "sp2",
    type: "GAS",
    pricePlan: "Plyn z první ruky - Ceník Srpen 28",
    fixation: {
      active: true,
      type: "FIXED",
      validUntil: "2028-08-31",
      pricePerMWh: 1647,
    },
    status: "ACTIVE",
    startDate: "2025-09-01",
    businessOpportunities: [],
  },
  {
    id: "c3",
    supplyPointId: "sp3",
    type: "ELECTRICITY",
    pricePlan: "Klesající ceník Prosinec 28",
    fixation: {
      active: true,
      type: "DECLINING",
      validUntil: "2028-12-31",
      pricePerMWh: 2900,
    },
    status: "ACTIVE",
    startDate: "2026-01-01",
    businessOpportunities: [],
  },
  {
    id: "c4",
    supplyPointId: "sp1",
    type: "ELECTRICITY",
    pricePlan: "MND Elektřina Komfort 2023",
    fixation: {
      active: false,
      type: "FIXED",
      validUntil: "2024-12-31",
      pricePerMWh: 4500,
    },
    status: "TERMINATED",
    startDate: "2022-01-01",
    endDate: "2024-12-31",
    businessOpportunities: [],
  },
];
