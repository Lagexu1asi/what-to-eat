import { useState } from 'react'
import './AddDishSheet.css'

/**
 * AddDishSheet —— 底部滑出的添加菜品面板
 * 备料与步骤均用文本域录入,每行一条
 * 备料格式: "食材名 数量 单位"(如 "番茄 2 个"),用空格分隔
 * 步骤格式: 每行一条步骤描述
 * 支持从已有菜谱导入步骤,追加到当前步骤文本域(非覆盖),节省重复录入
 * @param {Object} props
 * @param {string[]} props.tags - 分类标签列表
 * @param {Array} props.dishes - 已有菜品列表(用于导入步骤)
 * @param {Function} props.onAdd - 提交回调 (dish) => void
 * @param {Function} props.onClose - 关闭回调
 */
export default function AddDishSheet({ tags, dishes = [], onAdd, onClose }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(tags[0] || '')
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [importerOpen, setImporterOpen] = useState(false)
  // 已导入过的菜谱 id 集合,用于在 UI 上标记,避免重复导入相同步骤
  const [importedIds, setImportedIds] = useState([])

  /** 解析备料文本为结构化数据 */
  const parseIngredients = (text) => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // 兼容 "番茄 2 个" / "番茄 2" / "番茄" 多种写法
        const parts = line.split(/\s+/)
        const name = parts[0] || line
        const amount = parts[1] ? Number(parts[1]) || 1 : 1
        const unit = parts[2] || '份'
        return { name, amount, unit }
      })
  }

  /** 解析步骤文本为数组 */
  const parseSteps = (text) => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }

  /** 提交表单:校验菜名非空后回调,并清空输入 */
  const handleSubmit = () => {
    const n = name.trim()
    if (!n) return
    onAdd({
      id: `${Date.now()}`,
      name: n,
      category,
      ingredients: parseIngredients(ingredientsText),
      steps: parseSteps(stepsText)
    })
    setName('')
    setIngredientsText('')
    setStepsText('')
  }

  /**
   * 导入某菜谱的步骤:追加(非覆盖)到步骤文本域
   * 已有内容时用换行衔接;空内容时直接写入
   * 同一菜谱默认只导入一次,重复点击会再次追加(用户可自行删行)
   */
  const importSteps = (dish) => {
    const steps = dish.steps?.filter(Boolean) || []
    if (steps.length === 0) return
    const incoming = steps.join('\n')
    setStepsText((prev) => (prev.trim() ? `${prev.trimEnd()}\n${incoming}` : incoming))
    setImportedIds((prev) => (prev.includes(dish.id) ? prev : [...prev, dish.id]))
  }

  const canSubmit = name.trim().length > 0

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        <h3 className="sheet-title">添加菜品</h3>

        <label className="sheet-field">
          <span className="sheet-label">菜品名称</span>
          <input
            className="sheet-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如:鱼香肉丝"
            autoFocus
          />
        </label>

        <div className="sheet-field">
          <span className="sheet-label">分类</span>
          <div className="sheet-tags">
            {tags.map((t) => (
              <button
                key={t}
                className={`sheet-tag ${category === t ? 'sheet-tag--active' : ''}`}
                onClick={() => setCategory(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="sheet-field">
          <span className="sheet-label">备料清单(每行一条,格式: 食材 数量 单位)</span>
          <textarea
            className="sheet-textarea"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={'番茄 2 个\n鸡蛋 3 个\n盐 1 小勺'}
            rows={4}
          />
        </label>

        <div className="sheet-field">
          <div className="sheet-label-row">
            <span className="sheet-label">烹饪步骤(每行一条)</span>
            <button
              type="button"
              className="import-toggle"
              onClick={() => setImporterOpen((v) => !v)}
            >
              {importerOpen ? '收起' : '导入步骤'}
            </button>
          </div>

          {/* 导入步骤面板:展开时列出已有菜谱供选择 */}
          {importerOpen && (
            <div className="import-panel">
              <p className="import-hint">点击菜谱追加其步骤到下方文本域(可多次导入拼接)</p>
              <div className="import-list">
                {dishes.filter((d) => (d.steps?.length || 0) > 0).length === 0 ? (
                  <span className="import-empty">暂无可导入的菜谱</span>
                ) : (
                  dishes.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`import-chip ${importedIds.includes(d.id) ? 'import-chip--done' : ''}`}
                      onClick={() => importSteps(d)}
                      title={d.steps.join('\n')}
                    >
                      <span className="import-chip-name">{d.name}</span>
                      <span className="import-chip-meta">{d.steps.length} 步</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <textarea
            className="sheet-textarea"
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            placeholder={'番茄洗净切块\n热锅冷油炒鸡蛋\n倒回番茄同炒'}
            rows={4}
          />
        </div>

        <div className="sheet-btns">
          <button className="sheet-btn sheet-btn--cancel" onClick={onClose}>取消</button>
          <button className="sheet-btn sheet-btn--ok" onClick={handleSubmit} disabled={!canSubmit}>
            确认添加
          </button>
        </div>
      </div>
    </>
  )
}
