import { WhiteBlock } from "../white-block";
import { FormAddressInput, FormTextarea } from "../form";
import { CheckoutFormValues } from "./checkout-schema";

interface Props {

  className?: string;
}

export const CheckoutAdressForm: React.FC<Props> = ({
  className,

}) => {
  return (
    <WhiteBlock title="3. Delivery info" className={className}>
      <div className="flex flex-col gap-5">
        <FormAddressInput<CheckoutFormValues>
          name="adress"
          suggestionIdName="adressSuggestionId"
          placeholder="Enter your address..."
        />

        <FormTextarea
          name="comments"
          className="text-base"
          rows={5}
          placeholder="Comments on the order"
        />
      </div>
    </WhiteBlock>
  );
};
