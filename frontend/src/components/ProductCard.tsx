import { Product } from '../types';

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  img: { width: '100%', height: 180, objectFit: 'cover', background: '#eee' },
  body: { padding: 16 },
  name: { fontWeight: 600, fontSize: 15, marginBottom: 6 },
  desc: { fontSize: 13, color: '#666', marginBottom: 8 },
  price: { color: '#e94560', fontWeight: 700, fontSize: 16 },
  badge: {
    display: 'inline-block', background: '#f0f0f0',
    padding: '2px 8px', borderRadius: 10, fontSize: 11, color: '#888', marginBottom: 6,
  },
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div style={styles.card}>
      <img src={product.imageUrl} alt={product.name} style={styles.img} />
      <div style={styles.body}>
        <span style={styles.badge}>{product.category}</span>
        <div style={styles.name}>{product.name}</div>
        {/* [VULN] XSS - 서버에서 받은 HTML을 그대로 렌더링 */}
        <div
          style={styles.desc}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        <div style={styles.price}>{product.price.toLocaleString()}원</div>
      </div>
    </div>
  );
}
