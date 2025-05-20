import { ProductCode, VnpLocale } from 'vnpay';

export enum VNPayResponseCode {
  SUCCESS = '00', // Giao dịch thành công
  ORDER_NOT_FOUND = '01', // Không tìm thấy đơn hàng
  INVALID_AMOUNT = '04', // Số tiền không hợp lệ
  INVALID_SIGNATURE = '97', // Chữ ký không hợp lệ
  CUSTOMER_CANCEL = '24', // Khách hàng hủy giao dịch
  TRANSACTION_TIMEOUT = '15', // Giao dịch hết hạn
  UNKNOWN_ERROR = '99', // Lỗi không xác định
}

export const VNPayResponseMessage = {
  [VNPayResponseCode.SUCCESS]: 'Transaction successful',
  [VNPayResponseCode.ORDER_NOT_FOUND]: 'Order not found',
  [VNPayResponseCode.INVALID_AMOUNT]: 'Invalid amount',
  [VNPayResponseCode.INVALID_SIGNATURE]: 'Invalid signature',
  [VNPayResponseCode.CUSTOMER_CANCEL]: 'Customer cancelled the transaction',
  [VNPayResponseCode.TRANSACTION_TIMEOUT]: 'Transaction timed out',
  [VNPayResponseCode.UNKNOWN_ERROR]: 'Unknown error',
};

// Định dạng response cho VNPAY IPN
export interface VNPayIpnResponse {
  RspCode: string;
  Message: string;
}

// Kết quả xác thực URL trả về
export interface VNPayVerifyReturnResult {
  isValid: boolean;
  orderId: number;
  responseCode: string;
  transactionRef: string;
  transactionDate: string;
}

export interface VNPayUrlParams {
  vnp_Amount: number;
  vnp_IpAddr: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: ProductCode;
  vnp_ReturnUrl: string;
  vnp_Locale: VnpLocale;
}

export const TXN_REF_FORMAT = '{orderId}-{timestamp}';

export const VNP_AMOUNT_MULTIPLIER = 100;
export const ALLOWED_AMOUNT_DIFFERENCE = 1;
