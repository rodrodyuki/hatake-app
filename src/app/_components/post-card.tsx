'use client';

import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  showDate?: boolean;
}

export default function PostCard({ post, showDate = false }: PostCardProps) {
  const authorLabel = post.author === 'father' ? '父' : '母';
  const isFather = post.author === 'father';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日（${weekday}）`;
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-md ${
        isFather ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
      }`}
    >
      {/* ヘッダー */}
      <div
        className={`px-4 py-2 flex items-center justify-between ${
          isFather ? 'bg-green-600' : 'bg-orange-500'
        }`}
      >
        <span className="text-white font-bold text-lg">{authorLabel}</span>
        {showDate && (
          <span className="text-white text-sm">{formatDate(post.date)}</span>
        )}
      </div>

      {/* 画像 */}
      {post.image_url && (
        <div className="w-full">
          <img
            src={post.image_url}
            alt={`${authorLabel}の投稿画像`}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* コメント */}
      <div className="p-4">
        {post.comment ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.comment}
          </p>
        ) : (
          <p className="text-gray-400 italic">コメントなし</p>
        )}
      </div>
    </div>
  );
}
