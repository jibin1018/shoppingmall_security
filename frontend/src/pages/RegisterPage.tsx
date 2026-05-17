import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 20 },
  card: { background: '#fff', borderRadius: 8, padding: 40, width: 420, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' },
  sub: { color: '#888', fontSize: 13, marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 16 },
  btn: { width: '100%', padding: 12, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#e94560', fontSize: 13, marginBottom: 12, background: '#fff0f3', padding: '8px 12px', borderRadius: 4 },
  success: { color: '#2e7d32', fontSize: 13, marginBottom: 12, background: '#f1f8e9', padding: '8px 12px', borderRadius: 4 },
  link: { display: 'block', textAlign: 'center', marginTop: 16, color: '#666', fontSize: 13 },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleRegister = async () => {
    setError(''); setSuccess('');
    try {
      await register(form);
      setSuccess('회원가입 완료! 로그인 페이지로 이동합니다.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || '회원가입 실패');
    }
  };

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={(form as Record<string, string>)[key]}
        onChange={set(key)}
        placeholder={placeholder}
      />
    </>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>
        <p style={styles.sub}>새 계정을 만드세요</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {field('아이디', 'username', 'text', '아이디 (영문/숫자)')}
        {field('비밀번호', 'password', 'password', '비밀번호')}
        {field('이메일', 'email', 'email', 'example@email.com')}
        {field('전화번호', 'phone', 'text', '010-0000-0000')}
        {field('주소', 'address', 'text', '주소 입력')}

        <button style={styles.btn} onClick={handleRegister}>가입하기</button>

        <Link to="/login" style={styles.link}>이미 계정이 있으신가요? 로그인</Link>
      </div>
    </div>
  );
}
