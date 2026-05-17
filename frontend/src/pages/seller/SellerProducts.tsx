import { useEffect, useState } from 'react';
import SellerLayout from './SellerLayout';
import { getSellerProducts, createSellerProduct, updateSellerProduct, deleteSellerProduct } from '../../api/seller';
import { Product } from '../../types';

const P = '#FF3D78';
const EMPTY = { name: '', description: '', price: 0, imageUrl: '', stock: 0, category: '' };

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getSellerProducts().then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: k === 'price' || k === 'stock' ? Number(e.target.value) : e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.price) { alert('상품명과 가격은 필수입니다.'); return; }
    if (editing !== null) {
      // [VULN] IDOR: editing에 다른 판매자 상품 ID를 넣으면 수정 가능
      await updateSellerProduct(editing, form);
    } else {
      // [VULN] description에 XSS 페이로드 삽입 가능
      await createSellerProduct(form);
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = (p: Product) => { setForm(p); setEditing(p.id); setShowForm(true); };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    // [VULN] IDOR: 다른 판매자의 상품 ID로도 삭제 가능
    await deleteSellerProduct(id); load();
  };

  const inputStyle = (h = 40): React.CSSProperties => ({
    width: '100%', height: h, padding: '0 12px',
    border: '1.5px solid #eee', borderRadius: 8, fontSize: 13,
    outline: 'none', resize: 'vertical' as const,
  });

  return (
    <SellerLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>상품 관리</h2>
          <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(s => !s); }}
            style={{ padding: '8px 20px', background: P, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + 상품 등록
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{editing ? '상품 수정' : '새 상품 등록'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[['name', '상품명'], ['category', '카테고리'], ['price', '가격'], ['stock', '재고'], ['imageUrl', '이미지 URL']].map(([k, label]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input value={String((form as Record<string, unknown>)[k] ?? '')} onChange={setF(k)} style={inputStyle()} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>상품 설명 (HTML 허용)</label>
              {/* [VULN] HTML 미필터링 - Stored XSS */}
              <textarea value={form.description ?? ''} onChange={setF('description')} rows={4} style={{ ...inputStyle(80), paddingTop: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave}
                style={{ padding: '8px 24px', background: P, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                저장
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ padding: '8px 24px', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                취소
              </button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['ID', '상품명', '카테고리', '가격', '재고', '관리'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: '#ccc', fontSize: 14 }}>
                    등록된 상품이 없습니다. 상품을 등록해보세요.
                  </td>
                </tr>
              )}
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                  <td style={{ padding: '12px 16px', color: '#aaa' }}>#{p.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{p.category}</td>
                  <td style={{ padding: '12px 16px' }}>{p.price?.toLocaleString()}원</td>
                  <td style={{ padding: '12px 16px' }}>{p.stock}개</td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(p)} style={{ padding: '4px 12px', border: `1px solid ${P}`, borderRadius: 6, color: P, background: '#fff', fontSize: 12, cursor: 'pointer' }}>수정</button>
                    <button onClick={() => handleDelete(p.id)} style={{ padding: '4px 12px', border: '1px solid #eee', borderRadius: 6, color: '#e63060', background: '#fff', fontSize: 12, cursor: 'pointer' }}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
}
