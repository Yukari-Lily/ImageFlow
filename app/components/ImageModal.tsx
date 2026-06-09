"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageFile } from "../types";
import { ImageData } from "../types/image";
import { ImageInfo } from "./ImageInfo";
import { ImageUrls } from "./ImageUrls";
import { DeleteConfirm } from "./DeleteConfirm";
import { getFullUrl } from "../utils/baseUrl";
import ImageLightbox from "./ImageLightbox";
import { Cross1Icon, TrashIcon, InfoCircledIcon, Link1Icon, CameraIcon } from "./ui/icons";

// 统一的图片类型，可以接受管理界面和上传界面的两种不同图片对象
type ImageType = ImageFile | (ImageData & { status: 'success' });

interface ImageModalProps {
  image: ImageType | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export default function ImageModal({ image, isOpen, onClose, onDelete }: ImageModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      setShowLightbox(false);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDelete = async () => {
    if (!image || !onDelete || !image.id) return;

    try {
      setIsDeleting(true);
      await onDelete(image.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("删除失败:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!image) return null;

  // 判断是否有可删除的功能
  const canDelete = onDelete && image.id;

  // 获取图片 URL
  const isImageFile = 'url' in image;
  const imageUrl = getFullUrl(
    isImageFile
      ? (image as ImageFile).urls?.original || (image as ImageFile).url
      : (image as ImageData).urls?.original || ''
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题栏 */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CameraIcon className="h-5 w-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{image.filename}</h3>
                  </div>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <Cross1Icon className="h-5 w-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
                {/* 图片预览区域 */}
                <div
                  className="cursor-zoom-in bg-gray-100 dark:bg-gray-800"
                  onClick={() => setShowLightbox(true)}
                >
                  <div className="aspect-video flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={image.filename}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 详细信息区域 */}
                <div className="p-6 space-y-6">
                  {/* 可用链接 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Link1Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">可用链接</h4>
                    </div>
                    <ImageUrls image={image} />
                  </div>

                  {/* 图片信息 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <InfoCircledIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">图片信息</h4>
                    </div>
                    <ImageInfo image={image} />
                  </div>
                </div>
              </div>

              {/* 底部操作区域 */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-2 inline" />
                    删除图片
                  </button>
                )}

                {!canDelete && <div />}

                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <DeleteConfirm
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* 图片灯箱 */}
      <ImageLightbox
        src={imageUrl}
        alt={image.filename}
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
      />
    </>
  );
}