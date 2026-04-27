// ============================================================
// Contextual user insights — derived from mock data, used to
// power proactive suggestions in the AI assistant + dashboard.
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import { ToneName } from "@/constants/colors";
import { mockAdvancePayments } from "@/data/mock-advance-payments";
import { mockConsumption } from "@/data/mock-consumption";
import { mockContracts } from "@/data/mock-contracts";
import { mockInvoices } from "@/data/mock-invoices";
import { mockSupplyPoints } from "@/data/mock-supply-points";
import { formatCurrency } from "@/utils/format";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export interface UserInsight {
  id: string;
  tone: ToneName;
  icon: IoniconName;
  title: string;
  message: string;
  cta?: { label: string; query: string; route?: string };
  /** higher = more important */
  priority: number;
}

export function getUserInsights(): UserInsight[] {
  const insights: UserInsight[] = [];

  // 1. Overdue invoices (highest priority)
  const overdue = mockInvoices.filter((i) => i.status === "OVERDUE");
  if (overdue.length > 0) {
    const total = overdue.reduce((s, i) => s + i.amount, 0);
    insights.push({
      id: "overdue",
      tone: "danger",
      icon: "warning",
      title: `${overdue.length} faktura po splatnosti`,
      message: `K úhradě ${formatCurrency(total)}. Zaplaťte co nejdříve, abyste se vyhnuli upomínce.`,
      cta: {
        label: "Zaplatit nyní",
        query: "Chci zaplatit fakturu po splatnosti",
        route: `/invoices/${overdue[0].id}`,
      },
      priority: 100,
    });
  }

  // 2. Advance payment too low / too high
  mockAdvancePayments.forEach((adv) => {
    if (adv.status === "OPTIMAL") return;
    const sp = mockSupplyPoints.find((s) => s.id === adv.supplyPointId);
    if (!sp) return;
    const diff = adv.recommendedAdvance - adv.monthlyAdvance;
    const isLow = adv.status === "TOO_LOW";
    insights.push({
      id: `adv-${adv.supplyPointId}`,
      tone: isLow ? "warning" : "info",
      icon: isLow ? "trending-up" : "trending-down",
      title: isLow
        ? "Doporučujeme zvýšit zálohy"
        : "Můžete snížit zálohy",
      message: isLow
        ? `Vaše zálohy za ${sp.address.street} jsou nižší než vaše skutečná spotřeba. Doporučená záloha: ${formatCurrency(adv.recommendedAdvance)} (+${formatCurrency(diff)}).`
        : `U ${sp.address.street} platíte víc, než spotřebováváte. Zkuste snížit zálohy na ${formatCurrency(adv.recommendedAdvance)}.`,
      cta: {
        label: "Upravit zálohy",
        query: `Chci změnit zálohy pro ${sp.address.street}`,
        route: `/supply-points/${sp.id}`,
      },
      priority: 70,
    });
  });

  // 3. Consumption spike anomaly (latest month vs avg of previous 3)
  mockConsumption.forEach((c) => {
    if (c.monthly.length < 4) return;
    const last = c.monthly[c.monthly.length - 1];
    const prev3 =
      c.monthly.slice(-4, -1).reduce((s, m) => s + m.value, 0) / 3;
    if (prev3 === 0) return;
    const change = ((last.value - prev3) / prev3) * 100;
    if (Math.abs(change) < 30) return;
    const sp = mockSupplyPoints.find((s) => s.id === c.supplyPointId);
    if (!sp) return;
    insights.push({
      id: `spike-${c.supplyPointId}`,
      tone: change > 0 ? "warning" : "success",
      icon: change > 0 ? "alert-circle" : "leaf",
      title:
        change > 0
          ? "Spotřeba neobvykle vyšší"
          : "Šetříte oproti minulosti",
      message:
        change > 0
          ? `Spotřeba ${sp.address.street} je o ${change.toFixed(0)} % vyšší než průměr posledních měsíců. Stojí za kontrolu spotřebičů.`
          : `Skvělé! Spotřeba ${sp.address.street} klesla o ${Math.abs(change).toFixed(0)} % oproti průměru.`,
      cta:
        change > 0
          ? {
              label: "Zobrazit spotřebu",
              query: `Proč mi vyrostla spotřeba na ${sp.address.street}?`,
              route: `/supply-points/${sp.id}`,
            }
          : undefined,
      priority: change > 0 ? 60 : 30,
    });
  });

  // 4. Contract without fixation — opportunity
  mockContracts
    .filter((c) => c.status === "ACTIVE" && c.fixation.type === "NONE")
    .forEach((c) => {
      const sp = mockSupplyPoints.find((s) => s.id === c.supplyPointId);
      insights.push({
        id: `fix-${c.id}`,
        tone: "info",
        icon: "lock-closed",
        title: "Zafixujte si cenu energie",
        message: `Vaše smlouva ${sp ? `(${sp.address.street})` : ""} nemá fixaci. Zafixujte cenu a chraňte se před zdražováním.`,
        cta: {
          label: "Zjistit více",
          query: `Chci fixaci pro smlouvu ${c.id}`,
          route: `/contracts/${c.id}`,
        },
        priority: 50,
      });
    });

  // 5. Fixation expiring within 60 days
  const today = new Date();
  mockContracts.forEach((c) => {
    if (!c.fixation.validUntil) return;
    const days =
      (new Date(c.fixation.validUntil).getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 0 || days > 60) return;
    const sp = mockSupplyPoints.find((s) => s.id === c.supplyPointId);
    insights.push({
      id: `fix-end-${c.id}`,
      tone: "warning",
      icon: "calendar",
      title: "Brzy končí fixace",
      message: `Fixaci ceny pro ${sp?.address.street ?? "smlouvu"} skončí za ${Math.ceil(days)} dní. Domluvte si novou fixaci včas.`,
      cta: {
        label: "Prodloužit fixaci",
        query: `Chci prodloužit fixaci smlouvy ${c.id}`,
        route: `/contracts/${c.id}`,
      },
      priority: 80,
    });
  });

  return insights.sort((a, b) => b.priority - a.priority);
}
