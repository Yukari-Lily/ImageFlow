import { getApiKey } from "./auth";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const apiKey = getApiKey();

  const { params, ...restOptions } = options;

  // 构建URL
  const url: URL = new URL(endpoint, BASE_URL || window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }
  }

  // 添加认证头
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(url.toString(), {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "请求失败");
  }

  // 处理非 JSON 响应
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {} as T;
}

// 封装常用请求方法
export const api = {
  request,
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, data?: Record<string, unknown>) =>
    request<T>(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
