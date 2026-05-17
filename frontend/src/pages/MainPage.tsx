import { useEffect, useState } from 'react';
import { getProducts, searchProducts } from '../api/product';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const styles: Record<string, React.CSSProperties> = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#fff',
    padding: '60px 32px',
    textAlign: 'center',
  },
  heroTitle: { fontSize: 36, fontWeight: 700, marginBottom: 12 },
  heroSub: { color: '#aaa', marginBottom: 24 },
  searchBox: { display: 'flex', justifyContent: 'center', gap: 8 },
  input: {
    padding: '10px 16px', width: 320, borderRadius: 4,
    border: '1px solid #444', background: '#2a2a3e', color: '#fff', fontSize: 14,
  },
  searchBtn: {
    padding: '10px 20px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14,
  },
  section: { padding: '32px', maxWidth: 1200, margin: '0 auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 600, marginBottom: 4 },
  error: { color: 'red', textAlign: 'center', padding: 20 },
};

export default function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError('상품을 불러오지 못했습니다.'));
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      getProducts().then(res => setProducts(res.data));
      return;
    }
    try {
      const res = await searchProducts(searchQuery);
      setProducts(res.data);
    } catch {
      setError('검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>ShopMall Security Lab</h1>
        <p style={styles.heroSub}>보안 취약점 진단 실습 환경</p>
        <div style={styles.searchBox}>
          <input
            style={styles.input}
            placeholder="상품명을 검색하세요..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button style={styles.searchBtn} onClick={handleSearch}>검색</button>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>전체 상품</div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.grid}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
