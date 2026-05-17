import { useState } from 'react';
import { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ cursor: 'pointer', background: '#fff' }}>
      {/* 이미지 영역 */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '133%', background: '#f5f5f5', borderRadius: 8, overflow: 'hidden' }}>
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: 6 }}>
            <span style={{ fontSize: 32 }}>🛍️</span>
            <span style={{ fontSize: 11 }}>{product.category}</span>
          </div>
        )}

        {/* 찜 버튼 */}
        <button
          onClick={e => { e.stopPropagation(); setBookmarked(b => !b); }}
          style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
        >
          {bookmarked ? '❤️' : '🤍'}
        </button>

        {/* 재고 없음 뱃지 */}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>품절</span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div style={{ padding: '8px 2px 0' }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 3, fontWeight: 500 }}>{product.category}</div>
        <div style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {/* [VULN] XSS - dangerouslySetInnerHTML */}
          <span dangerouslySetInnerHTML={{ __html: product.name }} />
        </div>
        {/* [VULN] XSS - description도 raw HTML 렌더링 */}
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: product.description }} />
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>
          {product.price.toLocaleString()}원
        </div>
      </div>
    </div>
  );
}
