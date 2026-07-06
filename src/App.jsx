import { useState, useEffect, useCallback } from 'react'
import TabNav from './components/TabNav'
import MenuModule from './components/MenuModule'
import RecipeModule from './components/RecipeModule'
import AddDishSheet from './components/AddDishSheet'
import DataExchangeSheet from './components/DataExchangeSheet'
import { useLocalStorage, getTodayKey, formatDateZh } from './hooks/useLocalStorage'
import { DEFAULT_DISHES, DISH_CATEGORIES } from './data/defaults'
import './App.css'

/**
 * App —— 应用根组件,管理两分页(菜单/菜谱)与今日点单状态
 * 每日跨天自动清空点单;菜谱数据持久化,可增删
 */
export default function App() {
  const [tab, setTab] = useState('menu')
  const [dishes, setDishes] = useLocalStorage('we_dishes', DEFAULT_DISHES)
  const [orders, setOrders] = useLocalStorage('we_orders', {})
  const [lastReset, setLastReset] = useLocalStorage('we_lastReset', getTodayKey())
  // 右上角徽标文字:用户可自行修改,持久化到本地
  const [badgeText, setBadgeText] = useLocalStorage('we_badge', '糊小厨')
  const [editingBadge, setEditingBadge] = useState(false)
  const [badgeDraft, setBadgeDraft] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  // 数据交换面板:'export' 显示可复制的 JSON, 'import' 粘贴 JSON 导入,null 关闭
  const [dataSheet, setDataSheet] = useState(null)

  /** 每日自动重置:日期变更时清空今日点单 */
  useEffect(() => {
    const today = getTodayKey()
    if (lastReset !== today) {
      setOrders({})
      setLastReset(today)
    }
  }, [])

  /** 进入徽标编辑态:用当前文字初始化草稿 */
  const startEditBadge = useCallback(() => {
    setBadgeDraft(badgeText)
    setEditingBadge(true)
  }, [badgeText])

  /** 提交徽标修改:去空白、限制长度、空值回退默认 */
  const commitBadge = useCallback(() => {
    const v = badgeDraft.trim().slice(0, 6)
    setBadgeText(v || '糊小厨')
    setEditingBadge(false)
  }, [badgeDraft, setBadgeText])

  /** 增加某菜品的点单份数 */
  const incOrder = useCallback(
    (id) => {
      setOrders((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    },
    [setOrders]
  )

  /** 减少某菜品的点单份数,降到 0 时移除记录 */
  const decOrder = useCallback(
    (id) => {
      setOrders((prev) => {
        const next = (prev[id] || 0) - 1
        if (next <= 0) {
          const { [id]: _omit, ...rest } = prev
          return rest
        }
        return { ...prev, [id]: next }
      })
    },
    [setOrders]
  )

  /** 清空今日点单 */
  const resetOrders = useCallback(() => {
    setOrders({})
  }, [setOrders])

  /** 删除某菜品(同时清掉对应点单) */
  const deleteDish = useCallback(
    (id) => {
      setDishes((prev) => prev.filter((d) => d.id !== id))
      setOrders((prev) => {
        const { [id]: _omit, ...rest } = prev
        return rest
      })
    },
    [setDishes, setOrders]
  )

  /** 更新某菜品(备料/步骤等字段),合并写入菜谱库 */
  const updateDish = useCallback(
    (id, patch) => {
      setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
    },
    [setDishes]
  )

  /** 添加新菜品到菜谱库 */
  const handleAddDish = useCallback(
    (dish) => {
      setDishes((prev) => [...prev, dish])
      setSheetOpen(false)
    },
    [setDishes]
  )

  /**
   * 导出菜谱为 JSON 文本字符串(供文本框展示与复制)
   * @returns {string} 格式化后的 JSON 文本
   */
  const exportDishes = useCallback(() => {
    return JSON.stringify(dishes, null, 2)
  }, [dishes])

  /**
   * 从 JSON 文本字符串导入菜谱,覆盖现有菜谱库
   * 校验:必须是数组,且每项至少有 name 字段;补全缺失字段与 id
   * 导入后同步清理失效的今日点单(已不存在的菜品 id)
   * 注意:本函数不弹 confirm,由调用方(UI 层)自行确认后再调用
   * @param {string} text - 用户粘贴的 JSON 文本
   * @returns {{ok: boolean, msg: string, count?: number}} 导入结果
   */
  const importDishes = useCallback(
    (text) => {
      try {
        const data = JSON.parse(text)
        if (!Array.isArray(data)) {
          return { ok: false, msg: '格式错误:应为菜谱数组 [...]' }
        }
        if (data.length === 0) {
          return { ok: false, msg: '文本中没有菜谱数据' }
        }
        // 校验+补全字段
        const seenIds = new Set()
        const normalized = data.map((d, i) => {
          if (!d || typeof d !== 'object' || !d.name) {
            throw new Error(`第 ${i + 1} 条菜谱缺少 name 字段`)
          }
          let id = d.id && !seenIds.has(d.id) ? d.id : `${Date.now()}-${i}`
          seenIds.add(id)
          return {
            id,
            name: String(d.name),
            category: d.category || '其他',
            ingredients: Array.isArray(d.ingredients)
              ? d.ingredients.map((ing) => ({
                  name: String(ing?.name ?? ''),
                  amount: Number(ing?.amount) || 1,
                  unit: String(ing?.unit ?? '份')
                }))
              : [],
            steps: Array.isArray(d.steps) ? d.steps.map((s) => String(s)) : []
          }
        })

        setDishes(normalized)
        // 清理失效订单
        const validIds = new Set(normalized.map((d) => d.id))
        setOrders((prev) => {
          const next = {}
          Object.entries(prev).forEach(([id, qty]) => {
            if (validIds.has(id)) next[id] = qty
          })
          return next
        })
        return { ok: true, msg: `成功导入 ${normalized.length} 道菜谱`, count: normalized.length }
      } catch (err) {
        return { ok: false, msg: `导入失败: ${err.message || 'JSON 解析错误'}` }
      }
    },
    [dishes.length, setDishes, setOrders]
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1 className="app-title">今天吃什么</h1>
            <p className="app-date">{formatDateZh()}</p>
          </div>
          <div className="header-badge">
            {editingBadge ? (
              <input
                className="header-badge-input"
                value={badgeDraft}
                autoFocus
                maxLength={6}
                onChange={(e) => setBadgeDraft(e.target.value)}
                onBlur={commitBadge}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitBadge()
                }}
              />
            ) : (
              <span
                className="header-badge-text"
                onClick={startEditBadge}
                title="点击修改"
              >
                {badgeText}
              </span>
            )}
          </div>
        </div>
        <TabNav active={tab} onChange={setTab} />
      </header>

      <main className="app-main">
        {tab === 'menu' && (
          <MenuModule
            dishes={dishes}
            orders={orders}
            onInc={incOrder}
            onDec={decOrder}
            onReset={resetOrders}
          />
        )}

        {tab === 'recipe' && (
          <RecipeModule
            dishes={dishes}
            onDelete={deleteDish}
            onUpdate={updateDish}
            onAdd={() => setSheetOpen(true)}
            onExport={() => setDataSheet('export')}
            onImport={() => setDataSheet('import')}
          />
        )}
      </main>

      {sheetOpen && (
        <AddDishSheet
          tags={DISH_CATEGORIES}
          dishes={dishes}
          onAdd={handleAddDish}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {dataSheet && (
        <DataExchangeSheet
          mode={dataSheet}
          dishCount={dishes.length}
          onExport={exportDishes}
          onImport={importDishes}
          onClose={() => setDataSheet(null)}
        />
      )}
    </div>
  )
}
