"use client";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: BlogAuthor;
  readTime: string;
  publishedAt: string;
  status: "Published" | "Draft" | "Archived";
  featured?: boolean;
  tags: string[];
}

const STORAGE_KEY = "qni_blog_posts";

// Blogs are created and published through the admin dashboard or team writer portal.
export const INITIAL_BLOG_POSTS: BlogPost[] = [];

export function getBlogs(): BlogPost[] {
  if (typeof window === "undefined") return INITIAL_BLOG_POSTS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_BLOG_POSTS;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getBlogs();
  return blogs.find((b) => b.slug === slug || b.id === slug);
}

export function saveBlog(blogData: Omit<BlogPost, "id" | "publishedAt" | "slug"> & { id?: string; publishedAt?: string; slug?: string }): BlogPost {
  const blogs = getBlogs();
  const now = new Date().toISOString();
  
  // Auto-generate slug if missing
  let slug = blogData.slug
    ? blogData.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (!slug) slug = `post-${Date.now()}`;

  const newPost: BlogPost = {
    id: blogData.id || `blog-${Date.now()}`,
    slug,
    title: blogData.title,
    excerpt: blogData.excerpt,
    content: blogData.content,
    category: blogData.category || "Quantum Tech",
    coverImage: blogData.coverImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    author: blogData.author || {
      name: "QNG Team Member",
      role: "Quantum Researcher",
    },
    readTime: blogData.readTime || "4 min read",
    publishedAt: blogData.publishedAt || now,
    status: blogData.status || "Published",
    featured: blogData.featured ?? false,
    tags: blogData.tags && blogData.tags.length > 0 ? blogData.tags : ["Quantum", "Tech"],
  };

  const existingIndex = blogs.findIndex((b) => b.id === newPost.id || b.slug === newPost.slug);
  let updatedBlogs: BlogPost[];
  if (existingIndex >= 0) {
    updatedBlogs = [...blogs];
    updatedBlogs[existingIndex] = newPost;
  } else {
    updatedBlogs = [newPost, ...blogs];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs));
  }

  return newPost;
}

export function deleteBlog(id: string): boolean {
  const blogs = getBlogs();
  const updated = blogs.filter((b) => b.id !== id && b.slug !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
}
