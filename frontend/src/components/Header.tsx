import { Link, useNavigate } from 'react-router-dom';

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  logo: { color: '#e94560', fontSize: 22, fontWeight: 700, textDecoration: 'none' },
  nav: { display: 'flex', gap: 20, alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: 14 },
  btn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 14,
  },
};

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>ShopMall 🛒</Link>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>홈</Link>
        {token ? (
          <>
            {/* [VULN] userId를 URL에 직접 노출 - IDOR 공격 진입점 */}
            <Link to={`/mypage/${userId}`} style={styles.link}>{username} 님</Link>
            <button style={styles.btn} onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>로그인</Link>
            <Link to="/register" style={styles.link}>
              <button style={styles.btn}>회원가입</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
