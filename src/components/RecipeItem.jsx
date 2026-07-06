import { useState } from 'react'
import './RecipeItem.css'

/**
 * RecipeItem —— 菜谱页单条菜品项,可展开查看/编辑备料清单与烹饪步骤
 * 编辑模式下,备料与步骤变为可输入,改动即时同步到父级持久化
 * @param {Object} props
 * @param {Object} props.dish - 菜品 { id, name, category, ingredients, steps }
 * @param {Function} props.onDelete - 删除菜品回调
 * @param {Function} props.onUpdate - 更新菜品字段回调 (id, patch) => void
 */
export default function RecipeItem({ dish, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)

  /** 修改第 i 个备料某个字段后回写到父级 */
  const updateIngredient = (i, field, value) => {
    const next = (dish.ingredients || []).map((ing, idx) =>
      idx === i ? { ...ing, [field]: value } : ing
    )
    onUpdate(dish.id, { ingredients: next })
  }

  /** 删除第 i 个备料 */
  const removeIngredient = (i) => {
    const next = (dish.ingredients || []).filter((_, idx) => idx !== i)
    onUpdate(dish.id, { ingredients: next })
  }

  /** 新增一条空备料 */
  const addIngredient = () => {
    const next = [...(dish.ingredients || []), { name: '', amount: 1, unit: '份' }]
    onUpdate(dish.id, { ingredients: next })
  }

  /** 修改第 i 个步骤文本后回写 */
  const updateStep = (i, value) => {
    const next = (dish.steps || []).map((s, idx) => (idx === i ? value : s))
    onUpdate(dish.id, { steps: next })
  }

  /** 删除第 i 个步骤 */
  const removeStep = (i) => {
    const next = (dish.steps || []).filter((_, idx) => idx !== i)
    onUpdate(dish.id, { steps: next })
  }

  /** 新增一条空步骤 */
  const addStep = () => {
    const next = [...(dish.steps || []), '']
    onUpdate(dish.id, { steps: next })
  }

  /** 退出编辑态(无须额外保存,改动已实时同步) */
  const finishEdit = () => setEditing(false)

  return (
    <li className={`recipe-item ${expanded ? 'recipe-item--open' : ''}`}>
      <div className="recipe-head" onClick={() => !editing && setExpanded((e) => !e)}>
        <div className="recipe-head-info">
          <span className="recipe-title">{dish.name}</span>
          <span className="recipe-cat">{dish.category}</span>
        </div>
        <div className="recipe-head-right">
          <span className="recipe-meta">
            {dish.ingredients?.length || 0} 料 · {dish.steps?.length || 0} 步
          </span>
          <svg className={`recipe-chevron ${expanded ? 'recipe-chevron--open' : ''}`} viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="recipe-detail">
          {/* 备料清单 */}
          <div className="recipe-section">
            <div className="recipe-section-bar">
              <span className="recipe-section-label">🥬 备料清单</span>
              <button
                className="recipe-edit-toggle"
                onClick={() => setEditing((e) => !e)}
              >
                {editing ? '完成' : '编辑'}
              </button>
            </div>

            <ul className="recipe-ing-list">
              {(dish.ingredients || []).map((ing, i) => (
                <li key={i} className="recipe-ing">
                  {editing ? (
                    <>
                      <input
                        className="recipe-ing-input recipe-ing-input--name"
                        value={ing.name}
                        onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                        placeholder="食材名"
                      />
                      <input
                        className="recipe-ing-input recipe-ing-input--amt"
                        type="number"
                        min="0"
                        step="0.1"
                        value={ing.amount}
                        onChange={(e) =>
                          updateIngredient(i, 'amount', Number(e.target.value) || 0)
                        }
                      />
                      <input
                        className="recipe-ing-input recipe-ing-input--unit"
                        value={ing.unit}
                        onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                        placeholder="单位"
                      />
                      <button
                        className="recipe-row-del"
                        onClick={() => removeIngredient(i)}
                        aria-label="删除备料"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="recipe-ing-name">{ing.name || '（未命名）'}</span>
                      <span className="recipe-ing-amt">
                        {ing.amount}<em className="recipe-ing-unit">{ing.unit}</em>
                      </span>
                    </>
                  )}
                </li>
              ))}
              {(!dish.ingredients || dish.ingredients.length === 0) && !editing && (
                <li className="recipe-empty">暂无备料</li>
              )}
            </ul>
            {editing && (
              <button className="recipe-add-row" onClick={addIngredient}>+ 添加备料</button>
            )}
          </div>

          {/* 烹饪步骤 */}
          <div className="recipe-section">
            <div className="recipe-section-bar">
              <span className="recipe-section-label">👨‍🍳 烹饪步骤</span>
            </div>
            <ol className="recipe-steps">
              {(dish.steps || []).map((step, i) => (
                <li key={i} className="recipe-step">
                  <span className="recipe-step-num">{i + 1}</span>
                  {editing ? (
                    <div className="recipe-step-edit">
                      <textarea
                        className="recipe-step-input"
                        value={step}
                        onChange={(e) => updateStep(i, e.target.value)}
                        rows={2}
                        placeholder="步骤描述"
                      />
                      <button
                        className="recipe-row-del"
                        onClick={() => removeStep(i)}
                        aria-label="删除步骤"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className="recipe-step-text">{step || '（空步骤）'}</span>
                  )}
                </li>
              ))}
              {(!dish.steps || dish.steps.length === 0) && !editing && (
                <li className="recipe-empty">暂无步骤</li>
              )}
            </ol>
            {editing && (
              <button className="recipe-add-row" onClick={addStep}>+ 添加步骤</button>
            )}
          </div>

          <div className="recipe-actions">
            {editing ? (
              <button className="recipe-act recipe-act--done" onClick={finishEdit}>
                完成编辑
              </button>
            ) : (
              <button className="recipe-act recipe-act--del" onClick={() => onDelete(dish.id)}>
                删除菜品
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
