import { getFullUrl } from "./baseUrl";
import { copyToClipboard } from "./clipboard";
import { buildMarkdownLink } from "./imageUtils";
import type { ImageFile } from "../types";

/**
 * 构建HTML图片标签
 */
export const buildHtmlImgTag = (url: string, altText: string): string => {
  return `<img src="${url}" alt="${altText}" />`;
};

/**
 * 复制图片链接（原始格式）
 */
export const copyOriginalUrl = async (image: ImageFile): Promise<boolean> => {
  const url = getFullUrl(image.urls?.original || image.url);
  return copyToClipboard(url);
};

/**
 * 复制图片链接（WebP格式）
 */
export const copyWebpUrl = async (image: ImageFile): Promise<boolean> => {
  const url = getFullUrl(image.urls?.webp || "");
  return copyToClipboard(url);
};

/**
 * 复制图片链接（AVIF格式）
 */
export const copyAvifUrl = async (image: ImageFile): Promise<boolean> => {
  const url = getFullUrl(image.urls?.avif || "");
  return copyToClipboard(url);
};

/**
 * 复制Markdown格式的图片链接
 */
export const copyMarkdownLink = async (image: ImageFile): Promise<boolean> => {
  // 优先使用WebP链接
  const url = getFullUrl(image.urls?.webp || image.urls?.original || image.url);
  const markdown = buildMarkdownLink(url, image.filename);
  return copyToClipboard(markdown);
};

/**
 * 复制HTML格式的图片标签
 */
export const copyHtmlImgTag = async (image: ImageFile): Promise<boolean> => {
  // 优先使用WebP链接
  const url = getFullUrl(image.urls?.webp || image.urls?.original || image.url);
  const html = buildHtmlImgTag(url, image.filename);
  return copyToClipboard(html);
};
