'use client';

import { useState, useEffect } from 'react';
import { FontSize } from '@/types';

const fontSizeConfig: Record<FontSize, { label: string; class: string }> = {
  small: { label: '小', class: 'text-sm' },
  medium: { label: '標準', class: 'text-base' },
  large: { label: '大', class: 'text-lg' },
};

export default function FontSizeSwitcher() {
  const [fontSize, setFontSize] = useState<FontSize>('large');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('fontSize') as FontSize | null;
    if (saved && (saved === 'small' || saved === 'medium' || saved === 'large')) {
      setFontSize(saved);
      applyFontSize(saved);
    } else {
      // デフォルトは「大」
      applyFontSize('large');
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const html = document.documentElement;
    // 既存のフォントサイズクラスを削除
    html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    // 新しいフォントサイズクラスを追加
    html.classList.add(`font-size-${size}`);
  };

  const handleChange = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    applyFontSize(newSize);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <span className="text-gray-600 font-medium mr-2">文字</span>
      {(Object.keys(fontSizeConfig) as FontSize[]).map((size) => (
        <button
          key={size}
          onClick={() => handleChange(size)}
          className={`py-2 px-4 rounded-lg font-bold transition-all duration-200 ${
            fontSize === size
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          aria-pressed={fontSize === size}
        >
          {fontSizeConfig[size].label}
        </button>
      ))}
    </div>
  );
}
