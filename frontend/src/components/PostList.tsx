import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Title, Text, Card, Button, Group, Stack } from '@mantine/core';
import api, { Post } from '../services/api';

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="xl">
        <Title order={2}>所有文章</Title>
        <Button component={Link} to="/posts/create">创建新文章</Button>
      </Group>

      <Stack>
        {posts.length === 0 ? (
          <Text>暂无文章，请创建新文章。</Text>
        ) : (
          posts.map(post => (
            <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="xs">{post.title}</Title>
              <Text lineClamp={2} mb="md">
                {post.content.substring(0, 150)}...
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                作者: {post.author} | 发布于: {new Date(post.created_at).toLocaleDateString()}
              </Text>
              <Group>
                <Button component={Link} to={`/posts/${post.id}`} variant="light">
                  阅读全文
                </Button>
                <Button component={Link} to={`/posts/edit/${post.id}`} variant="outline">
                  编辑
                </Button>
                <Button color="red" variant="subtle" onClick={() => handleDelete(post.id)}>
                  删除
                </Button>
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </div>
  );
}

export default PostList;
