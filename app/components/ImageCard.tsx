"use client";

import Image from "next/image";
import { useState, useCallback, useRef, memo } from "react";
import { ImageFile } from "../types";
import { getFullUrl } from "../utils/baseUrl";
import { LoadingSpinner } from "./LoadingSpinner";
import { getFormatLabel, getOrientationLabel, formatFileSize } from "../utils/imageUtils";
import ContextMenu, { ContextMenuGroup } from "./ContextMenu";
import { showToast } from "./ToastContainer";
import {
  copyOriginalUrl,
  copyWebpUrl,
  copyAvifUrl,
  copyMarkdownLink,
  copyHtmlImgTag,
} from "../utils/copyImageUtils";
import { copyToClipboard } from "../utils/clipboard";
import { 
  ClipboardCopyIcon, 
  EyeOpenIcon, 
  TrashIcon,
  FileIcon,
  CheckIcon,
  Cross1Icon,
  CopyIcon
} from './ui/icons';

const ImageCard = memo(function ImageCard({
  image,
  onClick,
  onDelete,
}: {
  image: ImageFile;
  onClick: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isGif = image.format.toLowerCase() === "gif";
  const cardRef = useRef<HTMLDivElement>(null);

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // 根据方向确定高度类和比例
  const getHeightAndAspectRatio = (orientation: string) => {
    switch (orientation.toLowerCase()) {
      case "portrait":
        return {
          heightClass: "h-auto",
          aspectRatio: "aspect-[3/4]",
        };
      case "landscape":
        return {
          heightClass: "h-auto",
          aspectRatio: "aspect-[4/3]",
        };
      case "square":
        return {
          heightClass: "h-auto",
          aspectRatio: "aspect-square",
        };
      default:
        return {
          heightClass: "h-auto",
          aspectRatio: "aspect-auto",
        };
    }
  };

  const { heightClass, aspectRatio } = getHeightAndAspectRatio(
    image.orientation
  );

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      isOpen: false,
    });
  };

  // 复制回调
  const handleCopy = async (type: string) => {
    try {
      let success = false;

      switch (type) {
        case "original":
          success = await copyOriginalUrl(image);
          break;
        case "webp":
          success = await copyWebpUrl(image);
          break;
        case "avif":
          success = await copyAvifUrl(image);
          break;
        case "markdown":
          success = await copyMarkdownLink(image);
          break;
        case "html":
          success = await copyHtmlImgTag(image);
          break;
      }

      if (success) {
        showToast("复制成功", "success");
      } else {
        showToast("复制失败", "error");
      }
    } catch (error) {
      showToast("复制失败", "error");
      console.error("复制错误:", error);
    }
  };

  // 删除图片
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDelete(image.id);
      showToast("图片已删除", "success");
    } catch (error) {
      showToast("删除失败", "error");
      console.error("删除失败:", error);
    }
  };

  // 右键菜单项
  const menuGroups: ContextMenuGroup[] = [
    {
      id: "copy",
      items: [
        {
          id: "copy-original",
          label: `复制原始链接 (${image.format.toUpperCase()})`,
          onClick: () => handleCopy("original"),
          icon: <ClipboardCopyIcon className="h-4 w-4" />,
        },
        {
          id: "copy-webp",
          label: "复制WebP链接",
          onClick: () => handleCopy("webp"),
          icon: <ClipboardCopyIcon className="h-4 w-4" />,
          disabled: !image.urls?.webp,
        },
        {
          id: "copy-avif",
          label: "复制AVIF链接",
          onClick: () => handleCopy("avif"),
          icon: <ClipboardCopyIcon className="h-4 w-4" />,
          disabled: !image.urls?.avif,
        },
      ],
    },
    {
      id: "format",
      items: [
        {
          id: "copy-markdown",
          label: "复制Markdown标签",
          onClick: () => handleCopy("markdown"),
          icon: <FileIcon className="h-4 w-4" />,
        },
        {
          id: "copy-html",
          label: "复制HTML标签",
          onClick: () => handleCopy("html"),
          icon: <FileIcon className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "actions",
      items: [
        {
          id: "preview",
          label: "预览图片",
          onClick: onClick,
          icon: <EyeOpenIcon className="h-4 w-4" />,
        },
        {
          id: "delete",
          label: "删除图片",
          onClick: handleDelete,
          danger: true,
          icon: <TrashIcon className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <>
      <div
        ref={cardRef}
        className="rounded-xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl h-full will-change-transform"
        style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out' }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <div
          className={`relative ${heightClass} ${aspectRatio} overflow-hidden bg-gray-100 dark:bg-gray-900 w-full`}
        >
          {isGif ? (
            <img
              src={getFullUrl(image.url)}
              alt={image.filename}
              onLoad={handleImageLoad}
              className={`w-full h-full object-cover transition-opacity duration-200 will-change-transform ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease-out' }}
            />
          ) : (
            <Image
              src={getFullUrl(image.urls?.webp || image.url)}
              alt={image.filename}
              fill
              loading="lazy"
              onLoad={handleImageLoad}
              className={`object-cover w-full h-full transition-opacity duration-200 will-change-transform ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease-out' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
            />
          )}

          {isLoading && <LoadingSpinner />}

          {/* Image info overlay */}
          <div
            className={`absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent text-white transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex space-x-1">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                  isGif ? "bg-green-500/70" : "bg-blue-500/70"
                }`}
              >
                {getFormatLabel(image.format)}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/70 backdrop-blur-sm">
                {getOrientationLabel(image.orientation)}
              </span>
            </div>

            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const success = await copyToClipboard(getFullUrl(image.urls?.webp || image.url));
                  setCopyStatus(success ? "copied" : "error");
                  setTimeout(() => setCopyStatus("idle"), 2000);
                } catch {
                  setCopyStatus("error");
                  setTimeout(() => setCopyStatus("idle"), 2000);
                }
              }}
              className={`p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              title="复制URL"
            >
              {copyStatus === "idle" && (
                <CopyIcon className="h-4 w-4" />
              )}
              {copyStatus === "copied" && (
                <CheckIcon className="h-4 w-4 text-green-400" />
              )}
              {copyStatus === "error" && (
                <Cross1Icon className="h-4 w-4 text-red-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 右键菜单 */}
      <ContextMenu
        items={menuGroups}
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
      />
    </>
  );
});

export default ImageCard;
