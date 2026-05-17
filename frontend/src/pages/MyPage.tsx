import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMypage, updateMypage } from '../api/mypage';
import { User } from '../types';

const PRIMARY = '#FF3D78';

const MENU_ITEMS = ['주문내역', '찜 목록', '최근 본 상품', '쿠폰함', '포인트', '리뷰 관리'];

export default function MyPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    getMypage(Number(userId))
      .then(res => { setUser(res.data); setPhone(res.data.phone || ''); setAddress(res.data.address || ''); })
      .catch(() => { setMsg('사용자를 찾을 수 없습니다.'); });
  }, [userId, navigate]);

  const handleUpdate = async () => {
    try {
      const res = await updateMypage(Number(userId), { phone, address });
      setUser(res.data);
      setMsg('정보가 수정되었습니다.');
      setEditing(false);
    } catch { setMsg('수정 중 오류가 발생했습니다.'); }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 36 }}>👤</div>
        <div>{msg || '로딩 중...'}</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: PRIMARY, letterSpacing: -1 }}>SHOPLAB</Link>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>마이페이지</span>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* 사이드바 */}
        <div>
          {/* 프로필 카드 */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C42)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 12 }}>
              👤
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{user.username}</div>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#fafafa', borderRadius: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>0</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>주문</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#fafafa', borderRadius: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>0</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>찜</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#fafafa', borderRadius: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>0P</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>포인트</div>
              </div>
            </div>
          </div>

          {/* 메뉴 */}
          <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {MENU_ITEMS.map((item, i) => (
              <div key={item} style={{ padding: '13px 18px', fontSize: 13, color: '#444', borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid #f8f8f8' : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                {item} <span style={{ color: '#ddd', fontSize: 12 }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 1px 8px rgba(0,0,0,0.05)', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>내 정보</h3>
              <button
                onClick={() => setEditing(e => !e)}
                style={{ padding: '6px 14px', border: `1px solid ${PRIMARY}`, borderRadius: 16, fontSize: 12, color: PRIMARY, background: '#fff', fontWeight: 600 }}
              >
                {editing ? '취소' : '수정'}
              </button>
            </div>

            {/* 정보 행 */}
            {[
              { label: '아이디', value: user.username },
              { label: '이메일', value: user.email },
              { label: '등급', value: user.role === 'ADMIN' ? '🔑 관리자' : '🛍️ 일반회원' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #f8f8f8', alignItems: 'center' }}>
                <span style={{ width: 100, fontSize: 13, color: '#999', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
              </div>
            ))}

            {/* 수정 가능 항목 */}
            <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #f8f8f8', alignItems: 'center' }}>
              <span style={{ width: 100, fontSize: 13, color: '#999', flexShrink: 0 }}>전화번호</span>
              {editing ? (
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000"
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  style={{ flex: 1, height: 36, padding: '0 12px', border: `1.5px solid ${focused === 'phone' ? PRIMARY : '#eee'}`, borderRadius: 8, fontSize: 13, outline: 'none' }} />
              ) : (
                <span style={{ fontSize: 13, fontWeight: 500 }}>{phone || '—'}</span>
              )}
            </div>

            <div style={{ display: 'flex', padding: '12px 0', alignItems: 'center' }}>
              <span style={{ width: 100, fontSize: 13, color: '#999', flexShrink: 0 }}>주소</span>
              {editing ? (
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="주소를 입력해주세요"
                  onFocus={() => setFocused('address')} onBlur={() => setFocused('')}
                  style={{ flex: 1, height: 36, padding: '0 12px', border: `1.5px solid ${focused === 'address' ? PRIMARY : '#eee'}`, borderRadius: 8, fontSize: 13, outline: 'none' }} />
              ) : (
                <span style={{ fontSize: 13, fontWeight: 500 }}>{address || '—'}</span>
              )}
            </div>

            {editing && (
              <button onClick={handleUpdate}
                style={{ marginTop: 16, width: '100%', height: 44, background: PRIMARY, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
                저장하기
              </button>
            )}

            {msg && <p style={{ marginTop: 12, fontSize: 13, color: PRIMARY, textAlign: 'center' }}>{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
