import fs from 'fs';
import path from 'path';
import { BlogPost } from './blogs-store';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs_store.json');

export function readLocalBlogs(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOGS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(BLOGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[ServerBlogStorage] Error reading blogs file:', error);
    return [];
  }
}

export function writeLocalBlogs(blogs: BlogPost[]): boolean {
  try {
    const dir = path.dirname(BLOGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('[ServerBlogStorage] Error writing blogs file:', error);
    return false;
  }
}

export function saveLocalBlog(blog: BlogPost): BlogPost {
  const blogs = readLocalBlogs();
  const index = blogs.findIndex((b) => b.id === blog.id || b.slug === blog.slug);
  if (index >= 0) {
    blogs[index] = blog;
  } else {
    blogs.unshift(blog);
  }
  writeLocalBlogs(blogs);
  return blog;
}

export function deleteLocalBlog(id: string): void {
  const blogs = readLocalBlogs();
  const filtered = blogs.filter((b) => b.id !== id && b.slug !== id);
  writeLocalBlogs(filtered);
}
