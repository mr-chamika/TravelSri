// types/payhere.ts - PayHere SDK TypeScript Definitions

export interface PayHerePaymentObject {
  sandbox: boolean;
  merchant_id: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  custom_1?: string;
  custom_2?: string;
  // Recurring payment fields
  recurrence?: string;
  duration?: string;
  startup_fee?: string;
  // Preapproval fields
  preapprove?: boolean;
  // Authorization fields
  authorize?: boolean;
  // Item-wise details
  item_number_1?: string;
  item_name_1?: string;
  quantity_1?: string;
  amount_1?: string;
  item_number_2?: string;
  item_name_2?: string;
  quantity_2?: string;
  amount_2?: string;
}

export interface PayHereSDK {
  startPayment: (
    paymentObject: PayHerePaymentObject,
    onCompleted: (paymentId: string) => void,
    onError: (error: string) => void,
    onDismissed: () => void
  ) => void;
}

export interface PayHerePaymentData {
  sandbox: boolean;
  merchant_id: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface PayHereNotificationData {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  custom_1?: string;
  custom_2?: string;
  method?: string;
  status_message?: string;
  card_holder_name?: string;
  card_no?: string;
  card_expiry?: string;
}