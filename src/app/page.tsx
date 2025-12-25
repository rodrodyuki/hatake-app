'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Author, Post } from '@/types';
import Header from './_components/header';
import PostForm from './_components/post-form';
import TodayPosts from './_components/today-posts';

export default function Home() {
  const [author, setAuthor] = useState<Author>('father');
  const [fatherPost, setFatherPost] = useState<Post | null>(null);
  const [motherPost, setMotherPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayPosts = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('date', today)
        .eq('is_deleted', false);

      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError('データの取得に失敗しました');
        setLoading(false);
        return;
      }

      const father = data?.find(p => p.author === 'father') || null;
      const mother = data?.find(p => p.author === 'mother') || null;
      
      setFatherPost(father);
      setMotherPost(mother);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('接続に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // localStorageから投稿者を復元
    const saved = localStorage.getItem('selectedAuthor') as Author | null;
    if (saved && (saved === 'father' || saved === 'mother')) {
      setAuthor(saved);
    }
    
    fetchTodayPosts();
  }, [fetchTodayPosts]);

  const handleAuthorChange = (newAuthor: Author) => {
    setAuthor(newAuthor);
  };

  const handlePostSaved = () => {
    fetchTodayPosts();
    setShowForm(false);
  };

  const currentPost = author === 'father' ? fatherPost : motherPost;
  const hasPosted = currentPost !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthorChange={handleAuthorChange} />

      <main className="max-w-2xl mx-auto pb-24">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            読み込み中...
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-medium mb-4">{error}</p>
              <p className="text-gray-600 text-sm">
                Supabaseの設定を確認してください
              </p>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchTodayPosts();
                }}
                className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold"
              >
                再試行
              </button>
            </div>
            
            {/* エラー時でも投稿フォームは表示（オフライン対応の準備） */}
            <div className="mt-4">
              <TodayPosts fatherPost={fatherPost} motherPost={motherPost} />
            </div>
          </div>
        ) : (
          <>
            {/* 今日の投稿表示 */}
            <TodayPosts fatherPost={fatherPost} motherPost={motherPost} />

            {/* 投稿ボタン or フォーム */}
            {showForm ? (
              <div className="border-t-2 border-gray-200 mt-4">
                <PostForm
                  author={author}
                  existingPost={currentPost}
                  onPostSaved={handlePostSaved}
                />
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full py-3 bg-gray-200 text-gray-600 rounded-xl font-bold"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <button
                  onClick={() => setShowForm(true)}
                  className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-lg transition-all active:scale-95 ${
                    author === 'father'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {hasPosted ? '✏️ 編集する' : '📝 今日の記録をつける'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
