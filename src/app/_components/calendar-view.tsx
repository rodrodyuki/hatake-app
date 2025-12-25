'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import PostCard from './post-card';

interface CalendarDay {
  date: Date | null;
  posts: Post[];
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const generateCalendarDays = useCallback((data: Post[] | null) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: CalendarDay[] = [];
    
    // 月の最初の日の曜日を取得（0=日曜日）
    const firstDayOfWeek = firstDay.getDay();
    
    // 前月の空白を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, posts: [] });
    }
    
    // 月の日数分のデータを追加
    const daysInMonth = lastDay.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const postsForDay = (data || []).filter(p => p.date === dateStr);
      days.push({ date, posts: postsForDay });
    }

    return days;
  }, [year, month]);

  const fetchMonthPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 月の最初と最後の日を取得
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0);
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('is_deleted', false)
        .order('date', { ascending: true });

      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError('データの取得に失敗しました');
        // エラー時でもカレンダーは表示
        setCalendarDays(generateCalendarDays(null));
      } else {
        setCalendarDays(generateCalendarDays(data));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('接続に失敗しました');
      setCalendarDays(generateCalendarDays(null));
    } finally {
      setLoading(false);
    }
  }, [year, month, generateCalendarDays]);

  useEffect(() => {
    fetchMonthPosts();
  }, [fetchMonthPosts]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedPosts([]);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedPosts([]);
  };

  const handleDayClick = (day: CalendarDay) => {
    if (!day.date || day.posts.length === 0) return;
    
    const dateStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setSelectedPosts([]);
    } else {
      setSelectedDate(dateStr);
      setSelectedPosts(day.posts);
    }
  };

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="p-4">
      {/* 月切替ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-3 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300 transition-colors"
          aria-label="前の月"
        >
          ◀
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {year}年{month + 1}月
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-3 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300 transition-colors"
          aria-label="次の月"
        >
          ▶
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-yellow-800 text-sm">
          {error}
        </div>
      )}

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 font-bold ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day.date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
            const hasFather = day.posts.some(p => p.author === 'father');
            const hasMother = day.posts.some(p => p.author === 'mother');
            const isSelected = selectedDate === dateStr;
            const dayOfWeek = day.date.getDay();

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                disabled={day.posts.length === 0}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : day.posts.length > 0
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-white'
                } ${day.posts.length === 0 ? 'opacity-50' : ''}`}
              >
                <span
                  className={`font-bold ${
                    isSelected
                      ? 'text-white'
                      : dayOfWeek === 0
                      ? 'text-red-500'
                      : dayOfWeek === 6
                      ? 'text-blue-500'
                      : 'text-gray-800'
                  }`}
                >
                  {day.date.getDate()}
                </span>
                {/* 投稿インジケーター */}
                {day.posts.length > 0 && !isSelected && (
                  <div className="flex gap-1 mt-1">
                    {hasFather && (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                    {hasMother && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 凡例 */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>父</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span>母</span>
        </div>
      </div>

      {/* 選択した日の投稿表示 */}
      {selectedDate && selectedPosts.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-gray-700 border-b pb-2">
            {new Date(selectedDate).getMonth() + 1}月
            {new Date(selectedDate).getDate()}日の投稿
          </h3>
          {selectedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
