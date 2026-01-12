/**
 * 轻量级全局 Toast 提示工具
 * 解决 Vant Toast 在部分环境下样式丢失的问题
 */
export function showToast(message: string, duration = 2000) {
  // 1. 移除旧的 toast（防止重叠）
  const oldToast = document.getElementById('global-custom-toast')
  if (oldToast) oldToast.remove()

  // 2. 创建 DOM 元素
  const div = document.createElement('div')
  div.id = 'global-custom-toast'
  div.innerText = message
  
  // 3. 设置样式
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 99999;
    max-width: 80%;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events: none; /* 允许点击穿透 */
    animation: fadeIn 0.3s ease;
  `

  // 4. 添加动画样式
  const style = document.createElement('style')
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, -40%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
  `
  document.head.appendChild(style)

  // 5. 插入页面
  document.body.appendChild(div)

  // 6. 自动销毁
  setTimeout(() => {
    div.style.opacity = '0'
    div.style.transition = 'opacity 0.3s ease'
    setTimeout(() => {
      div.remove()
      style.remove()
    }, 300)
  }, duration)
}

