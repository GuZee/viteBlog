import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Title, Text, Group, Button, Paper, Divider } from '@mantine/core';
import api, { Post } from '../services/api';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const fetchedPost = await api.getPost(Number(id));
        setPost(fetchedPost);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setError('文章加载失败，可能文章不存在或已被删除');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;
    
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await api.deletePost(post.id);
        navigate('/posts');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) {
    return <Text>加载中...</Text>;
  }

  if (error) {
    return (
      <div>
        <Text color="red">{error}</Text>
        <Button component={Link} to="/posts" mt="md">
          返回文章列表
        </Button>
      </div>
    );
  }

  if (!post) {
    return <Text>文章不存在</Text>;
  }

  return (
    <Paper p="md" radius="md">
      <Title order={1} mb="xs">{post.title}</Title>
      <Text size="sm" c="dimmed" mb="lg">
        作者: {post.author} | 发布于: {new Date(post.created_at).toLocaleDateString()}
      </Text>
      
      <Divider mb="lg" />
      
      <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }} mb="xl">
        {post.content}
      </Text>
      
      <Group mt="xl">
        <Button component={Link} to="/posts" variant="outline">
          返回文章列表
        </Button>
        <Button component={Link} to={`/posts/edit/${post.id}`} variant="light">
          编辑文章
        </Button>
        <Button color="red" variant="subtle" onClick={handleDelete}>
          删除文章
        </Button>
      </Group>
    </Paper>
  );
}

export default PostDetail;
