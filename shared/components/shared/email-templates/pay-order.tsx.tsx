export interface PayOrderProps {
  orderId: number;
  subtotalAmount: number;
  taxAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate = ({
  orderId,
  subtotalAmount,
  taxAmount,
  deliveryAmount,
  totalAmount,
  paymentUrl,
}: PayOrderProps) => {
  return (
    <div>
      <h1>Order {orderId}!</h1>

      <p>
        Productprice: {subtotalAmount} $<br />
        Taxes (7%): {taxAmount} $<br />
        Delivery: {deliveryAmount} $<br />
        Total: {totalAmount} $<br />
        Please follow <a href={paymentUrl}>this link </a> to pay for your order.
      </p>
    </div>
  );
};
