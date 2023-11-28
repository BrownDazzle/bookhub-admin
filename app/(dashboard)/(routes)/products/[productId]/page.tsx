import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string }
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany();

  const publishers = await prismadb.publisher.findMany();

  const levels = await prismadb.level.findMany();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          levels={levels}
          publishers={publishers}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;
