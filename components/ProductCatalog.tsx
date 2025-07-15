import React from "react";

import ProductCard from "./ProductCard";

import { IProduct } from "../types/product";

interface ProductCatalogProps {
  title: string;
  products: IProduct[];
}
const ProductCatalog = ({ title, products }: ProductCatalogProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products?.map((product: IProduct) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalog;
