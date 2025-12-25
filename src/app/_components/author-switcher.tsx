'use client';

import { useState, useEffect } from 'react';
import { Author } from '@/types';

interface AuthorSwitcherProps {
  onAuthorChange?: (author: Author) => void;
}

export default function AuthorSwitcher({ onAuthorChange }: AuthorSwitcherProps) {
  const [author, setAuthor] = useState<Author>('father');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('selectedAuthor') as Author | null;
    if (saved && (saved === 'father' || saved === 'mother')) {
      setAuthor(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('selectedAuthor', author);
      onAuthorChange?.(author);
    }
  }, [author, mounted, onAuthorChange]);

  const handleSwitch = (newAuthor: Author) => {
    setAuthor(newAuthor);
  };

  if (!mounted) {
    return (
      <div className="flex gap-2 p-2">
        <div className="flex-1 py-4 px-6 rounded-xl bg-gray-200 text-center text-xl font-bold">
          父
        </div>
        <div className="flex-1 py-4 px-6 rounded-xl bg-gray-200 text-center text-xl font-bold">
          母
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={() => handleSwitch('father')}
        className={`flex-1 py-4 px-6 rounded-xl text-xl font-bold transition-all duration-200 ${
          author === 'father'
            ? 'bg-green-600 text-white shadow-lg scale-105'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        aria-pressed={author === 'father'}
      >
        父
      </button>
      <button
        onClick={() => handleSwitch('mother')}
        className={`flex-1 py-4 px-6 rounded-xl text-xl font-bold transition-all duration-200 ${
          author === 'mother'
            ? 'bg-orange-500 text-white shadow-lg scale-105'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        aria-pressed={author === 'mother'}
      >
        母
      </button>
    </div>
  );
}
