'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthorSwitcher from './author-switcher';
import FontSizeSwitcher from './font-size-switcher';
import { Author } from '@/types';

interface HeaderProps {
  onAuthorChange?: (author: Author) => void;
  showAuthorSwitcher?: boolean;
}

export default function Header({ onAuthorChange, showAuthorSwitcher = true }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto">
        {/* アプリタイトル */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            🌱 夫婦畑日記
          </Link>
          <FontSizeSwitcher />
        </div>

        {/* 投稿者切替（トップページのみ表示） */}
        {showAuthorSwitcher && (
          <div className="border-b">
            <AuthorSwitcher onAuthorChange={onAuthorChange} />
          </div>
        )}

        {/* ナビゲーション */}
        <nav className="flex">
          <Link
            href="/"
            className={`flex-1 py-3 text-center font-bold transition-colors ${
              pathname === '/'
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            今日
          </Link>
          <Link
            href="/posts"
            className={`flex-1 py-3 text-center font-bold transition-colors ${
              pathname === '/posts'
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            一覧
          </Link>
          <Link
            href="/calendar"
            className={`flex-1 py-3 text-center font-bold transition-colors ${
              pathname === '/calendar'
                ? 'text-green-700 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            カレンダー
          </Link>
        </nav>
      </div>
    </header>
  );
}
