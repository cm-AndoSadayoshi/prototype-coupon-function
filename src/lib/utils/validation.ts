import { z } from 'zod';

// クーポン作成・更新のバリデーションスキーマ
export const CouponSchema = z
  .object({
    title: z
      .string()
      .min(1, 'タイトルは必須です')
      .max(50, 'タイトルは50文字以内で入力してください'),
    description: z
      .string()
      .max(200, '説明文は200文字以内で入力してください')
      .optional()
      .nullable(),
    validFrom: z.string().datetime('有効な日時形式で入力してください'),
    validTo: z.string().datetime('有効な日時形式で入力してください'),
    usageLimit: z
      .number()
      .int('整数で入力してください')
      .min(1, '利用回数は1以上を指定してください'),
    isActive: z.boolean(),
  })
  .refine((data) => new Date(data.validFrom) < new Date(data.validTo), {
    message: '有効期間の終了日は開始日より後である必要があります',
    path: ['validTo'],
  });

// クーポン使用のバリデーションスキーマ
export const CouponUsageSchema = z.object({
  userId: z.string().min(1, 'ユーザーIDは必須です'),
  couponId: z.string().uuid('無効なクーポンIDです'),
  confirmUsage: z.boolean().refine((val) => val === true, {
    message: '使用確認が必要です',
  }),
});

// ユーザー登録のバリデーションスキーマ
export const UserRegisterSchema = z.object({
  lineUserId: z.string().min(1, 'LINE User IDは必須です'),
  displayName: z.string().optional().nullable(),
  avatarUrl: z.string().url('有効なURLを入力してください').optional().nullable(),
});

// 管理者ログインのバリデーションスキーマ
export const AdminLoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
});

// 画像アップロードのバリデーション
export const ImageUploadSchema = z.object({
  file: z.custom<File>((v) => v instanceof File, {
    message: 'ファイルが必要です',
  }),
});

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'JPEG、PNG、WebP形式の画像のみアップロードできます',
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: '画像サイズは5MB以下にしてください',
    };
  }

  return { valid: true };
}

// バリデーションエラーのフォーマット
export function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      errors[err.path.join('.')] = err.message;
    }
  });
  return errors;
}

