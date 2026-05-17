import { Link, useLocation, useNavigate } from 'react-router-dom';

const P = '#FF3D78';
const MENU = [
  { path: '/seller', label: '대시보드', icon: '📊' },
  { path: '/seller/products', label: '상품 관리', icon: '🛍️' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // [VULN] 클라이언트 사이드 역할 확인만 존재
  // localStorage.setItem('role','SELLER') 으로 UI 우회 가능
  const role = localStorage.getItem('role');
  if (!localStorage.getItem('token') || role !== 'SELLER') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🏪</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>판매자 전용 페이지</div>
        <div style={{ fontSize: 13, color: '#aaa' }}>접근 권한이 없습니다</div>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: P, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>홈으로</button>
      </div>
    );
  }

  const brandName = localStorage.getItem('username') || '판매자';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 사이드바 */}
      <div style={{ width: 220, background: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: P, letterSpacing: -0.5 }}>SHOPLAB</Link>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>판매자 센터</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 600 }}>{brandName}</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {MENU.map(({ path, label, icon }) => {
            const active = pathname === path;
            return (
              <Link key={path} to={path}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', fontSize: 13, color: active ? '#fff' : 'rgba(255,255,255,0.55)', background: active ? 'rgba(255,61,120,0.15)' : 'transparent', borderLeft: active ? `3px solid ${P}` : '3px solid transparent', textDecoration: 'none', transition: 'all .15s' }}>
                <span>{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ width: '100%', padding: '8px 0', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
            로그아웃
          </button>
        </div>
      </div>
      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}
