'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import Image from 'next/image';
import type { UsageLog } from '@/types/api';
import { formatTime, getRelativeTime } from '@/lib/utils/date';

interface RealtimeUsageLogProps {
  logs: UsageLog[];
}

export function RealtimeUsageLog({ logs }: RealtimeUsageLogProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">最近の使用履歴</h3>
          <span className="text-sm text-neutral-500">リアルタイム更新中</span>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-neutral-500">まだ使用履歴がありません</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <UsageLogRow key={log.id} log={log} isNew={index === 0} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface UsageLogRowProps {
  log: UsageLog;
  isNew?: boolean;
}

function UsageLogRow({ log, isNew }: UsageLogRowProps) {
  return (
    <motion.div
      initial={isNew ? { backgroundColor: 'rgb(255 237 213)' } : {}}
      animate={{ backgroundColor: 'rgb(255 255 255)' }}
      transition={{ duration: 2 }}
      className="px-6 py-4 hover:bg-beams-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-6">
        {/* 時刻 */}
        <span className="text-sm font-mono text-neutral-500 w-16">
          {formatTime(log.usedAt)}
        </span>

        {/* アバター */}
        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
          {log.user.avatarUrl ? (
            <Image
              src={log.user.avatarUrl}
              alt={log.user.displayName || 'ユーザー'}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-neutral-600" />
          )}
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 truncate">
            {log.user.displayName || '名前なし'}さん
          </p>
          <p className="text-sm text-neutral-600 truncate">{log.coupon.title}</p>
        </div>

        {/* 相対時間 */}
        <span className="text-sm text-neutral-400">{getRelativeTime(log.usedAt)}</span>

        {/* NEWバッジ */}
        {isNew && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-beams-500 text-white text-xs font-bold rounded-full"
          >
            NEW
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

