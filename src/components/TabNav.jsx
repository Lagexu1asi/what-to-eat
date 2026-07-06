import './TabNav.css'

/**
 * TabNav —— 顶部双标签切换(今日菜单 / 菜谱库)
 * @param {Object} props
 * @param {string} props.active - 当前激活的标签 'menu' | 'recipe'
 * @param {Function} props.onChange - 切换回调
 */
export default function TabNav({ active, onChange }) {
  const tabs = [
    { key: 'menu', label: '菜单', icon: '🍽️' },
    { key: 'recipe', label: '菜谱', icon: '📖' }
  ]

  return (
    <nav className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn ${active === tab.key ? 'tab-btn--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
