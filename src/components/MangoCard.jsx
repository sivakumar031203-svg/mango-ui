import { ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MangoCard({ mango, addToCart }) {
  const handleAdd = () => {
    addToCart(mango)
    toast.success(`${mango.name} added to cart! 🥭`)
  }

  return (
    <div className="card" style={{ overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 200, background: '#fef3c7', position: 'relative', overflow: 'hidden' }}>
        {mango.imageUrl ? (
          <img src={mango.imageUrl} alt={mango.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 72 }}>🥭</div>
        )}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: '#f59e0b', color: 'white', padding: '3px 10px',
          borderRadius: 20, fontSize: 11, fontWeight: 700
        }}>{mango.category}</span>
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 18, marginBottom: 4 }}>{mango.name}</h3>
        {mango.origin && <p style={{ color: '#78716c', fontSize: 12, marginBottom: 6 }}>📍 {mango.origin}</p>}
        <p style={{ color: '#78716c', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
          {mango.description?.substring(0, 80)}{mango.description?.length > 80 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, color: '#166534' }}>
              ₹{mango.price}
            </span>
            <span style={{ color: '#78716c', fontSize: 12 }}>/{mango.unit}</span>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}>
            <ShoppingCart size={16} /> Add
          </button>
        </div>
        {mango.stock <= 5 && mango.stock > 0 && (
          <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8, fontWeight: 600 }}>
            ⚠ Only {mango.stock} left!
          </p>
        )}
      </div>
    </div>
  )
}