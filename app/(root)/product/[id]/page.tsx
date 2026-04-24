import { prisma } from "@/prisma/prisma-client";
import {
  Container,
  GroupVariants,
  PizzaImage,
  Title,
} from "@/shared/components/shared";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <>
      <Container className="flex flex-col my-10">
        <div className="flex flex-1">
          <PizzaImage
            src={product.imageUrl}
            name={product.productName}
            size={40}
          />

          <div className="w-[490px] bg-[#F7F6F5] p-7">
            <Title
              text={product.productName}
              size="md"
              className="font-extrabold mb-1"
            />

            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
              unde ullam distinctio sint maiores voluptas enim minima laboriosam
              minus. Ullam!
            </p>

            <GroupVariants
              value="2"
              items={[
                {
                  name: "Small",
                  value: "1",
                },

                {
                  name: "Middle",
                  value: "2",
                },

                {
                  name: "Big",
                  value: "3",
                  disabled: true,
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
