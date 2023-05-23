// import { UserButton } from "@clerk/nextjs";
import Hero from '@/components/home/Hero';
const API_KEY = process.env.PRINTFUL_API_KEY;
const API_URL = 'https://api.printful.com';
import { Product } from '../types';
import ProductGrid from '../components/products/ProductGrid';


async function getProducts(limit= 40) {
  const url = `${API_URL}/store/products?limit=${limit}`;

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
    const productDetails = productData.map((response) => response.result);
    return productDetails;
  } 

export default async function Home() {
  const ProductData = await getProducts();

  return(
    <>
      <main>
        <Hero /> 
        <div className="pt-12 pb-12">
          <h1 className='flex justify-center text-3xl mb-9 font-bold'>New Arrivals</h1>
           <ProductGrid products={ProductData} /> 
        </div>
      </main>
  </>
  );
}


