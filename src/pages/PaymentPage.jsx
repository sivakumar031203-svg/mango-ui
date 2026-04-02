import { useParams, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { orderAPI } from '../api'
import toast from 'react-hot-toast'
import { CheckCircle, Copy } from 'lucide-react'

// ⚠️ REPLACE THESE WITH YOUR ACTUAL DETAILS
const UPI_ID = 'siva@upi'
const UPI_NAME = 'MangoMart Store'
const QR_IMAGE_URL = '' // Put your QR code image URL here, or leave blank

export default function PaymentPage() {
  const { orderNumber } = useParams()
  const location = useLocation()
  const orderData = location.state || {}
  const [txnId, setTxnId] = useState('')
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const confirmPayment = async () => {
    if (!txnId.trim()) return toast.error('Enter transaction ID')
    setLoading(true)
    try {
      await orderAPI.updatePayment(orderNumber, { transactionId: txnId })
      setPaid(true)
      toast.success('Payment confirmed! 🎉')
    } catch {
      toast.error('Failed to confirm payment')
    } finally {
      setLoading(false)
    }
  }

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID)
    toast.success('UPI ID copied!')
  }

  if (paid) return (
    <div className="page" style={{ maxWidth: 500, textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 80 }}>🎉</div>
      <CheckCircle size={60} style={{ color: '#166534', margin: '16px auto', display: 'block' }} />
      <h2 style={{ marginBottom: 8 }}>Payment Confirmed!</h2>
      <p style={{ color: '#78716c', marginBottom: 16 }}>Your order <strong>{orderNumber}</strong> has been confirmed.</p>
      <p style={{ color: '#78716c', marginBottom: 24 }}>We'll deliver your fresh mangoes soon! 🥭</p>
      <a href="/"><button className="btn btn-primary">Continue Shopping</button></a>
    </div>
  )

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <h1 className="section-title">Complete Payment</h1>
      <p className="section-sub">Order #{orderNumber} · Total: <strong style={{ color: '#166534' }}>₹{orderData.totalAmount}</strong></p>

      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        {orderData.paymentMethod === 'QR_CODE' ? (
          <>
            <h3 style={{ marginBottom: 8, fontFamily: 'Playfair Display' }}>Scan QR Code to Pay</h3>
            <p style={{ color: '#78716c', marginBottom: 24, fontSize: 14 }}>Open any UPI app, scan the QR code and pay ₹{orderData.totalAmount}</p>
            <div style={{ width: 220, height: 220, margin: '0 auto 24px', background: '#f5f5f4', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e7e5e4' }}>
              {QR_IMAGE_URL
                ? <img src={QR_IMAGE_URL} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16 }} />
                : <div style={{ textAlign: 'center', color: '#78716c' }}>
                  <div style={{ fontSize: 48 }}>📲</div>
                  <p style={{ fontSize: 12, marginTop: 8 }}>Add your QR code image in PaymentPage.jsx</p>
                </div>
              }
            </div>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: 8, fontFamily: 'Playfair Display' }}>Pay via UPI</h3>
            <p style={{ color: '#78716c', marginBottom: 24, fontSize: 14 }}>Send ₹{orderData.totalAmount} to the UPI ID below</p>
            <div style={{ background: '#fef3c7', borderRadius: 12, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>UPI ID</p>
                <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#78350f' }}>{UPI_ID}</p>
                <p style={{ fontSize: 12, color: '#92400e' }}>{UPI_NAME}</p>
              </div>
              <button onClick={copyUpi} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b' }}>
                <Copy size={22} />
              </button>
            </div>
          </>
        )}

        <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: 24, marginTop: 8 }}>
          <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>After payment, enter your transaction ID:</p>
          <input value={txnId} onChange={e => setTxnId(e.target.value)}
            placeholder="e.g. UPI123456789" style={{ marginBottom: 14 }} />
          <button className="btn btn-green" onClick={confirmPayment} disabled={loading}
            style={{ width: '100%', padding: 14, fontSize: 15 }}>
            {loading ? 'Confirming...' : '✅ Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}