import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMypage, updateMypage } from '../api/mypage';
import { getMyOrders } from '../api/order';
import { getProduct } from '../api/product';
import { User, Order, Product } from '../types';

const P = '#FF3D78';
const TABS = ['주문내역', '찜목록', '최근본상품', '쿠폰함', '포인트', '리뷰관리'];
const STATUS_LABEL: Record<string, string> = {
  PENDING: '결제대기', PAID: '결제완료', SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6', DELIVERED: '#6b7280', CANCELLED: '#ef4444',
};

export default function MyPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState('');
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('주문내역');
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    getMypage(Number(userId)).then(r => {
      setUser(r.data); setPhone(r.data.phone || ''); setAddress(r.data.address || '');
    }).catch(() => setMsg('사용자를 찾을 수 없습니다.'));
  }, [userId, navigate]);

  useEffect(() => {
    if (activeTab === '주문내역') {
      getMyOrders().then(r => setOrders(r.data)).catch(() => {});
    }
    if (activeTab === '최근본상품') {
      const ids: number[] = JSON.parse(localStorage.getItem('recentViewed') || '[]');
      Promise.all(ids.slice(0, 6).map(id => getProduct(id).then(r => r.data).catch(() => null)))
        .then(ps => setRecentProducts(ps.filter(Boolean) as Product[]));
    }
  }, [activeTab]);

  const handleUpdate = async () => {
    try {
      const res = await updateMypage(Number(userId), { phone, address });
      setUser(res.data); setMsg('정보가 수정되었습니다.'); setEditing(false);
    } catch { setMsg('수정 중 오류가 발생했습니다.'); }
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 36 }}>👤</div><div>{msg || '로딩 중...'}</div>
    </div>
  );

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: P, letterSpacing: -1 }}>SHOPLAB</Link>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>마이페이지</span>
      </div>

      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
        {/* 사이드바 */}
        <div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${P}, #FF8C42)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>👤</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{user.username}</div>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['주문', orders.length], ['찜', 0], ['포인트', '0P']].map(([l, v]) => (
                <div key={String(l)} style={{ flex: 1, background: '#fafafa', borderRadius: 8, padding: '8px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#aaa' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {TABS.map((tab, i) => (
              <div key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '12px 18px', fontSize: 13, color: activeTab === tab ? P : '#444', fontWeight: activeTab === tab ? 700 : 400, borderBottom: i < TABS.length - 1 ? '1px solid #f8f8f8' : 'none', cursor: 'pointer', background: activeTab === tab ? '#fff5f7' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {tab} <span style={{ color: '#ddd', fontSize: 12 }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 */}
        <div>
          {/* 내 정보 */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>내 정보</span>
              <button onClick={() => setEditing(e => !e)}
                style={{ padding: '5px 14px', border: `1px solid ${P}`, borderRadius: 14, fontSize: 12, color: P, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                {editing ? '취소' : '수정'}
              </button>
            </div>
            {[['아이디', user.username], ['이메일', user.email], ['등급', user.role === 'ADMIN' ? '🔑 관리자' : '🛍️ 일반회원']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f8f8f8', fontSize: 13 }}>
                <span style={{ width: 90, color: '#999' }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f8f8f8', fontSize: 13, alignItems: 'center' }}>
              <span style={{ width: 90, color: '#999' }}>전화번호</span>
              {editing ? <input value={phone} onChange={e => setPhone(e.target.value)} onFocus={() => setFocused('p')} onBlur={() => setFocused('')}
                style={{ flex: 1, height: 34, padding: '0 10px', border: `1.5px solid ${focused === 'p' ? P : '#eee'}`, borderRadius: 6, fontSize: 13, outline: 'none' }} />
                : <span style={{ fontWeight: 500 }}>{phone || '—'}</span>}
            </div>
            <div style={{ display: 'flex', padding: '10px 0', fontSize: 13, alignItems: 'center' }}>
              <span style={{ width: 90, color: '#999' }}>주소</span>
              {editing ? <input value={address} onChange={e => setAddress(e.target.value)} onFocus={() => setFocused('a')} onBlur={() => setFocused('')}
                style={{ flex: 1, height: 34, padding: '0 10px', border: `1.5px solid ${focused === 'a' ? P : '#eee'}`, borderRadius: 6, fontSize: 13, outline: 'none' }} />
                : <span style={{ fontWeight: 500 }}>{address || '—'}</span>}
            </div>
            {editing && <button onClick={handleUpdate} style={{ marginTop: 14, width: '100%', height: 42, background: P, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>저장하기</button>}
            {msg && <p style={{ marginTop: 10, fontSize: 13, color: P, textAlign: 'center' }}>{msg}</p>}
          </div>

          {/* 탭 컨텐츠 */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{activeTab}</div>

            {activeTab === '주문내역' && (
              orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div><div>주문 내역이 없습니다</div>
                </div>
              ) : orders.map(o => (
                <div key={o.id} style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 16, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#aaa' }}>주문번호 #{o.id} · {new Date(o.createdAt).toLocaleDateString('ko-KR')}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[o.status] }}>{STATUS_LABEL[o.status] ?? o.status}</span>
                  </div>
                  {o.items.map(item => (
                    <div key={item.id} style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>
                      {item.productName} × {item.quantity} — {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: P }}>합계: {o.totalPrice?.toLocaleString()}원</div>
                </div>
              ))
            )}

            {activeTab === '찜목록' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>❤️</div><div>찜한 상품이 없습니다</div>
              </div>
            )}

            {activeTab === '최근본상품' && (
              recentProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👁️</div><div>최근 본 상품이 없습니다</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {recentProducts.map(p => (
                    <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ height: 100, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛍️</div>
                        <div style={{ padding: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: P, fontWeight: 700 }}>{p.price.toLocaleString()}원</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

            {activeTab === '쿠폰함' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎫</div><div>보유한 쿠폰이 없습니다</div>
              </div>
            )}

            {activeTab === '포인트' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                  <span style={{ color: '#555' }}>보유 포인트</span><span style={{ fontWeight: 700, color: P }}>0 P</span>
                </div>
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#ccc', fontSize: 13 }}>포인트 내역이 없습니다</div>
              </div>
            )}

            {activeTab === '리뷰관리' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div><div>작성한 리뷰가 없습니다</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
