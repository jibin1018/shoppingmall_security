import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import { Order } from '../../types';

const P = '#FF3D78';
const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_LABEL: Record<string, string> = {
  PENDING: '결제대기', PAID: '결제완료', SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6', DELIVERED: '#6b7280', CANCELLED: '#ef4444',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAdminOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    load();
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>주문 관리</h2>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>로딩 중...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#ccc' }}>주문이 없습니다</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['주문번호', '회원ID', '결제금액', '결제수단', '배송지', '상태', '주문일시', '관리'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                    <td style={{ padding: '12px 16px', color: '#aaa' }}>#{o.id}</td>
                    <td style={{ padding: '12px 16px' }}>#{o.userId}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.totalPrice?.toLocaleString()}원</td>
                    <td style={{ padding: '12px 16px', color: '#666' }}>{o.paymentMethod}</td>
                    <td style={{ padding: '12px 16px', color: '#666', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.deliveryAddress}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: `${STATUS_COLOR[o.status]}20`, color: STATUS_COLOR[o.status] }}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#aaa', whiteSpace: 'nowrap', fontSize: 12 }}>
                      {new Date(o.createdAt).toLocaleString('ko-KR')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)}
                        style={{ padding: '4px 8px', border: '1px solid #eee', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
