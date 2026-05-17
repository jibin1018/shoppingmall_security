import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getUsers, updateRole } from '../../api/admin';
import { User } from '../../types';

const P = '#FF3D78';

export default function AdminMembers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandNameInputs, setBrandNameInputs] = useState<Record<number, string>>({});

  const load = () => getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleRoleChange = async (u: User, role: string) => {
    if (role === 'SELLER') {
      const brandName = brandNameInputs[u.id] ?? u.brandName ?? '';
      if (!brandName.trim()) {
        alert('SELLER 권한 부여 시 브랜드명을 입력해주세요.');
        return;
      }
      await updateRole(u.id, role, brandName);
    } else {
      await updateRole(u.id, role);
    }
    load();
  };

  const roleColor = (role: string) => {
    if (role === 'ADMIN') return { bg: '#fff0f3', color: P };
    if (role === 'SELLER') return { bg: '#f0f4ff', color: '#4a6cf7' };
    return { bg: '#f0f0f0', color: '#666' };
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>회원 관리</h2>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>로딩 중...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['ID', '아이디', '이메일', '비밀번호(평문)', '역할', '브랜드명', '권한 변경'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const rc = roleColor(u.role);
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '12px 16px', color: '#aaa' }}>#{u.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.username}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>{u.email}</td>
                      {/* [VULN] 비밀번호 평문 노출 */}
                      <td style={{ padding: '12px 16px', color: P, fontFamily: 'monospace', fontSize: 12 }}>{u.password}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.color }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: 12 }}>{u.brandName || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <select
                            value={u.role}
                            onChange={e => {
                              const newRole = e.target.value;
                              if (newRole !== 'SELLER') handleRoleChange(u, newRole);
                              else setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
                            }}
                            style={{ padding: '4px 8px', border: '1px solid #eee', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                          >
                            <option value="USER">USER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          {u.role === 'SELLER' && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <input
                                placeholder="브랜드명"
                                value={brandNameInputs[u.id] ?? u.brandName ?? ''}
                                onChange={e => setBrandNameInputs(prev => ({ ...prev, [u.id]: e.target.value }))}
                                style={{ flex: 1, padding: '4px 8px', border: '1px solid #eee', borderRadius: 6, fontSize: 12 }}
                              />
                              <button
                                onClick={() => handleRoleChange(u, 'SELLER')}
                                style={{ padding: '4px 10px', background: '#4a6cf7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
                              >
                                저장
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
