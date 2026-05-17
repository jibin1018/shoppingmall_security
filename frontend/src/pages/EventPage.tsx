import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../api/event';
import { Event } from '../types';

const P = '#FF3D78';
const BG_COLORS = ['linear-gradient(135deg,#FF3D78,#FF8C42)', 'linear-gradient(135deg,#6C63FF,#3BC9DB)', 'linear-gradient(135deg,#1a1a2e,#16213E)', 'linear-gradient(135deg,#f7971e,#ffd200)'];

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 20px', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ color: P, fontWeight: 700, fontSize: 18 }}>SHOPLAB</Link>
        <span style={{ color: '#aaa' }}>›</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>이벤트</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>진행 중인 이벤트</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#ccc' }}>로딩 중...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#ccc' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <div>진행 중인 이벤트가 없습니다</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map((ev, i) => (
              <div key={ev.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex' }}>
                <div style={{ width: 200, background: BG_COLORS[i % BG_COLORS.length], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, flexShrink: 0 }}>
                  {ev.discountRate && (
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{ev.discountRate}%</div>
                  )}
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>SALE</div>
                </div>
                <div style={{ padding: '24px 28px', flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{ev.startDate} ~ {ev.endDate}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{ev.title}</h3>
                  {/* [VULN] XSS - description HTML 렌더링 */}
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: ev.description || '' }} />
                  <Link to="/" style={{ display: 'inline-block', marginTop: 16, padding: '8px 20px', background: P, color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    이벤트 상품 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
