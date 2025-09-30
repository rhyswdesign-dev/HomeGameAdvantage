/**
 * POSTS CONTEXT
 * Manages user-created posts and their display in the community feed
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserPost {
  id: string;
  content: string;
  image?: string;
  type: 'general' | 'review' | 'discovery' | 'achievement' | 'event';
  timestamp: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  likes: number;
  comments: number;
  topComments?: Array<{
    user: string;
    text: string;
  }>;
}

interface PostsContextType {
  userPosts: UserPost[];
  addPost: (post: Omit<UserPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likePost: (postId: string) => void;
  removePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);

  const addPost = (postData: Omit<UserPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const newPost: UserPost = {
      ...postData,
      id: `user-post-${Date.now()}`,
      timestamp: 'now',
      likes: 0,
      comments: 0,
    };

    setUserPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const likePost = (postId: string) => {
    setUserPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const removePost = (postId: string) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <PostsContext.Provider value={{
      userPosts,
      addPost,
      likePost,
      removePost,
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}