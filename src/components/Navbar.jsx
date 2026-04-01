import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar({ cartCount }) {
  const navigate = useNavigate()
  const isAdmin = !!localStorage.getItem('adminToken')

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e7e5e4',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="logo" style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b' }}>
          🥭 MangoMart
        </div>
      </Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/track" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#78716c', fontSize: 14, fontWeight: 500 }}>
          <Package size={18} /> Track Order
        </Link>
        {isAdmin ? (
          <>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#166534', fontSize: 14, fontWeight: 500 }}>
              <LayoutDashboard size={18} /> Admin
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/admin/login" style={{ textDecoration: 'none', color: '#78716c', fontSize: 14 }}>Admin</Link>
        )}
        <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} /> Cart
            {cartCount > 0 && (
              <span style={{
                background: 'white', color: '#f59e0b', borderRadius: '50%',
                width: 20, height: 20, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700
              }}>{cartCount}</span>
            )}
          </button>
        </Link>
      </div>
    </nav>
  )
}