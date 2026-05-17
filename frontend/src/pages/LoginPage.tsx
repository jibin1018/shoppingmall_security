import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', borderRadius: 8, padding: 40, width: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' },
  sub: { color: '#888', fontSize: 13, marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 16 },
  btn: { width: '100%', padding: 12, background: '#e94560', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#e94560', fontSize: 13, marginBottom: 12, background: '#fff0f3', padding: '8px 12px', borderRadius: 4 },
  link: { display: 'block', textAlign: 'center', marginTop: 16, color: '#666', fontSize: 13 },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await login(username, password);
      const { token, userId, username: uname, role } = res.data;

      // [VULN] JWT를 localStorage에 저장 (XSS로 탈취 가능)
      localStorage.setItem('token', token);
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('username', uname);
      localStorage.setItem('role', role);

      navigate('/');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || '로그인 실패');
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>로그인</h2>
        <p style={styles.sub}>계정에 로그인하세요</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>아이디</label>
        <input
          style={styles.input}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디 입력"
        />

        <label style={styles.label}>비밀번호</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button style={styles.btn} onClick={handleLogin}>로그인</button>

        <Link to="/register" style={styles.link}>계정이 없으신가요? 회원가입</Link>
      </div>
    </div>
  );
}
