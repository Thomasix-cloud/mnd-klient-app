import { Ionicons } from "@expo/vector-icons";
import { ToneName } from "@/constants/colors";
import {
  ContractStatus,
  FixationType,
  InvoiceStatus,
  NotificationType,
} from "@/types";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export function getInvoiceTone(status: InvoiceStatus): ToneName {
  switch (status) {
    case "PAID":
      return "success";
    case "UNPAID":
      return "warning";
    case "OVERDUE":
      return "danger";
  }
}

export function getInvoiceIcon(
  status: InvoiceStatus,
): "checkmark-circle" | "time" | "warning" {
  switch (status) {
    case "PAID":
      return "checkmark-circle";
    case "UNPAID":
      return "time";
    case "OVERDUE":
      return "warning";
  }
}

export function getContractTone(status: ContractStatus): ToneName {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "TERMINATED":
      return "neutral";
  }
}

export function getFixationTone(type: FixationType): ToneName {
  switch (type) {
    case "FIXED":
      return "success";
    case "DECLINING":
      return "info";
    case "NONE":
      return "warning";
  }
}

export function getNotificationTone(type: NotificationType): ToneName {
  switch (type) {
    case "OVERDUE_WARNING":
      return "danger";
    case "INVOICE":
      return "warning";
    case "PAYMENT":
      return "success";
    case "PRICE_CHANGE":
      return "info";
    case "CONTRACT":
      return "brand";
    case "INFO":
    default:
      return "neutral";
  }
}

export function getNotificationIcon(
  type: NotificationType,
): IoniconName {
  switch (type) {
    case "OVERDUE_WARNING":
      return "warning";
    case "INVOICE":
      return "receipt";
    case "PAYMENT":
      return "checkmark-circle";
    case "PRICE_CHANGE":
      return "trending-up";
    case "CONTRACT":
      return "document-text";
    case "INFO":
    default:
      return "information-circle";
  }
}
