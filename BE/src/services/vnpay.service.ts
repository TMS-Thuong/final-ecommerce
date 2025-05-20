import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { VNPay, ProductCode, VnpLocale, HashAlgorithm, ReturnQueryFromVNPay } from 'vnpay';

import {
  VNPayResponseCode,
  VNPayResponseMessage,
  VNPayIpnResponse,
  VNPayVerifyReturnResult,
  VNPayUrlParams,
  VNP_AMOUNT_MULTIPLIER,
  ALLOWED_AMOUNT_DIFFERENCE,
} from '@app/constants/vnpay.constants';
import { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL, VNP_RETURN_URL } from '@config/env';

const prisma = new PrismaClient();

const vnpay = new VNPay({
  tmnCode: VNP_TMN_CODE,
  secureSecret: VNP_HASH_SECRET,
  vnpayHost: VNP_URL.replace('/paymentv2/vpcpay.html', ''),
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  enableLog: true,
});

class VNPayService {
  async createPaymentUrl(orderId: number): Promise<string> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error('Order not found');
    const orderInfo = `Thanh toan don hang #${order.orderCode}`;

    const clientIp = '127.0.0.1';

    const orderRef = `${orderId.toString().padStart(6, '0')}-${Date.now()}`;

    const paymentParams: VNPayUrlParams = {
      vnp_Amount: Number(order.totalAmount),
      vnp_IpAddr: clientIp,
      vnp_TxnRef: orderRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
    };

    const paymentUrl = vnpay.buildPaymentUrl(paymentParams);

    return paymentUrl;
  }

  async verifyReturnUrl(vnpParams: Record<string, string>): Promise<VNPayVerifyReturnResult> {
    try {
      const paramsWithRequiredFields = {
        ...vnpParams,
        vnp_OrderInfo: vnpParams.vnp_OrderInfo || '',
        vnp_TxnRef: vnpParams.vnp_TxnRef || '',
      } as ReturnQueryFromVNPay;

      const verifyResult = vnpay.verifyReturnUrl(paramsWithRequiredFields);

      let orderId = 0;
      try {
        const txnRefParts = verifyResult.vnp_TxnRef?.split('-');
        if (txnRefParts && txnRefParts.length >= 1) {
          orderId = parseInt(txnRefParts[0], 10);
        } else {
          console.error('Định dạng vnp_TxnRef không hợp lệ:', verifyResult.vnp_TxnRef);
        }
      } catch (error) {
        console.error('Lỗi khi phân tích vnp_TxnRef:', verifyResult.vnp_TxnRef, error);
      }

      return {
        isValid: verifyResult.isVerified,
        orderId,
        responseCode: verifyResult.vnp_ResponseCode ? String(verifyResult.vnp_ResponseCode) : '',
        transactionRef: verifyResult.vnp_TransactionNo ? String(verifyResult.vnp_TransactionNo) : '',
        transactionDate: verifyResult.vnp_PayDate ? String(verifyResult.vnp_PayDate) : '',
      };
    } catch (error) {
      console.error('Lỗi khi xác thực URL trả về từ VNPAY:', error);
      return {
        isValid: false,
        orderId: 0,
        responseCode: '',
        transactionRef: '',
        transactionDate: '',
      };
    }
  }

  async processReturnUrl(vnpParams: Record<string, string>): Promise<VNPayIpnResponse> {
    try {
      const verificationResult = await this.verifyReturnUrl(vnpParams);

      if (!verificationResult.isValid) {
        return {
          RspCode: VNPayResponseCode.INVALID_SIGNATURE,
          Message: VNPayResponseMessage[VNPayResponseCode.INVALID_SIGNATURE],
        };
      }

      const { orderId, responseCode } = verificationResult;

      if (orderId <= 0) {
        return {
          RspCode: VNPayResponseCode.ORDER_NOT_FOUND,
          Message: VNPayResponseMessage[VNPayResponseCode.ORDER_NOT_FOUND],
        };
      }

      if (responseCode === VNPayResponseCode.SUCCESS) {
        return {
          RspCode: VNPayResponseCode.SUCCESS,
          Message: VNPayResponseMessage[VNPayResponseCode.SUCCESS],
        };
      } else {
        return {
          RspCode: responseCode || VNPayResponseCode.UNKNOWN_ERROR,
          Message:
            VNPayResponseMessage[responseCode as VNPayResponseCode] ||
            VNPayResponseMessage[VNPayResponseCode.UNKNOWN_ERROR],
        };
      }
    } catch (error) {
      console.error('Lỗi xử lý URL trả về:', error);
      return {
        RspCode: VNPayResponseCode.UNKNOWN_ERROR,
        Message: VNPayResponseMessage[VNPayResponseCode.UNKNOWN_ERROR],
      };
    }
  }

  async processIpnCallback(vnpParams: Record<string, string>): Promise<VNPayIpnResponse> {
    try {
      const paramsWithRequiredFields = {
        ...vnpParams,
        vnp_OrderInfo: vnpParams.vnp_OrderInfo || '',
        vnp_TxnRef: vnpParams.vnp_TxnRef || '',
      } as ReturnQueryFromVNPay;

      const verifyResult = vnpay.verifyIpnCall(paramsWithRequiredFields);

      if (!verifyResult.isVerified) {
        return {
          RspCode: VNPayResponseCode.INVALID_SIGNATURE,
          Message: VNPayResponseMessage[VNPayResponseCode.INVALID_SIGNATURE],
        };
      }

      let orderId = 0;
      try {
        const txnRefParts = verifyResult.vnp_TxnRef?.split('-');
        if (txnRefParts && txnRefParts.length >= 1) {
          orderId = parseInt(txnRefParts[0], 10);
        } else {
          console.error('Định dạng vnp_TxnRef không hợp lệ:', verifyResult.vnp_TxnRef);
          return {
            RspCode: VNPayResponseCode.ORDER_NOT_FOUND,
            Message: VNPayResponseMessage[VNPayResponseCode.ORDER_NOT_FOUND],
          };
        }
      } catch (error) {
        console.error('Lỗi khi phân tích vnp_TxnRef:', verifyResult.vnp_TxnRef, error);
        return {
          RspCode: VNPayResponseCode.ORDER_NOT_FOUND,
          Message: VNPayResponseMessage[VNPayResponseCode.ORDER_NOT_FOUND],
        };
      }

      if (orderId <= 0) {
        return {
          RspCode: VNPayResponseCode.ORDER_NOT_FOUND,
          Message: VNPayResponseMessage[VNPayResponseCode.ORDER_NOT_FOUND],
        };
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return {
          RspCode: VNPayResponseCode.ORDER_NOT_FOUND,
          Message: VNPayResponseMessage[VNPayResponseCode.ORDER_NOT_FOUND],
        };
      }

      const orderAmount = Number(order.totalAmount);
      const paidAmount = Number(verifyResult.vnp_Amount) / VNP_AMOUNT_MULTIPLIER;

      if (Math.abs(orderAmount - paidAmount) > ALLOWED_AMOUNT_DIFFERENCE) {
        console.error(`Số tiền không khớp: Đơn hàng ${orderAmount}, Thanh toán ${paidAmount}`);
        return {
          RspCode: VNPayResponseCode.INVALID_AMOUNT,
          Message: VNPayResponseMessage[VNPayResponseCode.INVALID_AMOUNT],
        };
      }

      if (String(verifyResult.vnp_ResponseCode) === VNPayResponseCode.SUCCESS && verifyResult.isSuccess) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.Processing,
            paymentStatus: PaymentStatus.Paid,
          },
        });

        return {
          RspCode: VNPayResponseCode.SUCCESS,
          Message: VNPayResponseMessage[VNPayResponseCode.SUCCESS],
        };
      } else {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.Failed,
          },
        });

        return {
          RspCode: VNPayResponseCode.SUCCESS,
          Message: VNPayResponseMessage[VNPayResponseCode.SUCCESS],
        };
      }
    } catch (error) {
      console.error('Lỗi xử lý IPN callback:', error);
      return {
        RspCode: VNPayResponseCode.UNKNOWN_ERROR,
        Message: VNPayResponseMessage[VNPayResponseCode.UNKNOWN_ERROR],
      };
    }
  }
}

export default new VNPayService();
