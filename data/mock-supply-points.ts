import { SupplyPoint } from "@/types";

export const mockSupplyPoints: SupplyPoint[] = [
  {
    id: "sp1",
    type: "ELECTRICITY",
    status: "ACTIVE",
    identifier: "859182400300012345",
    contractNumber: "E-2825-782345",
    address: {
      street: "Koněvova 123",
      city: "Praha 3",
      postalCode: "13000",
    },
    linkedContractId: "c1",
  },
  {
    id: "sp2",
    type: "GAS",
    status: "ACTIVE",
    identifier: "27ZG600Z0000012345",
    contractNumber: "P-2825-782346",
    address: {
      street: "Koněvova 123",
      city: "Praha 3",
      postalCode: "13000",
    },
    linkedContractId: "c2",
  },
  {
    id: "sp3",
    type: "ELECTRICITY",
    status: "ACTIVE",
    identifier: "859182400300067890",
    contractNumber: "E-2825-782347",
    address: {
      street: "Vinohradská 45",
      city: "Praha 2",
      postalCode: "12000",
    },
    linkedContractId: "c3",
  },
];
