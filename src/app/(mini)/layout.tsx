import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JAMES クーポン',
  description: 'JAMESのお得なクーポンをチェック',
};

export default function MiniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  );
}

