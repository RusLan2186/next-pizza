import {
  Container,
  Filters,
  ProductsListGroup,
  Title,
  TopBar,
} from "@/components/shared";

import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizza";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const categories = await findPizzas(resolvedSearchParams);

  return (
    <>
      <Container className="mt-10">
        <Title text="All pizzas" size="lg" className="font-extrabold mb-5" />
      </Container>
      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0,
        )}
      />

      <Container className="pb-14 mt-10">
        <div className="flex gap-[100px]">
          <div className="w-[250px]">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (categorie) =>
                  categorie.products.length > 0 && (
                    <ProductsListGroup
                      key={categorie.id}
                      title={categorie.categoryName}
                      products={categorie.products}
                      categoryId={categorie.id}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
