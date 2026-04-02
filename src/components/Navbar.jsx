import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, LogOut, LayoutDashboard, Menu, X, User, LogIn } from 'lucide-react'

export default function Navbar({ cartCount }) {
  const navigate = useNavigate()
  const isAdmin = !!localStorage.getItem('adminToken')
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <>
      <nav className="navbar">

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo" style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b' }}>🥭 MangoMart</div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">

          {!isAdmin &&
            <Link to="contact" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#78716c', fontSize: 14, fontWeight: 500 }}>
              <User size={18} /> Contact Owner
            </Link>
          }

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
                <span style={{ background: 'white', color: '#f59e0b', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{cartCount}</span>
              )}
            </button>
          </Link>
        </div>

        {/* Mobile right side */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="mobile-only" /* show only on mobile via CSS */>
          <Link to="/cart" style={{ textDecoration: 'none' }} className="nav-hamburger">
            <ShoppingCart size={18} color="#f59e0b" />
            {cartCount > 0 && <span style={{ background: '#f59e0b', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{cartCount}</span>}
          </Link>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}

      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>

        {!isAdmin &&
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none' }}
          >
            <User size={16} /> Contact Owner
          </Link>
        }

        <Link to="/track" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
          <Package size={16} /> Track Order
        </Link>

        {isAdmin ? (
          <>
            <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <LayoutDashboard size={16} /> Admin Dashboard
            </Link>
            <button onClick={() => { logout(); setMenuOpen(false) }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <LogIn size={16} />Admin Login
          </Link>
        )}
      </div>
    </>
  )
}