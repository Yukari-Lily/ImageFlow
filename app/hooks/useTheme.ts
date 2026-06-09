import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  // 初始值必须与服务端一致（false = 亮色），避免 hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 挂载后从 localStorage 读取真实主题
  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        const isDark = savedTheme === 'dark'
        setIsDarkMode(isDark)
        document.documentElement.classList.toggle('dark', isDark)
      }
    } catch (e) {
      // localStorage 不可用
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch (e) {
        console.warn("无法保存主题设置到 localStorage:", e);
      }
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  return { isDarkMode, toggleTheme, mounted }
}
