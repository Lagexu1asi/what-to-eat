import { useMemo, useState } from 'react'
import './AddDishSheet.css'
import './DataExchangeSheet.css'

/**
 * DataExchangeSheet —— 底部滑出的菜谱数据交换面板
 * 两种模式:
 *   - 'export':只读文本域展示 JSON,带「复制」按钮
 *   - 'import':可编辑文本域,粘贴 JSON 后点「确认导入」覆盖菜谱
 * 用文本框方式替代文件下载/上传,适配手机端 Safari
 * @param {Object} props
 * @param {'export'|'import'} props.mode - 面板模式
 * @param {number} props.dishCount - 当前菜谱数量(用于导入时的覆盖提示)
 * @param {Function} props.onExport - 返回 JSON 文本字符串的函数
 * @param {Function} props.onImport - (text) => {ok, msg, count} 导入处理函数
 * @param {Function} props.onClose - 关闭面板
 */
export default function DataExchangeSheet({ mode, dishCount, onExport, onImport, onClose }) {
  // 导出模式:打开时即生成一次 JSON,避免每次渲染都序列化
  const exportText = useMemo(() => (mode === 'export' ? onExport() : ''), [mode, onExport])
  // 导入模式:用户粘贴的文本与结果反馈
  const [importText, setImportText] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  /**
   * 复制导出文本到剪贴板
   * 优先用 navigator.clipboard,失败时回退到选中文本让用户手动复制
   */
  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(exportText)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
        return
      }
    } catch {
      // 忽略,走回退
    }
    // 回退:选中文本域内容,提示用户手动复制
    const ta = document.getElementById('export-textarea')
    if (ta) {
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        setResult({ ok: false, msg: '复制失败,请长按文本手动复制' })
      }
    }
  }

  /**
   * 执行导入:先二次确认覆盖,再调用 onImport
   */
  const handleImport = () => {
    const text = importText.trim()
    if (!text) {
      setResult({ ok: false, msg: '请先粘贴菜谱 JSON 文本' })
      return
    }
    // 二次确认:导入会覆盖现有菜谱
    const confirmed = window.confirm(
      `即将导入菜谱并覆盖当前 ${dishCount} 道菜谱。\n确定继续?`
    )
    if (!confirmed) return
    const r = onImport(text)
    setResult(r)
    // 成功后清空文本域
    if (r.ok) setImportText('')
  }

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet data-sheet">
        <div className="sheet-handle" />
        <h3 className="sheet-title">
          {mode === 'export' ? '导出菜谱' : '导入菜谱'}
        </h3>

        {mode === 'export' ? (
          <>
            <p className="data-hint">
              下方为菜谱 JSON 文本,可点击「复制」后粘贴到备忘录/微信发送给他人保存。
            </p>
            <textarea
              id="export-textarea"
              className="data-textarea"
              value={exportText}
              readOnly
              rows={12}
            />
            <div className="sheet-btns">
              <button className="sheet-btn sheet-btn--cancel" onClick={onClose}>关闭</button>
              <button className="sheet-btn sheet-btn--ok" onClick={handleCopy}>
                {copied ? '已复制 ✓' : '复制文本'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="data-hint">
              粘贴菜谱 JSON 文本后点「确认导入」,将覆盖当前 {dishCount} 道菜谱。
            </p>
            <textarea
              className="data-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={'在此粘贴 JSON 文本...\n\n[\n  { "name": "番茄炒蛋", ... }\n]'}
              rows={12}
              autoFocus
            />
            {result && (
              <div className={`data-result ${result.ok ? 'ok' : 'err'}`} role="status">
                {result.ok ? '✓ ' : '⚠ '}{result.msg}
              </div>
            )}
            <div className="sheet-btns">
              <button className="sheet-btn sheet-btn--cancel" onClick={onClose}>关闭</button>
              <button className="sheet-btn sheet-btn--ok" onClick={handleImport}>
                确认导入
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
