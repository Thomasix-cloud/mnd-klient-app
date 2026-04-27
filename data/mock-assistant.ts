import { QuickQuestion } from "@/types";

export const quickQuestions: QuickQuestion[] = [
  { id: "q1", label: "Kolik platím za energie?", query: "kolik platím" },
  { id: "q2", label: "Chci změnit zálohy", query: "změnit zálohy" },
  { id: "q3", label: "Co je fixace ceny?", query: "fixace" },
  { id: "q4", label: "Kdy mi končí smlouva?", query: "konec smlouvy" },
  { id: "q5", label: "Jak zadat samoodečet?", query: "samoodečet" },
  { id: "q6", label: "Kontakt na MND", query: "kontakt" },
];

interface AssistantPattern {
  keywords: string[];
  response: string;
}

export const assistantPatterns: AssistantPattern[] = [
  {
    keywords: ["kolik", "platím", "záloha", "zálohy", "platba"],
    response:
      "Vaše aktuální měsíční zálohy jsou:\n\n⚡ Elektřina (Koněvova 123): 2 450 Kč\n🔥 Plyn (Koněvova 123): 1 850 Kč\n⚡ Elektřina (Vinohradská 45): 1 980 Kč\n\nCelkem: 6 280 Kč/měsíc\n\nChcete zobrazit detail plateb?",
  },
  {
    keywords: ["změnit", "zálohy", "zvýšit", "snížit"],
    response:
      "Pro změnu výše záloh máte dvě možnosti:\n\n1. V aplikaci přejděte na detail odběrného místa a klikněte na \"Změnit zálohy\"\n2. Zavolejte na bezplatnou linku 800 400 500 (Po-Ne, 8-20h)\n\n💡 Tip: U vašeho plynu (Koněvova 123) doporučujeme zvýšit zálohu z 1 850 Kč na 2 100 Kč pro optimální nastavení.",
  },
  {
    keywords: ["fixace", "fixovat", "pevná cena", "zafixovat"],
    response:
      "Fixace ceny znamená, že vaše obchodní cena za energii zůstane neměnná po dobu platnosti smlouvy.\n\n📊 Vaše aktuální fixace:\n🔥 Plyn (Koněvova): Pevná cena 1 647 Kč/MWh do 08/2028 ✅\n⚡ Elektřina (Vinohradská): Klesající ceník do 12/2028 ✅\n⚡ Elektřina (Koněvova): Bez fixace ⚠️\n\nPro elektřinu na Koněvově je k dispozici nabídka cenové fixace. Chcete ji zobrazit?",
  },
  {
    keywords: ["smlouva", "konec", "končí", "platnost", "vypršení"],
    response:
      "Přehled vašich smluv:\n\n⚡ Elektřina (Koněvova): MND Elektřina Standard 2025 — na dobu neurčitou\n🔥 Plyn (Koněvova): Ceník Srpen 28 — fixace do 31. 8. 2028\n⚡ Elektřina (Vinohradská): Klesající ceník — do 31. 12. 2028\n\nŽádná smlouva vám v blízké době nekončí.",
  },
  {
    keywords: ["samoodečet", "odečet", "elektroměr", "plynoměr", "stav"],
    response:
      "Samoodečet můžete zadat přímo v aplikaci:\n\n1. Přejděte na detail odběrného místa\n2. Klikněte na \"Zadat samoodečet\"\n3. Vyfotografujte nebo zadejte stav měřidla\n\n📅 Nejbližší termín samoodečtu: do 30. 4. 2026 (Koněvova 123, elektřina)\n\n💡 Tip: Pravidelný samoodečet pomáhá přesnějšímu vyúčtování.",
  },
  {
    keywords: ["kontakt", "telefon", "volat", "napsat", "email", "podpora"],
    response:
      "Kontaktujte nás:\n\n📞 Bezplatná linka: 800 400 500\n   Po-Ne, 8:00-20:00\n📞 Ze zahraničí: +420 226 400 500\n📧 E-mail: mnd@mnd.cz\n🏢 Zákaznická centra: www.mnd.cz/kontakt\n\nNebo využijte tento chat — jsem tu pro vás 24/7!",
  },
  {
    keywords: ["faktura", "vyúčtování", "vyuctovani", "rozpis"],
    response:
      "Vaše poslední vyúčtování:\n\n⚡ Elektřina (Koněvova): č. 2025110234 — 8 340 Kč (zaplaceno ✅)\n🔥 Plyn (Koněvova): č. 2025120235 — 12 450 Kč (zaplaceno ✅)\n\nAktuální nezaplacené zálohy: 6 280 Kč\n\nChcete zobrazit detail konkrétní faktury?",
  },
  {
    keywords: ["spotřeba", "kolik spotřebuji", "energie", "kwh"],
    response:
      "Vaše spotřeba za poslední měsíce:\n\n⚡ Elektřina (Koněvova):\n  Březen 2026: 395 kWh\n  Únor 2026: 478 kWh\n  Leden 2026: 520 kWh\n\n🔥 Plyn (Koněvova):\n  Březen 2026: 62 m³\n  Únor 2026: 88 m³\n  Leden 2026: 102 m³\n\n📈 Spotřeba elektřiny v listopadu 2025 (456 kWh) byla výrazně vyšší než v předchozích měsících. Doporučujeme zkontrolovat spotřebiče.",
  },
];

export function getAssistantResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  for (const pattern of assistantPatterns) {
    if (pattern.keywords.some((kw) => lowerMsg.includes(kw))) {
      return pattern.response;
    }
  }

  return "Děkuji za váš dotaz. Bohužel mu plně nerozumím. Zkuste prosím upřesnit, co potřebujete, nebo využijte některou z rychlých otázek níže.\n\nPokud potřebujete okamžitou pomoc, zavolejte na bezplatnou linku 800 400 500 (Po-Ne, 8-20h).";
}
