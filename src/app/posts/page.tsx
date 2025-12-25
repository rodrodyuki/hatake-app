'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, PostsByDate } from '@/types';
import Header from '../_components/header';
import PostList from '../_components/post-list';

export default function PostsPage() {
  const [postsByDate, setPostsByDate] = useState<PostsByDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_deleted', false)
      .order('date', { ascending: false })
      .order('author', { ascending: true });

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    // 日付ごとにグループ化
    const grouped: { [key: string]: Post[] } = {};
    (data || []).forEach((post) => {
      if (!grouped[post.date]) {
        grouped[post.date] = [];
      }
      grouped[post.date].push(post);
    });

    // 配列に変換
    const result: PostsByDate[] = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a)) // 新しい日付が上
      .map((date) => ({
        date,
        posts: grouped[date],
      }));

    setPostsByDate(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthorSwitcher={false} />

      <main className="max-w-2xl mx-auto pb-24 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          これまでの記録
        </h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            読み込み中...
          </div>
        ) : (
          <PostList postsByDate={postsByDate} />
        )}
      </main>
    </div>
  );
}
