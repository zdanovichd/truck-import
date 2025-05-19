'use client';

export default function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>Цена: {product.price.toLocaleString()}₽</p>
        </div>
      ))}
    </div>
  );
}
