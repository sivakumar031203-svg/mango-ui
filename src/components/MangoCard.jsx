// MangoCard.jsx
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MangoCard({ mango, addToCart }) {
  const handleAdd = () => {
    addToCart(mango)
    toast.success(`${mango.name} added to cart! 🥭`)
  }

  return (
    <div
      className="card mango-card"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <style>{`
        .mango-card {
          transition: transform 0.2s;
        }
        .mango-card-image {
          height: 200px;
          background: #fef3c7;
          position: relative;
          overflow: hidden;
        }
        .mango-card-body {
          padding: 16px;
        }
        .mango-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 480px) {
          .mango-card-image { height: 160px; }
          .mango-card-body { padding: 12px; }
        }
      `}</style>

      {/* Image */}
      <div className="mango-card-image">
        {mango.imageUrl ? (
          <img
            src={mango.imageUrl}
            alt={mango.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 72 }}>
            🥭
          </div>
        )}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: '#f59e0b', color: 'white', padding: '3px 10px',
          borderRadius: 20, fontSize: 11, fontWeight: 700
        }}>
          {mango.category}
        </span>
      </div>

      {/* Body */}
      <div className="mango-card-body">
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 18, marginBottom: 4, marginTop: 0 }}>
          {mango.name}
        </h3>

        {mango.origin && (
          <p style={{ color: '#78716c', fontSize: 12, marginBottom: 6, marginTop: 0 }}>
            📍 {mango.origin}
          </p>
        )}

        <p style={{ color: '#78716c', fontSize: 13, marginBottom: 12, lineHeight: 1.5, marginTop: 0 }}>
          {mango.description?.substring(0, 80)}{mango.description?.length > 80 ? '...' : ''}
        </p>

        <div className="mango-card-footer">
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>
              ₹{mango.price}
            </span>
            <span style={{ color: '#78716c', fontSize: 12 }}>/{mango.unit}</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 14px' }}
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>

        {mango.stock <= 5 && mango.stock > 0 && (
          <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8, marginBottom: 0, fontWeight: 600 }}>
            ⚠ Only {mango.stock} left!
          </p>
        )}
      </div>
    </div>
  )
}