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
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
          border-radius: 24px;
          padding: 48px 40px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .hero-emoji {
          font-size: 120px;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
          flex-shrink: 0;
        }
        .hero-title {
          font-size: 52px;
          line-height: 1.1;
          margin-bottom: 16px;
          color: #78350f;
        }
        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .category-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mango-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 32px 24px;
            border-radius: 18px;
            margin-bottom: 28px;
          }
          .hero-title { font-size: 38px; }
          .hero-emoji { font-size: 80px; }
          .mango-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        }

        @media (max-width: 540px) {
          .hero-section {
            padding: 24px 20px;
            flex-direction: column-reverse;
            text-align: center;
            gap: 16px;
          }
          .hero-emoji { font-size: 72px; }
          .hero-title { font-size: 32px; }
          .filter-row { flex-direction: column; gap: 10px; }
          .category-pills { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
          .category-pills::-webkit-scrollbar { height: 3px; }
          .mango-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }

        @media (max-width: 360px) {
          .mango-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hero-section">
        <div>
          <p style={{ color: '#92400e', fontWeight: 600, marginBottom: 8, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
            Fresh from the Farm
          </p>
          <h1 className="hero-title">The Finest<br />Mangoes 🥭</h1>
          <p style={{ color: '#92400e', maxWidth: 400, lineHeight: 1.6, fontSize: 15 }}>
            Premium quality mangoes sourced directly from the best orchards. Sweet, juicy, and delivered to your door.
          </p>
        </div>
        <div className="hero-emoji">🥭</div>
      </div>

      <div className="filter-row">
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#78716c' }} />
          <input placeholder="Search mangoes..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }} />
        </div>
        <div className="category-pills">
          <button onClick={() => setSelectedCat('')}
            className={`btn ${selectedCat === '' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flexShrink: 0 }}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              className={`btn ${selectedCat === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ flexShrink: 0 }}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#78716c', fontSize: 18 }}>Loading mangoes... 🥭</div>
      ) : mangoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#78716c' }}>
          <div style={{ fontSize: 60 }}>😔</div>
          <p style={{ marginTop: 12 }}>No mangoes found</p>
        </div>
      ) : (
        <div className="mango-grid">
          {mangoes.map(m => <MangoCard key={m.id} mango={m} addToCart={addToCart} />)}
        </div>
      )}
    </div>
  )
}