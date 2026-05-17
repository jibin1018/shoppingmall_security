import { useEffect, useState } from 'react';
import SellerLayout from './SellerLayout';
import { getSellerStats } from '../../api/seller';

const P = '#FF3D78';

export default function SellerDashboard() {
  const [stats, setStats] = useState<{ productCount: number; totalStock: number } | null>(null);

  useEffect(() => {
    getSellerStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: '등록 상품', value: stats?.productCount ?? '-', unit: '개', color: P },
    { label: '총 재고', value: stats?.totalStock ?? '-', unit: '개', color: '#4a6cf7' },
  ];

  return (
    <SellerLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>판매자 대시보드</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
          {cards.map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: c.color }}>
                {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
                <span style={{ fontSize: 14, fontWeight: 400, color: '#aaa', marginLeft: 4 }}>{c.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>취약점 안내</div>
          <div style={{ fontSize: 13, color: '#888', lineHeight: 1.8 }}>
            <div>• <strong>Stored XSS</strong>: 상품 설명에 HTML/JS 페이로드를 삽입하면 상품 상세 페이지에서 실행됩니다.</div>
            <div>• <strong>IDOR</strong>: 상품 수정/삭제 시 다른 판매자의 상품 ID를 사용하면 접근이 가능합니다.</div>
            <div>• <strong>JWT alg:none</strong>: 헤더의 alg를 none으로 변조하면 SELLER 권한을 위조할 수 있습니다.</div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
