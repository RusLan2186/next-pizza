interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <div>
      ProductPage
      <span>{id}</span>
    </div>
  );
}
