export interface User {
  id: string; // LINE User ID
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
}

