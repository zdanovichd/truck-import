import { cookies } from "next/headers";

export const getProducts = async ({ page = 1, limit = 2 }) => {
  const cookieStore = await cookies();

  const result = await fetch(
    `http://localhost:3000/api/products?page=${page}&limit=${limit}`,
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
