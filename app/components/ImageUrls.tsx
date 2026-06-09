import { useState, useCallback } from "react";
import { ImageFile } from "../types";
import { ImageData } from "../types/image";
import { buildMarkdownLink } from "../utils/imageUtils";
import { copyToClipboard } from "../utils/clipboard";
import { getFullUrl } from "../utils/baseUrl";
import { CheckIcon, CopyIcon, CameraIcon, SparklesIcon, ZapIcon, CodeIcon } from "./ui/icons";

type ImageType = ImageFile | (ImageData & { status: 'success' });

// 复制按钮组件
const CopyButton = ({ type, text, copied, onCopy }: {
  type: string;
  text: string;
  copied: boolean;
  onCopy: (text: string, type: string, e?: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <button
    type="button"
    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-r-lg px-2 py-1 flex items-center justify-center"
    onClick={(e) => onCopy(text, type, e)}
    aria-label="复制链接"
  >
    {copied ? (
      <CheckIcon className="h-3 w-3" />
    ) : (
      <CopyIcon className="h-3 w-3" />
    )}
  </button>
);

// URL 展示框组件
const UrlBox = ({ icon, label, url, type, color, copied, onCopy }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url: string;
  type: string;
  color: string;
  copied: boolean;
  onCopy: (text: string, type: string, e?: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const IconComponent = icon;
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className={`h-4 w-4 ${color}`} />
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
      </div>
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center relative">
        <div className="flex-1 px-2 py-1 text-xs font-mono overflow-hidden text-ellipsis">
          {url}
        </div>
        <CopyButton type={type} text={url} copied={copied} onCopy={onCopy} />
      </div>
    </div>
  );
};

interface ImageUrlsProps {
  image: ImageType;
}

export const ImageUrls = ({ image }: ImageUrlsProps) => {
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const handleCopy = useCallback((
    text: string,
    type: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.stopPropagation();

    copyToClipboard(text)
      .then((success) => {
        if (success) {
          setCopyStates(prev => ({ ...prev, [type]: true }));
          setTimeout(() => {
            setCopyStates(prev => ({ ...prev, [type]: false }));
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("复制失败:", err);
      });
  }, []);

  // 判断图片类型
  const isImageFile = 'url' in image;

  // 获取URL
  const originalUrl = getFullUrl(image.urls?.original || (isImageFile ? (image as ImageFile).url : ""));
  const webpUrl = getFullUrl(image.urls?.webp || "");
  const avifUrl = getFullUrl(image.urls?.avif || "");

  // 获取当前格式
  const format = (image.format || "").toLowerCase();

  const currentFormatUrl =
    format === "webp"
      ? webpUrl
      : format === "avif"
      ? avifUrl
      : originalUrl;

  const markdownLink = buildMarkdownLink(currentFormatUrl!, image.filename);

  return (
    <div className="space-y-1">
      {/* 原始格式链接 */}
      <UrlBox
        icon={CameraIcon}
        color="text-blue-500"
        label={format === "gif" ? "GIF 动图" : "原始格式"}
        url={originalUrl!}
        type="original"
        copied={copyStates["original"]}
        onCopy={handleCopy}
      />

      {/* 仅在非GIF图片时显示WebP和AVIF格式 */}
      {format !== "gif" && (
        <>
          <UrlBox
            icon={SparklesIcon}
            color="text-purple-500"
            label="WebP格式"
            url={webpUrl!}
            type="webp"
            copied={copyStates["webp"]}
            onCopy={handleCopy}
          />
          <UrlBox
            icon={ZapIcon}
            color="text-green-500"
            label="AVIF格式"
            url={avifUrl!}
            type="avif"
            copied={copyStates["avif"]}
            onCopy={handleCopy}
          />
        </>
      )}

      {/* Markdown格式链接 */}
      <UrlBox
        icon={CodeIcon}
        color="text-amber-500"
        label="Markdown格式"
        url={markdownLink}
        type="markdown"
        copied={copyStates["markdown"]}
        onCopy={handleCopy}
      />
    </div>
  );
};
