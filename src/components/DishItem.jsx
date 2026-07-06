import './DishItem.css'

/**
 * DishItem —— 菜单页单条菜品项,支持 +/- 调整份数
 * @param {Object} props
 * @param {Object} props.dish - 菜品 { id, name, category }
 * @param {number} props.count - 当前已点份数
 * @param {Function} props.onInc - 加一份回调
 * @param {Function} props.onDec - 减一份回调(为 0 时由父组件决定是否移除)
 */
export default function DishItem({ dish, count, onInc, onDec }) {
  return (
    <li className={`dish-item ${count > 0 ? 'dish-item--active' : ''}`}>
      <div className="dish-body">
        <span className="dish-title">{dish.name}</span>
        <span className="dish-cat">{dish.category}</span>
      </div>
      <div className="dish-counter">
        <button
          className="dish-btn dish-btn--dec"
          onClick={() => onDec(dish.id)}
          disabled={count === 0}
          aria-label="减少一份"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="dish-count">{count}</span>
        <button
          className="dish-btn dish-btn--inc"
          onClick={() => onInc(dish.id)}
          aria-label="增加一份"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </li>
  )
}
