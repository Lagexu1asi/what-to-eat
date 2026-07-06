import RecipeItem from './RecipeItem'
import './Module.css'

/**
 * RecipeModule —— 菜谱模块:按分类展示所有菜品,展开可查看/编辑备料与步骤
 * @param {Object} props
 * @param {Array} props.dishes - 全部菜品列表
 * @param {Function} props.onDelete - 删除菜品回调
 * @param {Function} props.onUpdate - 更新菜品字段回调 (id, patch) => void
 * @param {Function} props.onAdd - 打开添加菜品面板
 */
export default function RecipeModule({ dishes, onDelete, onUpdate, onAdd }) {
  const usedCats = [...new Set(dishes.map((d) => d.category))]

  return (
    <section className="module">
      {dishes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>菜谱库还空着,点击右下角 + 添加第一道菜</p>
        </div>
      ) : (
        <div className="groups">
          {usedCats.map((cat) => {
            const items = dishes.filter((d) => d.category === cat)
            return (
              <div key={cat} className="group">
                <div className="group-head">
                  <h4 className="group-title">{cat}</h4>
                  <span className="group-count">{items.length} 道</span>
                </div>
                <ul className="item-list">
                  {items.map((d) => (
                    <RecipeItem key={d.id} dish={d} onDelete={onDelete} onUpdate={onUpdate} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <button className="fab" onClick={onAdd} aria-label="添加菜品">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  )
}
