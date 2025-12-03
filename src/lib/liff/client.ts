'use client';

import type { LineProfile } from '@/types/user';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

// LIFFが設定されているかどうかのフラグ
export const isLiffConfigured = !!LIFF_ID;

let isInitialized = false;
let liffModule: typeof import('@line/liff').default | null = null;

// モックユーザープロファイル
const mockProfile: LineProfile = {
  userId: 'mock-user-id',
  displayName: 'デモユーザー',
  pictureUrl: undefined,
  statusMessage: undefined,
};

export async function initializeLiff(): Promise<LineProfile | null> {
  // LIFF IDが未設定の場合はモックモードで動作
  if (!isLiffConfigured) {
    console.warn('LIFF ID not configured. Running in mock mode.');
    isInitialized = true;
    return mockProfile;
  }

  try {
    // 動的インポートでLIFF SDKを読み込む
    if (!liffModule) {
      liffModule = (await import('@line/liff')).default;
    }

    if (!isInitialized) {
      await liffModule.init({ liffId: LIFF_ID! });
      isInitialized = true;
    }

    if (!liffModule.isLoggedIn()) {
      liffModule.login();
      return null;
    }

    const profile = await liffModule.getProfile();

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('LIFF初期化エラー:', error);
    // エラー時もモックモードで動作させる
    isInitialized = true;
    return mockProfile;
  }
}

export function getLiffIdToken(): string | null {
  if (!isLiffConfigured || !isInitialized || !liffModule) {
    return 'mock-id-token';
  }
  return liffModule.getIDToken();
}

export function isInClient(): boolean {
  if (!isLiffConfigured || !isInitialized || !liffModule) {
    return false;
  }
  return liffModule.isInClient();
}

export function closeLiff(): void {
  if (!isLiffConfigured || !liffModule) {
    console.warn('LIFF not configured. Cannot close window.');
    return;
  }
  if (isInitialized && liffModule.isInClient()) {
    liffModule.closeWindow();
  }
}

export function logout(): void {
  if (!isLiffConfigured || !liffModule) {
    console.warn('LIFF not configured. Simulating logout.');
    window.location.reload();
    return;
  }
  if (isInitialized && liffModule.isLoggedIn()) {
    liffModule.logout();
    window.location.reload();
  }
}

export async function shareMessage(text: string): Promise<void> {
  if (!isLiffConfigured || !liffModule) {
    console.warn('LIFF not configured. Cannot share message.');
    alert(`シェア機能はLIFF環境でのみ利用可能です\n\nメッセージ: ${text}`);
    return;
  }

  if (!isInitialized || !liffModule.isInClient()) {
    throw new Error('LIFFクライアント外では共有できません');
  }

  await liffModule.shareTargetPicker([
    {
      type: 'text',
      text,
    },
  ]);
}
