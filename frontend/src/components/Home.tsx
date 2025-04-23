import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Title, Text, Card, SimpleGrid, Button, Container } from '@mantine/core';
import api, { Post } from '../services/api';

function Home() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        console.log('Fetching posts from:', `${import.meta.env.DEV ? 'http://localhost:8000' : ''}/api/posts`);
        const posts = await api.getPosts();
        console.log('Received posts:', posts);
        setRecentPosts(posts.slice(0, 3)); // 只获取最新的3篇文章
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
        // 显示更详细的错误信息
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        } else {
          console.error('Unknown error:', error);
        }
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <Container>
      <Title order={1} mb="xl">欢迎来到博客系统</Title>
      
      <Text size="lg" mb="xl">
        这是一个使用 Vite, React, TypeScript 和 Deno 构建的博客系统。
        浏览最新的博客文章，或者创建你自己的文章！
      </Text>
      
      <Title order={2} mb="md">最新文章</Title>
      
      {loading ? (
        <Text>加载中...</Text>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
            {recentPosts.map((post) => (
              <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="xs">{post.title}</Title>
                <Text lineClamp={2} mb="md">
                  {post.content.substring(0, 100)}...
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  作者: {post.author} | 发布于: {new Date(post.created_at).toLocaleDateString()}
                </Text>
                <Button component={Link} to={`/posts/${post.id}`} variant="light" fullWidth>
                  阅读全文
                </Button>
              </Card>
            ))}
          </SimpleGrid>
          
          <Button component={Link} to="/posts" variant="outline" size="md">
            查看所有文章
          </Button>
        </>
      )}
    </Container>
  );
}

export default Home;
