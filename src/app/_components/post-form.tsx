'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Author, Post } from '@/types';

interface PostFormProps {
  author: Author;
  existingPost?: Post | null;
  onPostSaved?: () => void;
}

export default function PostForm({ author, existingPost, onPostSaved }: PostFormProps) {
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 既存の投稿がある場合は表示
  useEffect(() => {
    if (existingPost) {
      setComment(existingPost.comment || '');
      if (existingPost.image_url) {
        setImagePreview(existingPost.image_url);
      }
    } else {
      // 下書きを復元
      const draft = localStorage.getItem(`draft_${author}`);
      if (draft) {
        setComment(draft);
      }
    }
  }, [existingPost, author]);

  // 下書き自動保存
  useEffect(() => {
    if (!existingPost && comment) {
      localStorage.setItem(`draft_${author}`, comment);
    }
  }, [comment, author, existingPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let imageUrl = existingPost?.image_url || null;

      // 新しい画像がある場合はアップロード
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${author}_${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const today = new Date().toISOString().split('T')[0];

      if (existingPost) {
        // 更新
        const { error } = await supabase
          .from('posts')
          .update({
            comment: comment || null,
            image_url: imageUrl,
          })
          .eq('id', existingPost.id);

        if (error) throw error;
        setMessage({ type: 'success', text: '更新しました！' });
      } else {
        // 新規作成
        const { error } = await supabase
          .from('posts')
          .insert({
            date: today,
            author,
            comment: comment || null,
            image_url: imageUrl,
          });

        if (error) {
          if (error.code === '23505') {
            // ユニーク制約違反（既に投稿済み）
            setMessage({ type: 'error', text: '今日はすでに投稿済みです' });
          } else {
            throw error;
          }
        } else {
          setMessage({ type: 'success', text: '保存しました！' });
          // 下書きを削除
          localStorage.removeItem(`draft_${author}`);
          setComment('');
          setImageFile(null);
          setImagePreview(null);
        }
      }

      onPostSaved?.();
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ type: 'error', text: '保存に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const authorLabel = author === 'father' ? '父' : '母';
  const authorColor = author === 'father' ? 'green' : 'orange';

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* 投稿者表示 */}
      <div className={`text-center py-2 rounded-lg ${
        author === 'father' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
      }`}>
        <span className="font-bold text-xl">{authorLabel}の投稿</span>
        {existingPost && <span className="ml-2 text-sm">（編集中）</span>}
      </div>

      {/* 写真アップロード */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="プレビュー"
              className="w-full h-48 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
              aria-label="写真を削除"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              author === 'father'
                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                : 'border-orange-300 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <span className="text-4xl mb-2">📷</span>
            <span className="text-gray-600 font-medium">写真を選ぶ</span>
          </label>
        )}
      </div>

      {/* コメント入力 */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="今日の畑はどうでしたか？（書かなくてもOK）"
          className={`w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 ${
            author === 'father'
              ? 'border-green-200 focus:ring-green-400'
              : 'border-orange-200 focus:ring-orange-400'
          }`}
          rows={3}
        />
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div className={`p-3 rounded-lg text-center font-bold ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* 保存ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl text-white font-bold text-xl transition-all ${
          author === 'father'
            ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
            : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300'
        } ${isSubmitting ? 'opacity-50' : ''}`}
      >
        {isSubmitting ? '保存中...' : existingPost ? '更新する' : '保存する'}
      </button>
    </form>
  );
}
