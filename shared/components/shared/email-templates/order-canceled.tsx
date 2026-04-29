export interface OrderCanceledProps {
  orderId: number;
}

export const OrderCanceledTemplate = ({ orderId }: OrderCanceledProps) => {
  return (
    <div>
      <h1>Payment failed 😔</h1>
      <p>
        Unfortunately, payment for order <b>#{orderId}</b> was canceled or could
        not be completed.
      </p>
      <p>
        If any funds were charged, they will be returned to your card within a
        few business days.
      </p>
      <p>Please try placing a new order or contact our support team.</p>
    </div>
  );
};
