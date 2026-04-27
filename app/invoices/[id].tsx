import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockInvoices } from '@/data/mock-invoices';
import { mockSupplyPoints } from '@/data/mock-supply-points';
import {
  formatCurrency,
  formatDate,
  getEnergyTypeLabel,
  getInvoiceStatusLabel,
} from '@/utils/format';
import { getInvoiceTone } from '@/utils/tones';
import { Colors, Tones } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InfoRow } from '@/components/ui/InfoRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = mockInvoices.find((i) => i.id === id);
  const sp = invoice
    ? mockSupplyPoints.find((s) => s.id === invoice.supplyPointId)
    : undefined;

  const [paying, setPaying] = useState(false);

  if (!invoice) {
    return (
      <View className="flex-1 bg-surface">
        <EmptyState
          icon="alert-circle-outline"
          title="Faktura nenalezena"
          message="Zkontrolujte, zda jste otevřeli správný odkaz."
        />
      </View>
    );
  }

  const tone = getInvoiceTone(invoice.status);
  const palette = Tones[tone];
  const isUnpaid = invoice.status !== 'PAID';

  const overdueDays = (() => {
    if (invoice.status !== 'OVERDUE') return null;
    const ms = Date.now() - new Date(invoice.dueDate).getTime();
    return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)));
  })();

  const handlePay = async () => {
    setPaying(true);
    setTimeout(() => setPaying(false), 1500);
  };

  const handleShare = () => {
    Share.share({
      title: `Faktura ${invoice.invoiceNumber}`,
      message: `Faktura č. ${invoice.invoiceNumber} — ${formatCurrency(
        invoice.amount,
      )}`,
    }).catch(() => {});
  };

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        contentContainerStyle={{ paddingBottom: isUnpaid ? 120 : 32 }}
      >
        {/* Hero status banner */}
        <View
          className="mx-5 mt-4 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: palette.bg,
            borderWidth: 1,
            borderColor: palette.border,
          }}
        >
          <View className="p-5 items-center">
            <View
              className="w-14 h-14 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: palette.solid }}
            >
              <Ionicons
                name={
                  invoice.status === 'PAID'
                    ? 'checkmark'
                    : invoice.status === 'OVERDUE'
                      ? 'warning'
                      : 'time'
                }
                size={28}
                color="#fff"
              />
            </View>
            <Text
              className="text-2xs font-bold uppercase tracking-wider"
              style={{ color: palette.text }}
            >
              {getInvoiceStatusLabel(invoice.status)}
            </Text>
            <Text className="text-3xl font-bold text-ink mt-2">
              {formatCurrency(invoice.amount)}
            </Text>
            <Text className="text-sm text-ink-muted mt-1">
              č. {invoice.invoiceNumber}
            </Text>
            {overdueDays && (
              <View
                className="mt-3 px-3 py-1 rounded-full"
                style={{ backgroundColor: palette.solid }}
              >
                <Text className="text-2xs font-bold text-white">
                  {overdueDays} {overdueDays === 1 ? 'den' : 'dní'} po
                  splatnosti
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Detail */}
        <View className="px-5 mt-5">
          <SectionHeader title="Detail" />
          <Card padding="md">
            <InfoRow
              icon="document-outline"
              label="Typ"
              value={invoice.type === 'ADVANCE' ? 'Záloha' : 'Vyúčtování'}
            />
            <InfoRow
              icon="flash-outline"
              label="Energie"
              value={sp ? getEnergyTypeLabel(sp.type) : '—'}
            />
            <InfoRow
              icon="location-outline"
              label="Odběrné místo"
              value={sp ? `${sp.address.street}, ${sp.address.city}` : '—'}
            />
            <InfoRow
              icon="calendar-outline"
              label="Období"
              value={`${formatDate(invoice.period.from)} – ${formatDate(invoice.period.to)}`}
            />
            <InfoRow
              icon="receipt-outline"
              label="Vystaveno"
              value={formatDate(invoice.issuedDate)}
            />
            <InfoRow
              icon="time-outline"
              label="Splatnost"
              value={formatDate(invoice.dueDate)}
              emphasis={isUnpaid ? 'strong' : 'default'}
              withDivider={!invoice.paidDate}
            />
            {invoice.paidDate && (
              <InfoRow
                icon="checkmark-circle-outline"
                label="Zaplaceno"
                value={formatDate(invoice.paidDate)}
                withDivider={false}
              />
            )}
          </Card>
        </View>

        {/* Breakdown */}
        {invoice.breakdown && (
          <View className="px-5 mt-5">
            <SectionHeader title="Rozpis částky" />
            <Card padding="md">
              <InfoRow
                label="Regulovaná složka"
                value={formatCurrency(invoice.breakdown.regulatedComponent)}
              />
              <InfoRow
                label="Neregulovaná složka"
                value={formatCurrency(invoice.breakdown.unregulatedComponent)}
              />
              <InfoRow
                label="DPH"
                value={formatCurrency(invoice.breakdown.tax)}
                withDivider={false}
              />
              <View className="mt-2 pt-3 border-t border-line">
                <View className="flex-row items-center justify-between py-1">
                  <Text className="text-sm font-bold text-ink">Celkem</Text>
                  <Text className="text-base font-bold text-ink">
                    {formatCurrency(invoice.amount)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Actions */}
        <View className="px-5 mt-5 flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Sdílet"
              variant="secondary"
              icon="share-outline"
              onPress={handleShare}
              fullWidth
            />
          </View>
          <View className="flex-1">
            <Button
              label="Stáhnout PDF"
              variant="secondary"
              icon="download-outline"
              fullWidth
            />
          </View>
        </View>

        {/* QR Payment */}
        {invoice.qrPaymentData && isUnpaid && (
          <View className="px-5 mt-5">
            <SectionHeader title="Platba QR kódem" />
            <Card padding="lg">
              <View className="items-center">
                <View
                  className="w-44 h-44 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: Colors.surfaceSubtle }}
                >
                  <Ionicons name="qr-code" size={120} color={Colors.text} />
                </View>
                <Text className="text-xs text-ink-muted text-center">
                  Naskenujte QR kód v bankovní aplikaci
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Sticky Pay CTA */}
      {isUnpaid && (
        <View
          className="absolute left-0 right-0 bottom-0 bg-white px-5 pt-3 pb-7 border-t border-line-subtle"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <Button
            label={`Zaplatit ${formatCurrency(invoice.amount)}`}
            variant="primary"
            size="lg"
            icon="card-outline"
            loading={paying}
            tone={tone === 'danger' ? 'danger' : undefined}
            onPress={handlePay}
            fullWidth
          />
        </View>
      )}
    </View>
  );
}
