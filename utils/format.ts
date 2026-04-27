export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Dobré ráno";
  if (hour < 18) return "Dobrý den";
  return "Dobrý večer";
}

export function formatEAN(ean: string): string {
  // Format EAN as groups: 8591824 003 00012345
  return ean.replace(/(\d{7})(\d{3})(\d+)/, "$1 $2 $3");
}

export function getEnergyTypeLabel(type: "ELECTRICITY" | "GAS"): string {
  return type === "ELECTRICITY" ? "Elektřina" : "Plyn";
}

export function getEnergyTypeIcon(type: "ELECTRICITY" | "GAS"): string {
  return type === "ELECTRICITY" ? "flash" : "flame";
}

export function getInvoiceStatusLabel(
  status: "PAID" | "UNPAID" | "OVERDUE"
): string {
  switch (status) {
    case "PAID":
      return "Zaplaceno";
    case "UNPAID":
      return "Nezaplaceno";
    case "OVERDUE":
      return "Po splatnosti";
  }
}

export function getFixationLabel(
  type: "FIXED" | "DECLINING" | "NONE"
): string {
  switch (type) {
    case "FIXED":
      return "Pevná cena";
    case "DECLINING":
      return "Klesající ceník";
    case "NONE":
      return "Bez fixace";
  }
}
