import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchProducts, getProducts } from '../api/product';
import { Product } from '../types';

const CATEGORIES = ['전체', '상의', '하의', '원피스', '아우터', '가방', '신발', '액세서리'];

const PRIMARY = '#FF3D78';

interface Props {
  onProductsChange: (products: Product[]) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function Header({ onProductsChange, activeCategory, onCategoryChange }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      getProducts().then(r => onProductsChange(r.data));
    } else {
      searchProducts(query).then(r => onProductsChange(r.data));
    }
  };

  const handleCategory = async (cat: string) => {
    onCategoryChange(cat);
    if (cat === '전체') {
      getProducts().then(r => onProductsChange(r.data));
    } else {
      const { getByCategory } = await import('../api/product');
      getByCategory(cat).then(r => onProductsChange(r.data));
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      {/* 상단 바 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* 로고 */}
        <Link to="/" style={{ fontSize: 22, fontWeight: 700, color: PRIMARY, letterSpacing: -1, flexShrink: 0 }}>
          SHOPLAB
        </Link>

        {/* 검색창 */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="브랜드, 상품 검색"
              style={{
                width: '100%', height: 38, padding: '0 40px 0 16px',
                border: '1.5px solid #f0f0f0', borderRadius: 20,
                background: '#fafafa', fontSize: 13, outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={e => (e.target.style.borderColor = PRIMARY)}
              onBlur={e => (e.target.style.borderColor = '#f0f0f0')}
            />
            <button type="submit" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', fontSize: 16 }}>
              🔍
            </button>
          </div>
        </form>

        {/* 우측 메뉴 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {token ? (
            <>
              <Link to={`/mypage/${userId}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', fontSize: 10, color: '#555', gap: 2 }}>
                <span style={{ fontSize: 20 }}>👤</span>
                <span>{username}</span>
              </Link>
              <button onClick={logout} style={{ padding: '6px 14px', border: '1px solid #eee', borderRadius: 16, fontSize: 12, color: '#555', background: '#fff' }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '6px 16px', border: '1px solid #eee', borderRadius: 16, fontSize: 13, color: '#555' }}>
                로그인
              </Link>
              <Link to="/register" style={{ padding: '6px 16px', borderRadius: 16, fontSize: 13, background: PRIMARY, color: '#fff', fontWeight: 500 }}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div style={{ borderTop: '1px solid #f5f5f5', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', gap: 0 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                padding: '10px 16px', fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                color: activeCategory === cat ? PRIMARY : '#555',
                background: 'none', border: 'none',
                borderBottom: activeCategory === cat ? `2px solid ${PRIMARY}` : '2px solid transparent',
                transition: 'all .15s', whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
