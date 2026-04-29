import { cookies } from "next/headers";
import { headers } from "next/headers";

export const getProducts = async ({ page = 1, limit = 2 }) => {
  const cookieStore = await cookies();
  const headersStore = await headers();
  const host = headersStore.get('x-forwarded-host') || headersStore.get('host');
  const protocol = headersStore.get('x-forwarded-proto') || 'http';
  const baseUrl = host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

  const result = await fetch(
    `${baseUrl}/api/products?page=${page}&limit=${limit}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!result.ok) {
    return { isError: true, data: undefined };
  }

  const data = await result.json();

  return { isError: false, data };
};
