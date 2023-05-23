//Need Work Still
import { Product } from '../../../../types';
import ProductGrid from '@/components/products/ProductGrid';

async function getOuterwear() {
  const API_KEY = process.env.PRINTFUL_API_KEY;
  const API_URL = 'https://api.printful.com';
  const url = `${API_URL}/store/products`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  const products: Product[] = data.result;
  const productPromises = products.map((product: any) =>
    fetch(`${API_URL}/store/products/${product.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  );
  const productResponses = await Promise.all(productPromises);
  const productData = await Promise.all(
    productResponses.map((response) => response.json())
  );
  const productOuterwear = productData.map((response) => response.result);
  return productOuterwear;
}



export default async function Page() {

  const productData = await getOuterwear();
  const products = productData.filter(product =>
      product.sync_variants.some((variant: any) => variant.main_category_id === 95)
    );


  return (
    <>
      <div>
        <h1 className='flex justify-center text-3xl pt-3 mb-6 font-bold '>Outerwear</h1>
        <ProductGrid products={products} />
      </div>
    </>
  );
}
