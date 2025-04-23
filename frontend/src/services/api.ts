// 根据环境使用不同的API URL
const API_URL = 'http://localhost:8000';

// 用于调试的简单函数
const logRequest = (method: string, url: string) => {
  console.log(`${method} request to: ${url}`);
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details');
    console.error(`API Error (${response.status}): ${errorText}`);
    throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
  }
  return response.json();
};

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
}

const api = {
  // 获取所有博客文章
  getPosts: async (): Promise<Post[]> => {
    try {
      logRequest('GET', `${API_URL}/api/posts`);
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors' // 确保使用CORS模式
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // 获取单个博客文章
  getPost: async (id: number): Promise<Post> => {
    try {
      logRequest('GET', `${API_URL}/api/posts/${id}`);
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  // 创建新博客文章
  createPost: async (postData: CreatePostData): Promise<Post> => {
    try {
      logRequest('POST', `${API_URL}/api/posts`);
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData),
        mode: 'cors'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // 更新博客文章
  updatePost: async (id: number, postData: CreatePostData): Promise<Post> => {
    try {
      logRequest('PUT', `${API_URL}/api/posts/${id}`);
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData),
        mode: 'cors'
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },

  // 删除博客文章
  deletePost: async (id: number): Promise<void> => {
    try {
      logRequest('DELETE', `${API_URL}/api/posts/${id}`);
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }
};

export default api;
