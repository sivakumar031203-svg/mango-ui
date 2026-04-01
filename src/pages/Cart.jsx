import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'

export default function Cart({ cart, updateCart }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <h2 style={{ marginTop: 16, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: '#78716c', marginBottom: 24 }}>Add some delicious mangoes!</p>
      <Link to="/"><button className="btn btn-primary">Browse Mangoes</button></Link>
    </div>
  )

  return (
    <div className="page">
      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .cart-summary {
          position: sticky;
          top: 80px;
        }
        .cart-item {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px 20px;
        }
        .cart-item-img {
          width: 72px;
          height: 72px;
          flex-shrink: 0;
        }
        .cart-item-name {
          font-family: 'Playfair Display';
          margin-bottom: 4px;
          font-size: 16px;
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            flex-wrap: wrap;
            gap: 12px;
            padding: 14px 16px;
          }
          .cart-item-img { width: 56px; height: 56px; }
          .cart-item-name { font-size: 14px; }
          .qty-controls { margin-left: auto; }
          .cart-item-price { margin-left: auto; }
        }
      `}</style>

      <h1 className="section-title">Your Cart 🛒</h1>
      <p className="section-sub">{cart.length} item(s) in cart</p>

      <div className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <div className="cart-item">
                <div className="cart-item-img" style={{ background: '#fef3c7', borderRadius: 12, overflow: 'hidden' }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36 }}>🥭</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p style={{ color: '#78716c', fontSize: 13 }}>₹{item.price}/{item.unit}</p>
                </div>
                <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateCart(item.id, item.qty - 1)}
                    style={{ width: 32, height: 32, border: '1px solid #e7e5e4', borderRadius: 8, cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateCart(item.id, item.qty + 1)}
                    style={{ width: 32, height: 32, border: '1px solid #e7e5e4', borderRadius: 8, cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="cart-item-price" style={{ minWidth: 72, textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#166534' }}>₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button onClick={() => updateCart(item.id, 0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 4 }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card cart-summary" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: 20, marginBottom: 20 }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#78716c' }}>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e7e5e4' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
            <span>Total</span>
            <span style={{ color: '#166534' }}>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/checkout', { state: { cart } })}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 }}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}