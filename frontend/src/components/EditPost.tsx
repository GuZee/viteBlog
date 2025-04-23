import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Textarea, Button, Group, Box, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import api from '../services/api';

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      title: '',
      content: '',
      author: '',
    },
    validate: {
      title: (value) => value.trim().length < 1 ? '标题不能为空' : null,
      content: (value) => value.trim().length < 1 ? '内容不能为空' : null,
      author: (value) => value.trim().length < 1 ? '作者不能为空' : null,
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const post = await api.getPost(Number(id));
        form.setValues({
          title: post.title,
          content: post.content,
          author: post.author,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setError('无法加载文章，可能文章不存在或已被删除');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (values: { title: string; content: string; author: string }) => {
    if (!id) return;
    
    setSubmitting(true);
    setError('');

    try {
      await api.updatePost(Number(id), values);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      setError('更新文章失败，请稍后重试');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Text>加载中...</Text>;
  }

  if (error) {
    return (
      <div>
        <Text color="red">{error}</Text>
        <Button component="a" href="/posts" mt="md">
          返回文章列表
        </Button>
      </div>
    );
  }

  return (
    <Box maw={800} mx="auto">
      <Title order={2} mb="lg">编辑文章</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="标题"
          placeholder="请输入文章标题"
          required
          mb="md"
          {...form.getInputProps('title')}
        />

        <TextInput
          label="作者"
          placeholder="请输入作者姓名"
          required
          mb="md"
          {...form.getInputProps('author')}
        />

        <Textarea
          label="内容"
          placeholder="请输入文章内容"
          required
          minRows={10}
          mb="xl"
          {...form.getInputProps('content')}
        />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => navigate(`/posts/${id}`)}>
            取消
          </Button>
          <Button type="submit" loading={submitting}>
            更新文章
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default EditPost;
