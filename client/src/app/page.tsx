import { getProducts } from "@/service/service";

interface Product {
  _id: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  original_price: number;
  image: string;
  id: string;
  created_at: string;
  updated_at: string;
}

export default async function Home() {
  const data = await getProducts();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ul className="grid grid-cols-5 gap-20">
        {data.data.products.map((item: Product) => (
          <div key={item.id}>
            <div>{item.name}</div>
            <div>{item.original_price}</div>
            <div>{item.price}</div>
            <div>{item.quantity}</div>
          </div>
        ))}
      </ul>
    </div>
  );
}
