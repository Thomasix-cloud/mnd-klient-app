import { User } from "@/types";

export const mockUser: User = {
  id: "u1",
  customerNumber: "7823456",
  firstName: "Jan",
  lastName: "Dvořák",
  dateOfBirth: "1978-05-18",
  phone: "+420602345678",
  email: "jan.dvorak@email.cz",
  address: {
    street: "Koněvova 123",
    city: "Praha 3",
    postalCode: "13000",
  },
  avatarUrl: undefined,
  status: "BONITNI",
};
