import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, updateQuantity, deleteCartItem } from '../api/cart';
import { getProduct } from '../api/product';
import { CartItem, Product } from '../types';

const P = '#FF3D78';

interface CartItemWithProduct extends CartItem { product?: Product; }

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    loadCart();
  }, [navigate]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      const withProducts = await Promise.all(
        res.data.map(async item => {
          try { const p = await getProduct(item.productId); return { ...item, product: p.data }; }
          catch { return item; }
        })
      );
      setItems(withProducts);
      setChecked(new Set(withProducts.map(i => i.id)));
    } finally { setLoading(false); }
  };

  const handleQuantity = async (itemId: number, qty: number) => {
    if (qty < 1) return;
    await updateQuantity(itemId, qty);
    setItems(items.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  const handleDelete = async (itemId: number) => {
    await deleteCartItem(itemId);
    setItems(items.filter(i => i.id !== itemId));
    setChecked(s => { const n = new Set(s); n.delete(itemId); return n; });
  };

  const toggleCheck = (id: number) => {
    setChecked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const checkedItems = items.filter(i => checked.has(i.id));
  const total = checkedItems.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);

  const handleOrder = () => {
    if (checkedItems.length === 0) return;
    // [VULN] 클라이언트에서 계산한 금액을 그대로 주문 페이지로 전달
    navigate('/order', { state: { items: checkedItems, total } });
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 20px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ color: P, fontWeight: 700, fontSize: 18 }}>SHOPLAB</Link>
        <span style={{ color: '#aaa' }}>›</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>장바구니</span>
      </div>

      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
              <input type="checkbox" checked={checked.size === items.length && items.length > 0}
                onChange={e => setChecked(e.target.checked ? new Set(items.map(i => i.id)) : new Set())}
                style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: '#555' }}>전체선택 ({checked.size}/{items.length})</span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#ccc' }}>로딩 중...</div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
                <div style={{ fontSize: 14 }}>장바구니가 비어있습니다</div>
                <Link to="/" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: P, color: '#fff', borderRadius: 8, fontSize: 13 }}>쇼핑 계속하기</Link>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f8f8f8' }}>
                  <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggleCheck(item.id)} style={{ width: 16, height: 16 }} />
                  <div style={{ width: 72, height: 72, background: '#f5f5f5', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    {item.product?.imageUrl && <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.product?.name ?? `상품 #${item.productId}`}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{((item.product?.price ?? 0) * item.quantity).toLocaleString()}원</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 6 }}>
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ width: 32, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 18, cursor: 'pointer' }}>×</button>
                </div>
              ))
            )}
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
          <button onClick={handleOrder} disabled={checkedItems.length === 0}
            style={{ width: '100%', height: 48, background: checkedItems.length === 0 ? '#eee' : P, color: checkedItems.length === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: checkedItems.length === 0 ? 'default' : 'pointer' }}>
            주문하기 ({checkedItems.length}개)
          </button>
        </div>
      </div>
    </div>
  );
}
