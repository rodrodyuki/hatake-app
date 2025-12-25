'use client';

import { Post } from '@/types';
import PostCard from './post-card';

interface TodayPostsProps {
  fatherPost: Post | null;
  motherPost: Post | null;
}

export default function TodayPosts({ fatherPost, motherPost }: TodayPostsProps) {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[today.getDay()];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 text-center">
        今日の記録（{month}月{day}日 {weekday}曜日）
      </h2>

      <div className="space-y-3">
        {/* 父の投稿 */}
        {fatherPost ? (
          <PostCard post={fatherPost} />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-6 text-center">
            <p className="text-green-600 font-medium">父の投稿はまだありません</p>
          </div>
        )}

        {/* 母の投稿 */}
        {motherPost ? (
          <PostCard post={motherPost} />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-center">
            <p className="text-orange-600 font-medium">母の投稿はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
