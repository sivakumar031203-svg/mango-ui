import React from 'react'

export default function Contact() {
    return (
        <div className="page" style={{ maxWidth: 640 }}>
            <h1 className="section-title">Contact Owner</h1>
            <p className="section-sub">Reach out for any queries or support</p>

            <div className="card" style={{ padding: 24 }}>

                <div style={{ background: '#fafaf9', borderRadius: 12, padding: 16 }}>

                    <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 13, color: '#78716c' }}>Phone</p>
                        <a href="tel:+919876543210" style={{ fontWeight: 600, fontSize: 16 }}>
                            +91 9876543210
                        </a>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 13, color: '#78716c' }}>Email</p>
                        <a href="mailto:support@mangomart.com" style={{ fontWeight: 600, fontSize: 16 }}>
                            support@mangomart.com
                        </a>
                    </div>

                    <div>
                        <p style={{ fontSize: 13, color: '#78716c' }}>WhatsApp</p>
                        <a
                            href="https://wa.me/919876543210"
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontWeight: 600, fontSize: 16, color: '#10b981' }}
                        >
                            Chat on WhatsApp
                        </a>
                    </div>

                </div>

            </div>
        </div>
    )
}