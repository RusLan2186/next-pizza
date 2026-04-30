import { prisma } from "@/prisma/prisma-client";

export interface GetSearchParams {
  query: string;
  sortBy: string;
  pizzaTypes: string;
  ingredients: string;
  priceFrom: string;
  priceTo: string;
  sizes: string;
  orderId?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 30;

const pizzaTypeToNumber: Record<string, number> = {
  traditional: 1,
  thin: 2,
};

const parseNumberValues = (value?: string) =>
  value
    ?.split(",")
    .map(Number)
    .filter((item) => !Number.isNaN(item)) ?? [];

const parsePizzaTypes = (value?: string) =>
  value
    ?.split(",")
    .map((item) => pizzaTypeToNumber[item])
    .filter((item) => item !== undefined) ?? [];

export const findPizzas = async (params: GetSearchParams) => {
  const sizes = parseNumberValues(params.sizes);
  const pizzaTypes = parsePizzaTypes(params.pizzaTypes);
  const ingredientsIdArr = parseNumberValues(params.ingredients);

  const priceFrom = Number(params.priceFrom);
  const priceTo = Number(params.priceTo);
  const minPrice =
    !Number.isNaN(priceFrom) && params.priceFrom
      ? priceFrom
      : DEFAULT_MIN_PRICE;
  const maxPrice =
    !Number.isNaN(priceTo) && params.priceTo ? priceTo : DEFAULT_MAX_PRICE;

  const hasPizzaFilters =
    sizes.length > 0 || pizzaTypes.length > 0 || ingredientsIdArr.length > 0;

  // Pizza cards show "from" price (minimum variant price),
  // so for pizza products we filter by that minimum price semantics.
  const priceFilter = {
    OR: [
      {
        AND: [
          { variants: { some: { pizzaType: { not: null } } } },
          { variants: { some: { price: { lte: maxPrice } } } },
          { variants: { none: { price: { lt: minPrice } } } },
        ],
      },
      {
        AND: [
          { variants: { every: { pizzaType: null } } },
          {
            variants: {
              some: {
                price: {
                  gte: minPrice,
                  lte: maxPrice,
                },
              },
            },
          },
        ],
      },
    ],
  };

  const pizzaSpecificFilter = hasPizzaFilters
    ? {
        OR: [
          {
            AND: [
              { variants: { some: { pizzaType: { not: null } } } },
              ...(ingredientsIdArr.length
                ? [
                    {
                      ingredients: {
                        some: { id: { in: ingredientsIdArr } },
                      },
                    },
                  ]
                : []),
              ...(sizes.length || pizzaTypes.length
                ? [
                    {
                      variants: {
                        some: {
                          ...(sizes.length ? { size: { in: sizes } } : {}),
                          ...(pizzaTypes.length
                            ? { pizzaType: { in: pizzaTypes } }
                            : {}),
                        },
                      },
                    },
                  ]
                : []),
            ],
          },
          {
            variants: {
              every: { pizzaType: null },
            },
          },
        ],
      }
    : undefined;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc",
        },
        where: {
          AND: [
            priceFilter,
            ...(pizzaSpecificFilter ? [pizzaSpecificFilter] : []),
          ],
        },
        include: {
          ingredients: true,
          variants: true,
        },
      },
    },
  });

  return categories;
};
