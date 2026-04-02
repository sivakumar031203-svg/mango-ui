import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentPage from './pages/PaymentPage'
import OrderTrack from './pages/OrderTrack'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMangoes from './pages/admin/AdminMangoes'
import AdminOrders from './pages/admin/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'
import { useState, useEffect } from 'react'
import Contact from './pages/Contact'

export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (mango, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === mango.id)
      if (existing) return prev.map(i => i.id === mango.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...mango, qty }]
    })
  }

  const updateCart = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id))
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} updateCart={updateCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/payment/:orderNumber" element={<PaymentPage />} />
        <Route path="/track" element={<OrderTrack />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/mangoes" element={<ProtectedRoute><AdminMangoes /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      </Routes>
    </>
  )
}