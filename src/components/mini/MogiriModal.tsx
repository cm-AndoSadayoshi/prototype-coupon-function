'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, AlertCircle, X } from 'lucide-react';

interface MogiriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  couponTitle: string;
  isLoading?: boolean;
}

export function MogiriModal({
  isOpen,
  onClose,
  onConfirm,
  couponTitle,
  isLoading = false,
}: MogiriModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors z-10"
                aria-label="閉じる"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>

              {/* モーダルヘッダー */}
              <div className="bg-beams-50 px-6 py-5 border-b border-beams-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-beams-500 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      使用確認
                    </h3>
                    <p className="text-sm text-neutral-600">
                      スタッフに画面をお見せください
                    </p>
                  </div>
                </div>
              </div>

              {/* モーダルボディ */}
              <div className="px-6 py-6 space-y-4">
                <p className="text-base text-neutral-700 leading-relaxed">
                  <span className="font-semibold">「{couponTitle}」</span>
                  <br />
                  このクーポンを使用しますか？
                </p>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">
                      一度使用すると元に戻せません
                    </p>
                  </div>
                </div>
              </div>

              {/* モーダルフッター */}
              <div className="px-4 pb-4 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="
                    flex-1 px-6 py-3.5 rounded-xl
                    bg-white border-2 border-neutral-200
                    text-neutral-900 font-semibold text-base
                    hover:bg-neutral-50 active:bg-neutral-100
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  キャンセル
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="
                    flex-1 px-6 py-3.5 rounded-xl
                    bg-beams-500 hover:bg-beams-600 active:bg-beams-700
                    text-white font-bold text-base
                    shadow-beams
                    transition-all duration-200
                    transform active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>処理中...</span>
                    </span>
                  ) : (
                    '使用する'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

