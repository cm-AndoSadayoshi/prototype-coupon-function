/**
 * 日付をフォーマットする
 * @param dateString ISO 8601形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 日付を短い形式でフォーマットする
 * @param dateString ISO 8601形式の日付文字列
 * @returns フォーマットされた日付文字列 (YYYY/MM/DD)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 日時をフォーマットする
 * @param dateString ISO 8601形式の日付文字列
 * @returns フォーマットされた日時文字列
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 時刻のみをフォーマットする
 * @param dateString ISO 8601形式の日付文字列
 * @returns フォーマットされた時刻文字列 (HH:mm)
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 日付が有効期限内かどうかを判定する
 * @param validFrom 開始日
 * @param validTo 終了日
 * @returns 有効期限内ならtrue
 */
export function isWithinValidPeriod(validFrom: string, validTo: string): boolean {
  const now = new Date();
  const from = new Date(validFrom);
  const to = new Date(validTo);
  return now >= from && now <= to;
}

/**
 * 有効期限切れかどうかを判定する
 * @param validTo 終了日
 * @returns 有効期限切れならtrue
 */
export function isExpired(validTo: string): boolean {
  const now = new Date();
  const to = new Date(validTo);
  return now > to;
}

/**
 * 相対的な時間表示を返す（例: 3分前、1時間前）
 * @param dateString ISO 8601形式の日付文字列
 * @returns 相対的な時間文字列
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'たった今';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return formatDateShort(dateString);
  }
}

/**
 * 残り日数を計算する
 * @param validTo 終了日
 * @returns 残り日数（負の値は期限切れ）
 */
export function getDaysRemaining(validTo: string): number {
  const now = new Date();
  const to = new Date(validTo);
  const diffMs = to.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

