import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const PRIMARY = '#FF3D78';

interface FormField { label: string; key: string; type?: string; placeholder: string; }

const FIELDS: FormField[] = [
  { label: '아이디', key: 'username', placeholder: '영문, 숫자 조합' },
  { label: '비밀번호', key: 'password', type: 'password', placeholder: '8자 이상 입력' },
  { label: '이메일', key: 'email', type: 'email', placeholder: 'example@email.com' },
  { label: '전화번호', key: 'phone', placeholder: '010-0000-0000' },
  { label: '주소', key: 'address', placeholder: '주소를 입력해주세요' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleRegister = async () => {
    setError('');
    if (!form.username || !form.password || !form.email) { setError('필수 항목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>가입 완료!</div>
        <div style={{ fontSize: 14, color: '#999' }}>로그인 페이지로 이동합니다...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: 20 }}>
      <Link to="/" style={{ fontSize: 28, fontWeight: 700, color: PRIMARY, letterSpacing: -1, marginBottom: 36 }}>SHOPLAB</Link>

      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>회원가입</h2>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 28 }}>정보를 입력하고 쇼핑을 시작하세요</p>

        {error && (
          <div style={{ background: '#fff5f7', border: '1px solid #ffe0e8', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e63060', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {FIELDS.map(({ label, key, type = 'text', placeholder }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
              {label} {['username', 'password', 'email'].includes(key) && <span style={{ color: PRIMARY }}>*</span>}
            </label>
            <input
              type={type}
              value={(form as Record<string, string>)[key]}
              onChange={set(key)}
              placeholder={placeholder}
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused('')}
              style={{ width: '100%', height: 46, padding: '0 14px', border: `1.5px solid ${focused === key ? PRIMARY : '#eee'}`, borderRadius: 10, fontSize: 14, outline: 'none', background: '#fafafa', transition: 'border-color .2s' }}
            />
          </div>
        ))}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width: '100%', height: 48, background: loading ? '#ffb3cc' : PRIMARY, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, marginTop: 10 }}
        >
          {loading ? '처리 중...' : '가입하기'}
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#aaa' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: PRIMARY, fontWeight: 600 }}>로그인</Link>
        </div>
      </div>
    </div>
  );
}
