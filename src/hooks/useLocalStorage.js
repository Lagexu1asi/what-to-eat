import { useState, useEffect } from 'react'

/**
 * useLocalStorage —— 将状态同步持久化到 localStorage 的自定义 Hook
 * @param {string} key - 存储键名
 * @param {*} initialValue - 初始值(无缓存数据时使用)
 * @returns {[any, Function]} [当前值, 设置函数]
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  // 值变化时写回 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* 存储满或隐私模式下静默忽略 */
    }
  }, [key, value])

  return [value, setValue]
}

/**
 * getTodayKey —— 返回当天日期字符串(YYYY-MM-DD),用于每日点单重置判断
 * @returns {string}
 */
export function getTodayKey() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/**
 * formatDateZh —— 将日期格式化为中文显示(7月6日 周一)
 * @returns {string}
 */
export function formatDateZh() {
  const d = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${week[d.getDay()]}`
}
