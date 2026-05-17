import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';

const P = '#FF3D78';
const STATUS_LABEL: Record<string, string> = {
  PENDING: '결제 대기', PAID: '결제 완료', SHIPPED: '배송 중', DELIVERED: '배송 완료', CANCELLED: '취소됨',
};

export default function OrderCompletePage() {
  const { state } = useLocation() as { state: { order: Order } };
  const navigate = useNavigate();

  if (!state?.order) { navigate('/'); return null; }

  const { order } = state;

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 460, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>주문이 완료되었습니다!</h2>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 28 }}>주문번호: #{order.id}</p>

        <div style={{ background: '#fafafa', borderRadius: 10, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
          {[
            ['상태', STATUS_LABEL[order.status] ?? order.status],
            ['결제금액', `${order.totalPrice.toLocaleString()}원`],
            ['결제수단', order.paymentMethod],
            ['배송지', order.deliveryAddress],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: '#999' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/" style={{ flex: 1, height: 46, border: `1px solid ${P}`, borderRadius: 10, color: P, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            쇼핑 계속하기
          </Link>
          <Link to={`/mypage/${localStorage.getItem('userId')}`} style={{ flex: 1, height: 46, background: P, borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            주문내역 확인
          </Link>
        </div>
      </div>
    </div>
  );
}
