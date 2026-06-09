import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, ExclamationTriangleIcon } from './ui/icons';

interface DeleteConfirmProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirm = ({ isDeleting, onCancel, onConfirm }: DeleteConfirmProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
            确认删除
          </h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            确定要删除此图片吗？将同时删除所有相关格式，此操作不可撤销。
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
