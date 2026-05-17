import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getByCategory } from '../api/product';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const P = '#FF3D78';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState('신상순');

  useEffect(() => {
    if (category) getByCategory(category).then(r => setProducts(r.data));
  }, [category]);

  const sorted = [...products].sort((a, b) =>
    sort === '낮은가격순' ? a.price - b.price : sort === '높은가격순' ? b.price - a.price : 0
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <Link to="/" style={{ color: P, fontWeight: 700, fontSize: 18 }}>SHOPLAB</Link>
        <span style={{ color: '#aaa' }}>›</span>
        <span style={{ fontWeight: 600 }}>{category}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{category}</h2>
          <div style={{ display: 'flex', gap: 0 }}>
            {['신상순', '낮은가격순', '높은가격순'].map(s => (
              <button key={s} onClick={() => setSort(s)}
                style={{ padding: '4px 12px', fontSize: 12, background: 'none', border: 'none', color: sort === s ? P : '#999', fontWeight: sort === s ? 700 : 400, borderRight: '1px solid #eee', cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#ccc' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🛍️</div>
            <div>해당 카테고리에 상품이 없습니다</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 16px' }}>
            {sorted.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
