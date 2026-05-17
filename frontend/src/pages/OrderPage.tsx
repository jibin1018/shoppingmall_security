import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/order';
import { CartItem, Product } from '../types';

const P = '#FF3D78';
const PAYMENT_METHODS = ['신용카드', '카카오페이', '네이버페이', '무통장입금'];

interface LocationState { items: (CartItem & { product?: Product })[]; total: number; }

export default function OrderPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };
  const [address, setAddress] = useState(localStorage.getItem('address') || '');
  const [payment, setPayment] = useState('신용카드');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  if (!state?.items?.length) {
    navigate('/cart');
    return null;
  }

  const { items, total } = state;

  const handleOrder = async () => {
    if (!address.trim()) { alert('배송지를 입력해주세요.'); return; }
    setLoading(true);
    try {
      // [VULN] 클라이언트 계산 금액(total)을 그대로 서버로 전송 - 가격 변조 가능
      const res = await createOrder({
        items: items.map(i => ({
          productId: i.productId,
          productName: i.product?.name ?? '',
          price: i.product?.price ?? 0,   // [VULN] 클라이언트 가격 전송
          quantity: i.quantity,
        })),
        totalPrice: total,   // [VULN] 클라이언트 합계 전송
        deliveryAddress: address,
        paymentMethod: payment,
      });
      navigate('/order/complete', { state: { order: res.data } });
    } catch { alert('주문 처리 중 오류가 발생했습니다.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 20px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ color: P, fontWeight: 700, fontSize: 18 }}>SHOPLAB</Link>
        <span style={{ color: '#aaa' }}>›</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>주문/결제</span>
      </div>

      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
        <div>
          {/* 주문 상품 */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>주문 상품</div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f8f8f8' }}>
                <div style={{ width: 56, height: 56, background: '#f5f5f5', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                  {item.product?.imageUrl && <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, marginBottom: 2 }}>{item.product?.name ?? `상품 #${item.productId}`}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{item.quantity}개 · {((item.product?.price ?? 0) * item.quantity).toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>

          {/* 배송지 */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>배송지</div>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="배송받을 주소를 입력하세요"
              onFocus={() => setFocused('addr')} onBlur={() => setFocused('')}
              style={{ width: '100%', height: 46, padding: '0 14px', border: `1.5px solid ${focused === 'addr' ? P : '#eee'}`, borderRadius: 10, fontSize: 14, outline: 'none', background: '#fafafa' }} />
          </div>

          {/* 결제 수단 */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>결제 수단</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m} onClick={() => setPayment(m)}
                  style={{ padding: '12px 0', border: `2px solid ${payment === m ? P : '#eee'}`, borderRadius: 10, background: payment === m ? '#fff5f7' : '#fff', color: payment === m ? P : '#555', fontWeight: payment === m ? 700 : 400, fontSize: 13, cursor: 'pointer' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결제 요약 */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>결제 금액</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
            <span>상품금액</span><span>{total.toLocaleString()}원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 16 }}>
            <span>배송비</span><span>무료</span>
          </div>
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
            <span>합계</span><span style={{ color: P }}>{total.toLocaleString()}원</span>
          </div>
          <button onClick={handleOrder} disabled={loading}
            style={{ width: '100%', height: 48, background: loading ? '#ffb3cc' : P, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '처리 중...' : `${total.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}
