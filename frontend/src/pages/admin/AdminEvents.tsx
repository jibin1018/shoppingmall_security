import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getEvents } from '../../api/event';
import { createEvent, deleteEvent } from '../../api/admin';
import { Event } from '../../types';

const P = '#FF3D78';
const EMPTY = { title: '', description: '', imageUrl: '', discountRate: 0, startDate: '', endDate: '', active: true };

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Partial<Event>>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = () => getEvents().then(r => setEvents(r.data));
  useEffect(() => { load(); }, []);

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: k === 'discountRate' ? Number(e.target.value) : e.target.value }));

  const handleSave = async () => {
    if (!form.title) { alert('이벤트 제목은 필수입니다.'); return; }
    // [VULN] description에 XSS 페이로드 저장 가능
    await createEvent({ ...form, active: true });
    setForm(EMPTY); setShowForm(false); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await deleteEvent(id); load();
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>이벤트 관리</h2>
          <button onClick={() => setShowForm(s => !s)}
            style={{ padding: '8px 20px', background: P, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + 이벤트 등록
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[['title', '이벤트 제목'], ['discountRate', '할인율(%)'], ['startDate', '시작일 (YYYY-MM-DD)'], ['endDate', '종료일 (YYYY-MM-DD)'], ['imageUrl', '이미지 URL']].map(([k, label]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input value={String((form as Record<string, unknown>)[k] ?? '')} onChange={setF(k)}
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>설명 (HTML 허용)</label>
              <textarea value={form.description ?? ''} onChange={setF('description')} rows={4}
                style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} style={{ padding: '8px 24px', background: P, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>저장</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 24px', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>취소</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{ev.startDate} ~ {ev.endDate} · 할인율 {ev.discountRate}%</div>
              </div>
              <button onClick={() => handleDelete(ev.id)} style={{ padding: '6px 16px', border: '1px solid #eee', borderRadius: 8, color: '#e63060', background: '#fff', fontSize: 12, cursor: 'pointer' }}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
