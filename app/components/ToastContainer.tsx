"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Toast, { ToastType } from "./Toast";

// 创建唯一标识
const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

// 模块级队列，用于在 ToastContainer 挂载前缓存 toast
let toastQueue: ToastItem[] = [];

// 模块级回调引用，StrictMode 安全
let addToastCallbackRef: ((toast: ToastItem) => void) | null = null;

// 添加Toast的全局方法
export const showToast = (message: string, type: ToastType = "success") => {
  const newToast = { id: generateId(), message, type };

  if (addToastCallbackRef) {
    addToastCallbackRef(newToast);
  } else {
    toastQueue.push(newToast);
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 添加Toast的回调 - 使用 ref 保证 StrictMode 下稳定
  const addToastRef = useCallback((toast: ToastItem) => {
    setToasts(prev => [...prev, toast]);
  }, []);

  // 移除Toast
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // 注册回调并处理队列
  useEffect(() => {
    addToastCallbackRef = addToastRef;

    // 处理队列中已有的Toast
    if (toastQueue.length > 0) {
      const pendingToasts = [...toastQueue];
      toastQueue = [];
      pendingToasts.forEach(addToastRef);
    }

    return () => {
      addToastCallbackRef = null;
    };
  }, [addToastRef]);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
