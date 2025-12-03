'use client';

import { motion } from 'framer-motion';
import { Check, Ticket } from 'lucide-react';
import Image from 'next/image';

interface MogiriAnimationProps {
  couponImage?: string | null;
  onComplete: () => void;
}

export function MogiriAnimation({ couponImage, onComplete }: MogiriAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8"
    >
      {/* 破れるチケットアニメーション */}
      <div className="relative w-full max-w-xs aspect-[3/4] mb-8">
        {/* 左半分 */}
        <motion.div
          initial={{ x: 0, rotate: 0 }}
          animate={{ x: -100, rotate: -15, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 overflow-hidden"
        >
          <div
            className="w-[200%] h-full bg-gradient-to-br from-beams-50 to-beams-100 flex items-center justify-center"
            style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            {couponImage ? (
              <Image
                src={couponImage}
                alt="クーポン"
                fill
                className="object-cover"
              />
            ) : (
              <Ticket className="w-20 h-20 text-beams-300" />
            )}
          </div>
        </motion.div>

        {/* 右半分 */}
        <motion.div
          initial={{ x: 0, rotate: 0 }}
          animate={{ x: 100, rotate: 15, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 left-1/2 w-1/2 overflow-hidden"
        >
          <div
            className="w-[200%] h-full bg-gradient-to-br from-beams-50 to-beams-100 -ml-full flex items-center justify-center"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            {couponImage ? (
              <Image
                src={couponImage}
                alt="クーポン"
                fill
                className="object-cover -ml-full"
              />
            ) : (
              <Ticket className="w-20 h-20 text-beams-300 -ml-full" />
            )}
          </div>
        </motion.div>

        {/* 使用済みスタンプ */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3, type: 'spring', stiffness: 200 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-beams-500 rounded-full p-6 shadow-2xl shadow-beams-500/30">
            <Check className="w-16 h-16 text-white stroke-[3]" />
          </div>
        </motion.div>
      </div>

      {/* テキスト */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center space-y-2"
      >
        <p className="text-3xl font-bold text-beams-500">使用完了！</p>
        <p className="text-sm text-neutral-500">
          クーポンをご利用いただきありがとうございます
        </p>
      </motion.div>

      {/* 紙吹雪エフェクト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              delay: Math.random() * 0.5,
              ease: 'linear',
            }}
            className={`
              absolute w-3 h-3 rounded-sm
              ${i % 3 === 0 ? 'bg-beams-500' : i % 3 === 1 ? 'bg-beams-300' : 'bg-beams-100'}
            `}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

