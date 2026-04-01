import { useState, useEffect } from 'react'
import { mangoAPI } from '../api'
import MangoCard from '../components/MangoCard'
import { Search } from 'lucide-react'

export default function Home({ addToCart }) {
  const [mangoes, setMangoes] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mangoAPI.getCategories().then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    mangoAPI.getAll({ category: selectedCat, search })
      .then(r => setMangoes(r.data))
      .finally(() => setLoading(false))
  }, [selectedCat, search])

  return (
    <div className="page">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
        borderRadius: 24, padding: '48px 40px', marginBottom: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <p style={{ color: '#92400e', fontWeight: 600, marginBottom: 8, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
            Fresh from the Farm
          </p>
          <h1 style={{ fontSize: 52, lineHeight: 1.1, marginBottom: 16, color: '#78350f' }}>
            The Finest<br />Mangoes 🥭
          </h1>
          <p style={{ color: '#92400e', maxWidth: 400, lineHeight: 1.6 }}>
            Premium quality mangoes sourced directly from the best orchards.
            Sweet, juicy, and delivered to your door.
          </p>
        </div>
        <div style={{ fontSize: 120, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>🥭</div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#78716c' }} />
          <input placeholder="Search mangoes..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedCat('')}
            className={`btn ${selectedCat === '' ? 'btn-primary' : 'btn-outline'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              className={`btn ${selectedCat === cat ? 'btn-primary' : 'btn-outline'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#78716c', fontSize: 18 }}>Loading mangoes... 🥭</div>
      ) : mangoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#78716c' }}>
          <div style={{ fontSize: 60 }}>😔</div>
          <p style={{ marginTop: 12 }}>No mangoes found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {mangoes.map(m => <MangoCard key={m.id} mango={m} addToCart={addToCart} />)}
        </div>
      )}
    </div>
  )
}