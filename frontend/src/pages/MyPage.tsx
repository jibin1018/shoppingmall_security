import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMypage, updateMypage } from '../api/mypage';
import { User } from '../types';

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 600, margin: '40px auto', padding: '0 20px' },
  card: { background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#1a1a2e', borderBottom: '2px solid #e94560', paddingBottom: 12 },
  row: { display: 'flex', marginBottom: 14, alignItems: 'center' },
  rowLabel: { width: 100, fontWeight: 600, color: '#555', fontSize: 14 },
  rowValue: { flex: 1, color: '#222', fontSize: 14 },
  vuln: { background: '#fff0f3', border: '1px solid #e94560', borderRadius: 4, padding: '8px 12px', marginBottom: 20, fontSize: 12, color: '#c62828' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 },
  btn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 },
  idorHint: { background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 4, padding: '10px 12px', marginBottom: 20, fontSize: 12, color: '#1565c0' },
};

export default function MyPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');

  const myUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }

    getMypage(Number(userId))
      .then(res => {
        setUser(res.data);
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
      })
      .catch(() => setMsg('사용자를 찾을 수 없습니다.'));
  }, [userId, navigate]);

  const handleUpdate = async () => {
    try {
      const res = await updateMypage(Number(userId), { phone, address });
      setUser(res.data);
      setMsg('정보가 수정되었습니다.');
    } catch {
      setMsg('수정 중 오류가 발생했습니다.');
    }
  };

  if (!user) return <div style={{ textAlign: 'center', padding: 60 }}>로딩 중...</div>;

  const isOtherUser = myUserId !== String(userId);

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>마이페이지</h2>

        {/* IDOR 힌트 */}
        {isOtherUser && (
          <div style={styles.vuln}>
            ⚠️ IDOR 취약점: 현재 <strong>다른 사용자(ID: {userId})</strong>의 정보를 조회 중입니다!
            (내 ID: {myUserId})
          </div>
        )}
        <div style={styles.idorHint}>
          💡 URL의 userId를 변경해보세요: <code>/mypage/1</code>, <code>/mypage/2</code> ...
        </div>

        <div style={styles.row}>
          <span style={styles.rowLabel}>사용자 ID</span>
          <span style={styles.rowValue}>{user.id}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>아이디</span>
          <span style={styles.rowValue}>{user.username}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>이메일</span>
          <span style={styles.rowValue}>{user.email}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>역할</span>
          <span style={styles.rowValue}>{user.role}</span>
        </div>
        {/* [VULN] 서버가 비밀번호를 응답에 포함해서 화면에 그대로 표시 */}
        <div style={styles.row}>
          <span style={styles.rowLabel}>비밀번호</span>
          <span style={{ ...styles.rowValue, color: '#e94560', fontFamily: 'monospace' }}>
            {user.password} ← [VULN: 평문 비밀번호 노출]
          </span>
        </div>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ marginBottom: 12 }}>
          <label style={styles.rowLabel}>전화번호</label>
          <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={styles.rowLabel}>주소</label>
          <input style={styles.input} value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <button style={styles.btn} onClick={handleUpdate}>정보 수정</button>
        {msg && <p style={{ marginTop: 12, color: '#555', fontSize: 13 }}>{msg}</p>}
      </div>
    </div>
  );
}
