import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const PRIMARY = '#FF3D78';
const SORT_OPTIONS = ['신상순', '인기순', '낮은가격순', '높은가격순'];

const BANNERS = [
  { bg: 'linear-gradient(135deg, #FF3D78 0%, #FF8C42 100%)', title: '봄 신상 대전', sub: '최대 50% 할인' },
  { bg: 'linear-gradient(135deg, #6C63FF 0%, #3BC9DB 100%)', title: '데일리 룩', sub: '오늘의 추천 스타일' },
  { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213E 100%)', title: '블랙 에디션', sub: '한정 수량 특가' },
];

export default function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('신상순');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(r => setProducts(r.data))
      .catch(() => setError('상품을 불러오지 못했습니다.'));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === '낮은가격순') return a.price - b.price;
    if (sortBy === '높은가격순') return b.price - a.price;
    return 0;
  });

  const banner = BANNERS[bannerIdx];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header
        onProductsChange={setProducts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* 배너 */}
        <div style={{ margin: '20px 0', borderRadius: 12, overflow: 'hidden', position: 'relative', height: 200, background: banner.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transition: 'background 0.5s' }}>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>{banner.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6 }}>{banner.sub}</div>
          {/* 배너 도트 */}
          <div style={{ position: 'absolute', bottom: 12, display: 'flex', gap: 6 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </div>

        {/* 정렬 바 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#999' }}>총 <strong style={{ color: '#1a1a1a' }}>{products.length}</strong>개</span>
          <div style={{ display: 'flex', gap: 0 }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                style={{ padding: '4px 10px', fontSize: 12, background: 'none', border: 'none', color: sortBy === opt ? PRIMARY : '#999', fontWeight: sortBy === opt ? 700 : 400, borderRight: '1px solid #eee' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 에러 */}
        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 14 }}>{error}</div>
        )}

        {/* 상품 없을 때 */}
        {!error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#ccc' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
            <div style={{ fontSize: 15, color: '#aaa' }}>등록된 상품이 없습니다</div>
          </div>
        )}

        {/* 상품 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 16px', paddingBottom: 60 }}>
          {sorted.map(p => (
            <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProductCard product={p} />
            </Link>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '32px 20px', textAlign: 'center', color: '#bbb', fontSize: 12, lineHeight: 2 }}>
        <div style={{ fontWeight: 700, color: PRIMARY, fontSize: 14, marginBottom: 8 }}>SHOPLAB</div>
        <div>보안 취약점 진단 실습 환경 · Security Lab Project</div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <span>이용약관</span><span>개인정보처리방침</span><span>고객센터</span>
        </div>
      </footer>
    </div>
  );
}
