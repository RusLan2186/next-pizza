import {
  CheckboxFiltersGroup,
  FilterCheckbox,
  RangeSlider,
  Title,
} from "@/components/shared";
import { Input } from "../ui";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Filters" size="sm" className="mb-5 font-bold" />

      <div className="flex flex-col gap-4">
        <FilterCheckbox text="New" value="1" />
        <FilterCheckbox text="popular" value="2" />
      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3 capitalize">price range</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={30}
            defaultValue={0}
          />
          <Input type="number" placeholder="20$" min={10} max={20} />
        </div>

        <RangeSlider min={0} max={30} step={1} value={[0, 20]} />
      </div>

      <CheckboxFiltersGroup
        title="Ingredients"
        className="mt-5"
        limit={6}
        ingredients={[
          { text: "Tomato", value: "1" },
          { text: "Cheese", value: "2" },
          { text: "Pepperoni", value: "3" },
          { text: "Ham", value: "4" },
          { text: "Pineapple", value: "5" },
          { text: "Mushrooms", value: "6" },
          { text: "Tomato", value: "7" },
          { text: "Cheese", value: "8" },
          { text: "Pepperoni", value: "9" },
        ]}
        defaultIngredients={[
          { text: "Tomato", value: "1" },
          { text: "Cheese", value: "2" },
          { text: "Pepperoni", value: "3" },
          { text: "Ham", value: "4" },
          { text: "Pineapple", value: "5" },
          { text: "Mushrooms", value: "6" },
        ]}
      />

      <div className="flex flex-col  pt-8">
        <Title text="Type of test" size="xs" className="mb-3 font-bold" />

        <div className="flex flex-col gap-4">
          <FilterCheckbox text="traditional" value="1" />
          <FilterCheckbox text="think" value="2" />
        </div>
      </div>
    </div>
  );
};
