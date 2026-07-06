import DishItem from './DishItem'
import './Module.css'
import './MenuModule.css'

/**
 * MenuModule —— 今日菜单模块:按分类展示菜品供点菜,底部聚合今日备菜清单
 * @param {Object} props
 * @param {Array} props.dishes - 全部菜品列表(含 ingredients)
 * @param {Object} props.orders - 今日点单 { [dishId]: 份数 }
 * @param {Function} props.onInc - 增加份数 (dishId) => void
 * @param {Function} props.onDec - 减少份数 (dishId) => void
 * @param {Function} props.onReset - 清空今日点单
 */
export default function MenuModule({ dishes, orders, onInc, onDec, onReset }) {
  // 已点菜品列表(份数大于 0 的)
  const orderedDishes = dishes.filter((d) => (orders[d.id] || 0) > 0)
  const totalDishes = orderedDishes.reduce((sum, d) => sum + orders[d.id], 0)
  const usedCats = [...new Set(dishes.map((d) => d.category))]

  // 聚合今日备菜清单:相同食材名+单位累加数量
  const prepList = aggregateIngredients(orderedDishes, orders)

  return (
    <section className="module">
      {/* 今日点单概览 */}
      <div className="module-summary">
        <div className="menu-overview">
          <div className="menu-overview-item">
            <span className="menu-overview-num">{orderedDishes.length}</span>
            <span className="menu-overview-label">已点种类</span>
          </div>
          <div className="menu-overview-divider" />
          <div className="menu-overview-item">
            <span className="menu-overview-num">{totalDishes}</span>
            <span className="menu-overview-label">总份数</span>
          </div>
          <div className="menu-overview-divider" />
          <div className="menu-overview-item">
            <span className="menu-overview-num menu-overview-num--accent">{prepList.length}</span>
            <span className="menu-overview-label">备料种类</span>
          </div>
        </div>
        {totalDishes > 0 && (
          <button className="reset-btn" onClick={onReset}>清空点单</button>
        )}
      </div>

      {/* 按分类分组的菜品列表 */}
      {dishes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <p>还没有菜品,前往「菜谱」页添加</p>
        </div>
      ) : (
        <div className="groups">
          {usedCats.map((cat) => {
            const items = dishes.filter((d) => d.category === cat)
            const catCount = items.reduce((s, d) => s + (orders[d.id] || 0), 0)
            return (
              <div key={cat} className="group">
                <div className="group-head">
                  <h4 className="group-title">{cat}</h4>
                  <span className="group-count">
                    {catCount > 0 ? `已点 ${catCount} 份` : `${items.length} 道`}
                  </span>
                </div>
                <ul className="item-list">
                  {items.map((d) => (
                    <DishItem
                      key={d.id}
                      dish={d}
                      count={orders[d.id] || 0}
                      onInc={onInc}
                      onDec={onDec}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      {/* 今日备菜清单 */}
      {prepList.length > 0 && (
        <div className="prep-card">
          <div className="prep-head">
            <h4 className="prep-title">🛒 今日备菜清单</h4>
            <span className="prep-count">{prepList.length} 种食材</span>
          </div>
          <ul className="prep-list">
            {prepList.map((item, i) => (
              <li key={`${item.name}-${item.unit}-${i}`} className="prep-row">
                <span className="prep-name">{item.name}</span>
                <span className="prep-amt">
                  {item.amount}
                  <em className="prep-unit">{item.unit}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

/**
 * aggregateIngredients —— 将已点菜品的备料按 食材名+单位 聚合累加
 * @param {Array} orderedDishes - 已点菜品(份数 > 0)
 * @param {Object} orders - 点单份数表
 * @returns {Array<{name, amount, unit}>} 聚合后的备料清单
 */
function aggregateIngredients(orderedDishes, orders) {
  const map = new Map()
  orderedDishes.forEach((dish) => {
    const qty = orders[dish.id] || 0
    if (!qty) return
    ;(dish.ingredients || []).forEach((ing) => {
      const key = `${ing.name}__${ing.unit}`
      const prev = map.get(key)
      if (prev) {
        prev.amount += ing.amount * qty
      } else {
        map.set(key, { name: ing.name, amount: ing.amount * qty, unit: ing.unit })
      }
    })
  })
  return Array.from(map.values())
}
