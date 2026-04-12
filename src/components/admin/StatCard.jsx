import React from 'react'

const colorMap = {
  indigo: { glow: '#6366f1', bg: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))' },
  emerald: { glow: '#10b981', bg: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))' },
  amber: { glow: '#f59e0b', bg: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))' },
  rose: { glow: '#ef4444', bg: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))' },
  blue: { glow: '#3b82f6', bg: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))' },
  cyan: { glow: '#06b6d4', bg: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.04))' },
}

const StatCard = ({ icon: Icon, label, value, color = 'indigo', suffix = '', delay = 0 }) => {
  const theme = colorMap[color] || colorMap.indigo

  return (
    <div
      className={`stat-card animate-fade-in-up`}
      style={{
        background: theme.bg,
        animationDelay: `${delay * 0.05}s`,
      }}
    >
      <div className="stat-glow" style={{ background: theme.glow }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            {label}
          </p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#e2e8f0', margin: '8px 0 0 0', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}
            {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b', marginLeft: 4 }}>{suffix}</span>}
          </p>
        </div>
        {Icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${theme.glow}18`,
              border: `1px solid ${theme.glow}25`,
            }}
          >
            <Icon size={20} style={{ color: theme.glow }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
