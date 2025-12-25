export type Author = 'father' | 'mother';

export interface Post {
  id: number;
  created_at: string;
  date: string;
  author: Author;
  comment: string | null;
  image_url: string | null;
  is_deleted: boolean;
}

export type FontSize = 'small' | 'medium' | 'large';

export interface PostsByDate {
  date: string;
  posts: Post[];
}
