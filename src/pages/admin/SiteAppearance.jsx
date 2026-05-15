import React, { useState, useEffect } from 'react'
import { getSiteSettings, updateSiteSettings, uploadFile } from '../../services/adminApi'
import { Loader2, Save, RotateCcw, Image, Type, FileText, Upload } from 'lucide-react'

const SiteAppearance = () => {
  const [settings, setSettings] = useState(getSiteSettings())
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('banner')
  const [uploading, setUploading] = useState({ light: false, dark: false })

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateSiteSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    localStorage.removeItem('gamenode-site-settings')
    setSettings(getSiteSettings())
    setSaved(false)
  }

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      const data = await uploadFile(file, 'appearance')
      handleChange(type === 'light' ? 'bannerLightImage' : 'bannerDarkImage', data.url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const tabs = [
    { key: 'banner', label: 'Banner', icon: Image },
    { key: 'content', label: 'Nội dung', icon: Type },
    { key: 'footer', label: 'Footer', icon: FileText },
  ]

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#f1f5f9',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Giao diện trang
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--admin-text-muted)',
              marginTop: 6,
            }}
          >
            Tùy chỉnh nội dung hiển thị trên trang chủ
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-ghost" onClick={handleReset}>
            <RotateCcw size={14} />
            Đặt lại
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>
            <Save size={14} />
            {saved ? 'Đã lưu ✓' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 24, display: 'inline-flex' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <tab.icon size={14} />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Banner settings */}
      {activeTab === 'banner' && (
        <div className="admin-card animate-fade-in-up" style={{ padding: 28 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 20,
            }}
          >
            Cài đặt Banner
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Tiêu đề chính (Guest)</label>
              <input
                className="admin-input"
                value={settings.bannerTitle}
                onChange={(e) => handleChange('bannerTitle', e.target.value)}
                placeholder="VD: Welcome to GameNode"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">
                Tiêu đề khi đăng nhập (dùng {'{name}'} cho tên user)
              </label>
              <input
                className="admin-input"
                value={settings.bannerTitleAuth}
                onChange={(e) =>
                  handleChange('bannerTitleAuth', e.target.value)
                }
                placeholder="VD: Welcome back, {name}"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Mô tả banner (Guest)</label>
              <textarea
                className="admin-textarea"
                value={settings.bannerDescription}
                onChange={(e) =>
                  handleChange('bannerDescription', e.target.value)
                }
                rows={3}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Mô tả banner (Đăng nhập)</label>
              <textarea
                className="admin-textarea"
                value={settings.bannerDescriptionAuth}
                onChange={(e) =>
                  handleChange('bannerDescriptionAuth', e.target.value)
                }
                rows={3}
              />
            </div>
            <div>
              <label className="admin-label">Ảnh nền Light Mode</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={settings.bannerLightImage}
                  onChange={(e) =>
                    handleChange('bannerLightImage', e.target.value)
                  }
                  placeholder="/Img/ligh_bg.png"
                />
                <label className="admin-btn admin-btn-ghost" style={{ cursor: 'pointer' }}>
                  {uploading.light ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'light')} disabled={uploading.light} />
                </label>
              </div>
            </div>
            <div>
              <label className="admin-label">Ảnh nền Dark Mode</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={settings.bannerDarkImage}
                  onChange={(e) =>
                    handleChange('bannerDarkImage', e.target.value)
                  }
                  placeholder="/Img/dark_bg.png"
                />
                <label className="admin-btn admin-btn-ghost" style={{ cursor: 'pointer' }}>
                  {uploading.dark ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'dark')} disabled={uploading.dark} />
                </label>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div
            style={{
              marginTop: 28,
              padding: 20,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--admin-border)',
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--admin-text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
              }}
            >
              Xem trước
            </p>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#e2e8f0',
                  margin: 0,
                }}
              >
                {settings.bannerTitle}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--admin-text-muted)',
                  marginTop: 8,
                  maxWidth: 500,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {settings.bannerDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content settings */}
      {activeTab === 'content' && (
        <div className="admin-card animate-fade-in-up" style={{ padding: 28 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 20,
            }}
          >
            Nội dung trang chủ
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--admin-text-muted)',
              marginBottom: 16,
            }}
          >
            Các phần chỉnh sửa nội dung giới thiệu sẽ được bổ sung khi tích hợp thêm
            component vào trang chủ. Hiện tại bạn có thể chỉnh sửa tiêu đề và mô tả
            banner ở tab Banner.
          </p>
          <div className="admin-empty" style={{ padding: 40 }}>
            <Type size={40} />
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Component quản lý nội dung sẽ được mở rộng
            </p>
          </div>
        </div>
      )}

      {/* Footer settings */}
      {activeTab === 'footer' && (
        <div className="admin-card animate-fade-in-up" style={{ padding: 28 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 20,
            }}
          >
            Cài đặt Footer
          </h3>
          <div
            style={{
              display: 'grid',
              gap: 20,
            }}
          >
            <div>
              <label className="admin-label">Mô tả footer</label>
              <textarea
                className="admin-textarea"
                value={settings.footerDescription}
                onChange={(e) =>
                  handleChange('footerDescription', e.target.value)
                }
                rows={2}
              />
            </div>
            <div>
              <label className="admin-label">Bản quyền</label>
              <input
                className="admin-input"
                value={settings.footerCopyright}
                onChange={(e) =>
                  handleChange('footerCopyright', e.target.value)
                }
              />
            </div>
            <div>
              <label className="admin-label">Ghi chú</label>
              <input
                className="admin-input"
                value={settings.footerNote}
                onChange={(e) => handleChange('footerNote', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div
          className="admin-toast"
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
          }}
        >
          ✓ Đã lưu thay đổi thành công
        </div>
      )}
    </div>
  )
}

export default SiteAppearance
