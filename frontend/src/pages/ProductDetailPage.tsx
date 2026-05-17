import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../api/product';
import { addToCart } from '../api/cart';
import { Product } from '../types';

const P = '#FF3D78';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'detail' | 'review' | 'qna'>('detail');

  useEffect(() => {
    getProduct(Number(id)).then(r => setProduct(r.data)).catch(() => navigate('/'));
    // 최근 본 상품 저장
    const viewed: number[] = JSON.parse(localStorage.getItem('recentViewed') || '[]');
    const updated = [Number(id), ...viewed.filter(v => v !== Number(id))].slice(0, 10);
    localStorage.setItem('recentViewed', JSON.stringify(updated));
  }, [id, navigate]);

  const handleAddCart = async () => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    try {
      await addToCart(Number(id), quantity);
      setMsg('장바구니에 담겼습니다.');
      setTimeout(() => setMsg(''), 2000);
    } catch { setMsg('오류가 발생했습니다.'); }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    await addToCart(Number(id), quantity);
    navigate('/cart');
  };

  if (!product) return <div style={{ textAlign: 'center', padding: 80, color: '#ccc' }}>로딩 중...</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* 상단 네비 */}
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#aaa' }}>
        <Link to="/" style={{ color: P, fontWeight: 700, fontSize: 18 }}>SHOPLAB</Link>
        <span>›</span><Link to="/" style={{ color: '#aaa' }}>홈</Link>
        <span>›</span><span style={{ color: '#333' }}>{product.name}</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: 48 }}>
        {/* 이미지 */}
        <div>
          <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: '#f5f5f5', borderRadius: 12, overflow: 'hidden' }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, color: '#ddd' }}>🛍️</div>
            )}
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>{product.category}</div>
          {/* [VULN] XSS - name dangerouslySetInnerHTML */}
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}
            dangerouslySetInnerHTML={{ __html: product.name }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 }}>
            {product.price.toLocaleString()}<span style={{ fontSize: 16, fontWeight: 400 }}>원</span>
          </div>

          <div style={{ background: '#fafafa', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#666' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span>배송</span><span>무료배송</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>재고</span>
              <span style={{ color: product.stock > 0 ? '#333' : P }}>{product.stock > 0 ? `${product.stock}개` : '품절'}</span>
            </div>
          </div>

          {/* 수량 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: '#555', width: 60 }}>수량</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 8 }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: 36, height: 36, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#555' }}>−</button>
              <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ width: 36, height: 36, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#555' }}>+</button>
            </div>
          </div>

          <div style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
            합계 <strong style={{ fontSize: 18, color: '#1a1a1a' }}>{(product.price * quantity).toLocaleString()}원</strong>
          </div>

          {msg && <div style={{ background: '#fff5f7', color: P, padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleAddCart} disabled={product.stock === 0}
              style={{ flex: 1, height: 52, border: `2px solid ${P}`, background: '#fff', color: P, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              장바구니
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              style={{ flex: 1, height: 52, border: 'none', background: product.stock === 0 ? '#ddd' : P, color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              바로구매
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: 24 }}>
          {(['detail', 'review', 'qna'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '12px 24px', fontSize: 14, fontWeight: tab === t ? 700 : 400, color: tab === t ? P : '#aaa', background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${P}` : '2px solid transparent', marginBottom: -2, cursor: 'pointer' }}>
              {t === 'detail' ? '상품설명' : t === 'review' ? '리뷰' : 'Q&A'}
            </button>
          ))}
        </div>
        {tab === 'detail' && (
          <div style={{ minHeight: 200, paddingBottom: 60 }}>
            {/* [VULN] XSS - description HTML 렌더링 */}
            <div dangerouslySetInnerHTML={{ __html: product.description || '상품 설명이 없습니다.' }}
              style={{ fontSize: 14, color: '#444', lineHeight: 1.8 }} />
          </div>
        )}
        {tab === 'review' && (
          <div style={{ minHeight: 200, paddingBottom: 60, textAlign: 'center', color: '#ccc', paddingTop: 60 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
            <div>아직 리뷰가 없습니다</div>
          </div>
        )}
        {tab === 'qna' && (
          <div style={{ minHeight: 200, paddingBottom: 60, textAlign: 'center', color: '#ccc', paddingTop: 60 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>❓</div>
            <div>아직 문의가 없습니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
