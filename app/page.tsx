import {
  Container,
  Filters,
  ProductsListGroup,
  Title,
  TopBar,
} from "@/components/shared";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="All pizzas" size="lg" className="font-extrabold mb-5" />
      </Container>
      <TopBar />

      <Container className="pb-14 mt-10">
        <div className="flex gap-[100px]">
          <div className="w-[250px]">
            <Filters />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsListGroup
                title="Pizza"
                categoryId={1}
                products={[
                  {
                    id: 1,
                    name: "Pepperoni",
                    price: 12,
                    items: [{ price: 12 }],
                    imageUrl: "/pizza/pizza-1.png", // <-- just a string
                  },
                  {
                    id: 2,
                    name: "Margherita",
                    price: 10,
                    items: [{ price: 15 }],
                    imageUrl: "/pizza/pizza-2.png",
                  },
                  {
                    id: 3,
                    name: "Hawaiian",
                    price: 11,
                    items: [{ price: 20 }],
                    imageUrl: "/pizza/pizza-3.png",
                  },
                  {
                    id: 4,
                    name: "Veggie",
                    price: 9,
                    items: [{ price: 5 }],
                    imageUrl: "/pizza/pizza-2.png",
                  },
                  {
                    id: 5,
                    name: "BBQ Chicken",
                    price: 13,
                    items: [{ price: 24 }],
                    imageUrl: "/pizza/pizza-1.png",
                  },
                  {
                    id: 6,
                    name: "Meat Lovers",
                    price: 11,
                    items: [{ price: 20 }],
                    imageUrl: "/pizza/pizza-3.png",
                  },
                ]}
              />

              <ProductsListGroup
                title="Pasta"
                categoryId={2}
                products={[
                  {
                    id: 1,
                    name: "Pepperoni",
                    price: 12,
                    items: [{ price: 12 }],
                    imageUrl: "/pizza/pizza-1.png", // <-- just a string
                  },
                  {
                    id: 2,
                    name: "Margherita",
                    price: 10,
                    items: [{ price: 15 }],
                    imageUrl: "/pizza/pizza-2.png",
                  },
                  {
                    id: 3,
                    name: "Hawaiian",
                    price: 11,
                    items: [{ price: 20 }],
                    imageUrl: "/pizza/pizza-3.png",
                  },
                  {
                    id: 4,
                    name: "Veggie",
                    price: 9,
                    items: [{ price: 5 }],
                    imageUrl: "/pizza/pizza-2.png",
                  },
                  {
                    id: 5,
                    name: "BBQ Chicken",
                    price: 13,
                    items: [{ price: 24 }],
                    imageUrl: "/pizza/pizza-1.png",
                  },
                  {
                    id: 6,
                    name: "Meat Lovers",
                    price: 11,
                    items: [{ price: 20 }],
                    imageUrl: "/pizza/pizza-3.png",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
