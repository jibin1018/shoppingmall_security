import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

const PRIMARY = '#FF3D78';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await login(username, password);
      const { token, userId, username: uname, role } = res.data;
      // [VULN] JWT localStorage 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('username', uname);
      localStorage.setItem('role', role);
      navigate('/');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || '아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: 20 }}>
      {/* 로고 */}
      <Link to="/" style={{ fontSize: 28, fontWeight: 700, color: PRIMARY, letterSpacing: -1, marginBottom: 36 }}>SHOPLAB</Link>

      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>로그인</h2>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 28 }}>SHOPLAB에 오신 것을 환영해요</p>

        {error && (
          <div style={{ background: '#fff5f7', border: '1px solid #ffe0e8', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e63060', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>아이디</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="아이디 입력"
            style={{ width: '100%', height: 46, padding: '0 14px', border: '1.5px solid #eee', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color .2s', background: '#fafafa' }}
            onFocus={e => (e.target.style.borderColor = PRIMARY)}
            onBlur={e => (e.target.style.borderColor = '#eee')}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', height: 46, padding: '0 14px', border: '1.5px solid #eee', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color .2s', background: '#fafafa' }}
            onFocus={e => (e.target.style.borderColor = PRIMARY)}
            onBlur={e => (e.target.style.borderColor = '#eee')}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', height: 48, background: loading ? '#ffb3cc' : PRIMARY, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, transition: 'background .2s' }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#aaa' }}>
          아직 계정이 없으신가요?{' '}
          <Link to="/register" style={{ color: PRIMARY, fontWeight: 600 }}>회원가입</Link>
        </div>
      </div>
    </div>
  );
}
