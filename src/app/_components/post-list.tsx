'use client';

import { Post, PostsByDate } from '@/types';
import PostCard from './post-card';

interface PostListProps {
  postsByDate: PostsByDate[];
}

export default function PostList({ postsByDate }: PostListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日（${weekday}）`;
  };

  if (postsByDate.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl mb-2">📝</p>
        <p>まだ投稿がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {postsByDate.map((group) => (
        <div key={group.date} className="space-y-3">
          {/* 日付ヘッダー */}
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <h2 className="font-bold text-gray-700">{formatDate(group.date)}</h2>
          </div>

          {/* その日の投稿 */}
          <div className="space-y-3 px-2">
            {group.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
