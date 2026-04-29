import productsData from '@/json/products.json';

const DEFAULT_LK_PRODUCTS_API_BASE = 'https://lk.truck-import.ru/api/v1/client';

export function getProductsSource() {
  return (process.env.PRODUCTS_SOURCE || 'lk').toLowerCase();
}

export function isLkProductsSource() {
  return getProductsSource() === 'lk';
}

export function getLkProductsApiBase() {
  const base = process.env.LK_PRODUCTS_API_BASE || DEFAULT_LK_PRODUCTS_API_BASE;
  return base.replace(/\/$/, '');
}

function makeStableIdFromSku(sku) {
  let hash = 5381;
  const input = String(sku || '');
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function normalizeProduct(raw, fallback = {}) {
  const sku = String(raw?.sku || '');
  const brandSlug = raw?.brand_slug ?? raw?.brand?.slug ?? raw?.brand ?? '';
  const brandName = raw?.brand_name ?? raw?.brand?.name ?? raw?.brand ?? '';
  const modelSlug = raw?.model_slug ?? raw?.model?.slug ?? raw?.model ?? '';
  const modelName = raw?.model_name ?? raw?.model?.name ?? raw?.model ?? '';
  return {
    // Для API lk в списке часто нет numeric id. Используем sku как стабильный id,
    // чтобы корзина могла повторно загрузить товар через /api/products/{idOrSku}.
    id: Number.isFinite(raw?.id) ? raw.id : (sku || makeStableIdFromSku(sku)),
    sku,
    name: raw?.name ?? raw?.title ?? '',
    title: raw?.title ?? raw?.name ?? '',
    price: raw?.price ?? '0',
    delivery: raw?.delivery ?? null,
    count: raw?.count ?? raw?.quantity ?? 0,
    quantity: raw?.quantity ?? raw?.count ?? 0,
    image_url: raw?.image_url ?? null,
    brand: brandSlug,
    brand_name: brandName,
    model: modelSlug,
    model_name: modelName,
    category_slug: raw?.category_slug ?? fallback.part ?? 'other',
    category_id: raw?.category_id ?? null,
    specifications: Array.isArray(raw?.specifications) ? raw.specifications : [],
    characteristics: Array.isArray(raw?.characteristics) ? raw.characteristics : [],
    description: raw?.description ?? null,
    truck_manufacturers: Array.isArray(raw?.truck_manufacturers) ? raw.truck_manufacturers : [],
  };
}

export function getJsonProducts() {
  return productsData.map((p) => normalizeProduct(p));
}

export async function fetchLkProductsPage(query = {}) {
  const url = new URL(`${getLkProductsApiBase()}/products`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`LK products request failed: ${res.status}`);
  }

  const data = await res.json();
  const fromHeader = Number.parseInt(res.headers.get('x-total-count') || '', 10);

  // Поддерживаем оба формата: массив или пагинированный объект.
  const rawItems = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  const normalizedItems = rawItems.map((item) => normalizeProduct(item, {
    brand: query.brand,
    model: query.model,
    part: query.part,
  }));

  const fromMeta = Number.parseInt(
    String(data?.meta?.total ?? data?.total ?? ''),
    10,
  );
  const total = Number.isFinite(fromMeta)
    ? fromMeta
    : (Number.isFinite(fromHeader) ? fromHeader : normalizedItems.length);

  return { items: normalizedItems, total };
}

export async function fetchLkProducts(query = {}) {
  const { items } = await fetchLkProductsPage(query);
  return items;
}

export async function fetchLkProductsCount(query = {}) {
  const url = new URL(`${getLkProductsApiBase()}/products/count`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`LK products count request failed: ${res.status}`);
  }

  const data = await res.json();
  const total = Number.parseInt(String(data?.total ?? data?.count ?? data), 10);
  if (!Number.isFinite(total)) {
    throw new Error('LK products count response has no numeric total');
  }
  return total;
}

export async function fetchLkBrands() {
  const res = await fetch(`${getLkProductsApiBase()}/brands`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((b) => b?.slug)
    .map((b) => ({ value: b.slug, label: b.name || b.slug }));
}

export async function fetchProductByIdOrSku(idOrSku) {
  if (!isLkProductsSource()) {
    const local = getJsonProducts();
    const asNumber = Number(idOrSku);
    if (Number.isFinite(asNumber)) {
      const byId = local.find((p) => p.id === asNumber);
      if (byId) return byId;
    }
    return local.find((p) => String(p.sku).toLowerCase() === String(idOrSku).toLowerCase()) || null;
  }

  const numeric = Number(idOrSku);
  if (Number.isFinite(numeric)) {
    const byIdRes = await fetch(`${getLkProductsApiBase()}/products/${numeric}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (byIdRes.ok) {
      const data = await byIdRes.json();
      return normalizeProduct(data);
    }
  }

  const matches = await fetchLkProducts({ sku: idOrSku, limit: 20, page: 1 });
  return matches.find((p) => String(p.sku).toLowerCase() === String(idOrSku).toLowerCase()) || matches[0] || null;
}
