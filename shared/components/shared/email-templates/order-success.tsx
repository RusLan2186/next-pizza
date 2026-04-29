export interface OrderSuccessProps {
  orderId: number;
  totalAmount: number;
}

export const OrderSuccessTemplate = ({
  orderId,
  totalAmount,
}: OrderSuccessProps) => {
  return (
    <div>
      <h1>Thank you for your order! 🎉</h1>
      <p>
        Your order <b>#{orderId}</b> has been successfully paid.
      </p>
      <p>
        Total: <b>${totalAmount}</b>
      </p>
      <p>
        We are already preparing your pizza and will deliver it soon. Enjoy your
        meal!
      </p>
    </div>
  );
};
