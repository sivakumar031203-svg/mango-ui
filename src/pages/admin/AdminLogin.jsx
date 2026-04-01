// ===================== AdminLogin.jsx =====================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      localStorage.setItem('adminToken', res.data.token)
      toast.success('Welcome back! 🥭')
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      padding: '16px',
    }}>
      <div className="card" style={{ padding: 'clamp(24px, 5vw, 40px)', width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56 }}>🥭</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(22px, 4vw, 28px)', marginTop: 12 }}>Admin Login</h1>
          <p style={{ color: '#78716c', marginTop: 6 }}>MangoMart Management</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Username</label>
            <input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="admin" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Password</label>
            <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: 14, marginTop: 8, fontSize: 16 }}>
            {loading ? 'Logging in...' : 'Login to Admin 🔐'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#78716c' }}>
          Default: admin / admin@mango2024
        </p>
      </div>
    </div>
  )
}