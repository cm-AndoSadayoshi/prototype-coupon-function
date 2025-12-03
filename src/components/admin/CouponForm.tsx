'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Coupon, CouponCreateInput } from '@/types/coupon';
import { CouponSchema, validateImageFile } from '@/lib/utils/validation';

interface CouponFormProps {
  coupon?: Coupon;
  isEdit?: boolean;
}

export function CouponForm({ coupon, isEdit = false }: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    coupon?.imageUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<CouponCreateInput>({
    title: coupon?.title || '',
    description: coupon?.description || '',
    validFrom: coupon?.validFrom
      ? new Date(coupon.validFrom).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    validTo: coupon?.validTo
      ? new Date(coupon.validTo).toISOString().slice(0, 16)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    usageLimit: coupon?.usageLimit || 1,
    isActive: coupon?.isActive ?? true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value, 10)
          : value,
    }));
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, image: validation.error || '' }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // バリデーション
      const validationResult = CouponSchema.safeParse({
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
      });

      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // TODO: 実際のAPI呼び出し
      // 1. 画像アップロード
      // 2. クーポン作成/更新

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/admin/coupons');
    } catch (error) {
      console.error(error);
      setErrors({ submit: '保存に失敗しました。再度お試しください。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/coupons"
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {isEdit ? 'クーポン編集' : '新規クーポン作成'}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              クーポン情報を入力してください
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-beams-500 hover:bg-beams-600 text-white font-semibold px-6 py-3 rounded-lg shadow-beams hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>

      {/* 送信エラー */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* フォーム */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-6 space-y-6">
        {/* クーポンタイトル */}
        <div>
          <label htmlFor="title" className="label">
            クーポンタイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="例: 全品10%OFF"
            className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            maxLength={50}
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
          <p className="helper-text">{formData.title.length}/50文字</p>
        </div>

        {/* 詳細説明 */}
        <div>
          <label htmlFor="description" className="label">
            詳細説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="クーポンの詳細説明を入力してください"
            className={`textarea h-32 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            maxLength={200}
          />
          {errors.description && <p className="error-text">{errors.description}</p>}
          <p className="helper-text">{(formData.description || '').length}/200文字</p>
        </div>

        {/* クーポン画像 */}
        <div>
          <label className="label">クーポン画像</label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full max-w-md aspect-[16/9] rounded-lg overflow-hidden bg-neutral-100">
                <Image
                  src={imagePreview}
                  alt="プレビュー"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md aspect-[16/9] border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-beams-400 hover:bg-beams-50 transition-colors">
                <Upload className="w-10 h-10 text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-600 font-medium">
                  クリックして画像を選択
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  JPG, PNG (最大5MB)
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.image && <p className="error-text">{errors.image}</p>}
          <p className="helper-text">推奨: アパレル商品のビジュアル画像</p>
        </div>

        {/* 有効期間 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="validFrom" className="label">
              開始日時 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="validFrom"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleInputChange}
              className={`input ${
                errors.validFrom ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.validFrom && <p className="error-text">{errors.validFrom}</p>}
          </div>
          <div>
            <label htmlFor="validTo" className="label">
              終了日時 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="validTo"
              name="validTo"
              value={formData.validTo}
              onChange={handleInputChange}
              className={`input ${errors.validTo ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.validTo && <p className="error-text">{errors.validTo}</p>}
          </div>
        </div>

        {/* 利用回数制限 */}
        <div>
          <label htmlFor="usageLimit" className="label">
            利用回数制限 <span className="text-red-500">*</span>
          </label>
          <select
            id="usageLimit"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            className="input"
          >
            <option value={1}>1回のみ</option>
            <option value={0}>無制限</option>
          </select>
        </div>

        {/* 公開設定 */}
        <div>
          <label className="label">公開設定</label>
          <label className="flex items-center gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-5 h-5 rounded border-neutral-300 text-beams-500 focus:ring-beams-500"
            />
            <span className="text-neutral-700">すぐに公開する</span>
          </label>
        </div>
      </div>
    </form>
  );
}

