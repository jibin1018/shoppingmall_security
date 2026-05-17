import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getStats } from '../../api/admin';

const P = '#FF3D78';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: '총 회원수', value: `${stats.totalUsers}명`, icon: '👥', color: '#6C63FF' },
    { label: '총 상품수', value: `${stats.totalProducts}개`, icon: '🛍️', color: '#FF8C42' },
    { label: '총 주문수', value: `${stats.totalOrders}건`, icon: '📦', color: '#3BC9DB' },
    { label: '총 매출', value: `${stats.totalRevenue.toLocaleString()}원`, icon: '💰', color: P },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>대시보드</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>로딩 중...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {cards.map(({ label, value, icon, color }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>⚠️ 보안 취약점 안내</div>
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
            이 관리자 페이지는 다음 취약점을 포함합니다:<br />
            • 백엔드 API가 ADMIN role을 확인하지 않음 (유효한 토큰이면 누구나 접근 가능)<br />
            • 프론트엔드만 role 체크 (localStorage 조작으로 UI 우회 가능)<br />
            • 상품 등록 시 XSS 페이로드 저장 가능
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
