'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageLightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 重置
  const reset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // ESC 关闭
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey, { capture: true })
    return () => document.removeEventListener('keydown', onKey, { capture: true })
  }, [isOpen, onClose])

  // 打开时重置
  useEffect(() => {
    if (isOpen) {
      reset()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, reset])

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setScale(prev => {
      const next = e.deltaY < 0 ? prev * 1.2 : prev / 1.2
      return Math.min(Math.max(next, 0.5), 8)
    })
  }, [])

  // 鼠标按下
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    isDragging.current = true
    hasMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [position])

  // 鼠标移动
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved.current = true
    }
    setPosition({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy
    })
  }, [])

  // 鼠标松开
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // 点击关闭（只有未拖动时才触发）
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!hasMoved.current) {
      onClose()
    }
  }, [onClose])

  // 双击重置
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (scale !== 1) {
      reset()
    } else {
      setScale(2.5)
    }
  }, [scale, reset])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/95 select-none"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={src}
            alt={alt}
            className="absolute top-1/2 left-1/2 max-w-[95vw] max-h-[95vh] object-contain pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
              willChange: 'transform'
            }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
