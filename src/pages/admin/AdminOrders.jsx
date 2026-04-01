import { useState, useEffect } from 'react'
import { orderAPI } from '../../api'
import toast from 'react-hot-toast'
import {
  Search, ChevronUp, ChevronDown, CheckCircle,
  Phone, MapPin, FileText, Package,
  RefreshCw, ChevronsUpDown, X
} from 'lucide-react'

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_COLORS = {
  PENDING: { bg: '#fef3c7', text: '#92400e' },
  CONFIRMED: { bg: '#d1fae5', text: '#065f46' },
  PROCESSING: { bg: '#dbeafe', text: '#1e40af' },
  SHIPPED: { bg: '#ede9fe', text: '#5b21b6' },
  DELIVERED: { bg: '#dcfce7', text: '#166534' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
}
const PAYMENT_COLORS = {
  PENDING: { bg: '#fef3c7', text: '#92400e' },
  PAID: { bg: '#dcfce7', text: '#166534' },
  FAILED: { bg: '#fee2e2', text: '#991b1b' },
  REFUNDED: { bg: '#ede9fe', text: '#5b21b6' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await orderAPI.getAll({ status: statusFilter, search, sortBy, sortDir })
      setOrders(res.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [statusFilter, sortBy, sortDir])

  const handleSearch = (e) => { e.preventDefault(); load() }

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronsUpDown size={14} style={{ color: '#cbd5e1' }} />
    return sortDir === 'asc' ? <ChevronUp size={14} style={{ color: '#f59e0b' }} /> : <ChevronDown size={14} style={{ color: '#f59e0b' }} />
  }

  const markDelivered = async (id) => {
    if (!window.confirm('Mark this order as Delivered?')) return
    setUpdatingId(id)
    try {
      await orderAPI.markDelivered(id)
      toast.success('✅ Order marked as delivered!')
      load()
    } catch { toast.error('Failed to update') } finally { setUpdatingId(null) }
  }

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await orderAPI.updateStatus(id, { status })
      toast.success('Status updated!')
      load()
    } catch { toast.error('Failed') } finally { setUpdatingId(null) }
  }

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((s, o) => s + parseFloat(o.totalAmount), 0)

  return (
    <div className="page">
      <style>{`
        .orders-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .filter-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
        .search-form { display: flex; gap: 8px; flex: 1; min-width: 240px; }
        .status-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .sort-bar { display: flex; gap: 6px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
        .order-card-header { padding: 16px 20px; display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
        .order-meta-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; min-width: 0; }
        .order-meta-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .order-expanded { border-top: 1px solid #f5f5f4; padding: 20px; background: #fafaf9; }
        .expanded-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 20px; }

        @media (max-width: 768px) {
          .filter-row { flex-direction: column; }
          .search-form { min-width: 100%; }
          .status-pills { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
          .status-pills::-webkit-scrollbar { height: 3px; }
          .sort-bar { overflow-x: auto; flex-wrap: nowrap; }
          .order-card-header { gap: 10px; }
          .order-meta-right { width: 100%; }
          .order-meta-right select { flex: 1; }
          .expanded-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .expanded-grid { grid-template-columns: 1fr; }
          .order-meta-right { gap: 6px; }
        }
      `}</style>

      <div className="orders-header">
        <div>
          <h1 className="section-title">Orders 📦</h1>
          <p style={{ color: '#78716c' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''}
            {orders.length > 0 && statusFilter === '' && ` · ₹${totalRevenue.toLocaleString('en-IN')} revenue`}
          </p>
        </div>
        <button onClick={load} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      <div className="filter-row">
        <form onSubmit={handleSearch} className="search-form">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#78716c' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, order #..."
              style={{ paddingLeft: 38 }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setTimeout(load, 0) }}
              className="btn btn-outline" style={{ padding: '10px 12px' }}>
              <X size={16} />
            </button>
          )}
        </form>
        <div className="status-pills">
          {['', ...ALL_STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, flexShrink: 0,
                background: statusFilter === s ? '#f59e0b' : '#f5f5f4',
                color: statusFilter === s ? 'white' : '#78716c',
              }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="sort-bar">
        <span style={{ fontSize: 13, color: '#78716c', marginRight: 4, flexShrink: 0 }}>Sort:</span>
        {[
          { field: 'createdAt', label: 'Date' },
          { field: 'totalAmount', label: 'Amount' },
          { field: 'customerName', label: 'Name' },
          { field: 'status', label: 'Status' },
        ].map(s => (
          <button key={s.field} onClick={() => toggleSort(s.field)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
              padding: '6px 12px', borderRadius: 8, border: '1px solid #e7e5e4',
              background: sortBy === s.field ? '#fef3c7' : 'white',
              color: sortBy === s.field ? '#92400e' : '#78716c',
              fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
            {s.label} <SortIcon field={s.field} />
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#78716c' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 60 }}>📭</div>
          <p style={{ color: '#78716c', marginTop: 12 }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} className="card" style={{
              overflow: 'hidden',
              border: o.isNewNotification ? '2px solid #f59e0b' : '1px solid #e7e5e4',
              background: o.isNewNotification ? '#fffbf0' : 'white'
            }}>
              <div className="order-card-header">
                <div className="order-meta-left">
                  {o.isNewNotification && (
                    <span style={{ background: '#dc2626', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>NEW</span>
                  )}
                  <div>
                    <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: 15 }}>{o.orderNumber}</span>
                    <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 1, whiteSpace: 'nowrap' }}>
                      {new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{o.customerName}</p>
                    <p style={{ color: '#78716c', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} /> {o.customerPhone}
                    </p>
                  </div>
                  {o.city && (
                    <p style={{ color: '#78716c', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {o.city}{o.pincode ? ` - ${o.pincode}` : ''}
                    </p>
                  )}
                </div>

                <div className="order-meta-right">
                  <span style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 800, color: '#166534' }}>
                    ₹{parseFloat(o.totalAmount).toLocaleString('en-IN')}
                  </span>
                  <StatusBadge status={o.paymentStatus} map={PAYMENT_COLORS} />
                  <StatusBadge status={o.status} map={STATUS_COLORS} />

                  <select
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    disabled={updatingId === o.id}
                    style={{ border: '1px solid #e7e5e4', borderRadius: 8, padding: '6px 8px', fontSize: 12, background: 'white', cursor: 'pointer', fontFamily: 'DM Sans' }}>
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                    <button onClick={() => markDelivered(o.id)} disabled={updatingId === o.id}
                      style={{
                        background: '#166534', color: 'white', border: 'none', borderRadius: 10,
                        padding: '8px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans',
                        fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5,
                        whiteSpace: 'nowrap', opacity: updatingId === o.id ? 0.6 : 1
                      }}>
                      <CheckCircle size={14} />
                      {updatingId === o.id ? 'Updating...' : '✅ Delivered'}
                    </button>
                  )}
                  {o.status === 'DELIVERED' && o.deliveredAt && (
                    <span style={{ fontSize: 12, color: '#166534', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      ✅ {new Date(o.deliveredAt).toLocaleDateString('en-IN')}
                    </span>
                  )}

                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    style={{
                      background: 'none', border: '1px solid #e7e5e4', borderRadius: 8,
                      padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'DM Sans'
                    }}>
                    {expanded === o.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span style={{ display: 'none' }} className="details-text">{expanded === o.id ? 'Less' : 'Details'}</span>
                  </button>
                </div>
              </div>

              {expanded === o.id && (
                <div className="order-expanded">
                  <div className="expanded-grid">
                    <div>
                      <p style={sectionLabelStyle}><Phone size={13} /> CONTACT</p>
                      <p style={infoStyle}><strong>{o.customerName}</strong></p>
                      <p style={infoStyle}>📱 {o.customerPhone}</p>
                      {o.customerEmail && <p style={infoStyle}>✉️ {o.customerEmail}</p>}
                    </div>
                    <div>
                      <p style={sectionLabelStyle}><MapPin size={13} /> DELIVERY</p>
                      <p style={infoStyle}>{o.deliveryAddress}</p>
                      {o.landmark && <p style={{ ...infoStyle, color: '#78716c' }}>📍 {o.landmark}</p>}
                      <p style={infoStyle}>{[o.city, o.pincode].filter(Boolean).join(' - ')}</p>
                    </div>
                    <div>
                      <p style={sectionLabelStyle}>💳 PAYMENT</p>
                      <p style={infoStyle}>{o.paymentMethod?.replace('_', ' ')}</p>
                      <StatusBadge status={o.paymentStatus} map={PAYMENT_COLORS} />
                      {o.upiTransactionId && (
                        <p style={{ ...infoStyle, fontFamily: 'monospace', fontSize: 11, marginTop: 6, color: '#78716c' }}>Txn: {o.upiTransactionId}</p>
                      )}
                    </div>
                    {o.orderNotes && (
                      <div>
                        <p style={sectionLabelStyle}><FileText size={13} /> NOTES</p>
                        <p style={{ ...infoStyle, fontStyle: 'italic', color: '#78716c' }}>"{o.orderNotes}"</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p style={sectionLabelStyle}><Package size={13} /> ITEMS ORDERED</p>
                    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e7e5e4', overflow: 'hidden' }}>
                      {o.items?.map((item, idx) => (
                        <div key={item.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px', borderBottom: idx < o.items.length - 1 ? '1px solid #f5f5f4' : 'none', gap: 12
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef3c7', overflow: 'hidden', flexShrink: 0 }}>
                              {item.mango?.imageUrl
                                ? <img src={item.mango.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 18 }}>🥭</div>
                              }
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.mango?.name}</p>
                              <p style={{ color: '#78716c', fontSize: 11 }}>{item.quantity} {item.mango?.unit} × ₹{item.unitPrice}</p>
                            </div>
                          </div>
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#166534', flexShrink: 0 }}>₹{item.totalPrice}</p>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#f9f9f8', fontWeight: 700, fontSize: 15 }}>
                        <span>Total</span>
                        <span style={{ color: '#166534' }}>₹{parseFloat(o.totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status, map }) {
  if (!status) return null
  const c = map[status] || { bg: '#f5f5f4', text: '#78716c' }
  return (
    <span style={{ background: c.bg, color: c.text, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{status}</span>
  )
}

const sectionLabelStyle = { fontSize: 11, fontWeight: 700, color: '#a8a29e', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }
const infoStyle = { fontSize: 13, color: '#1c1917', marginBottom: 3, lineHeight: 1.5 }