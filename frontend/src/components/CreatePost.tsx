import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Textarea, Button, Group, Box, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import api, { CreatePostData } from '../services/api';

function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (values: CreatePostData) => {
    setLoading(true);
    setError('');

    try {
      const newPost = await api.createPost(values);
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('创建文章失败，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <Box maw={800} mx="auto">
      <Title order={2} mb="lg">创建新文章</Title>

      {error && (
        <Text color="red" mb="md">{error}</Text>
      )}

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
          <Button variant="subtle" onClick={() => navigate('/posts')}>
            取消
          </Button>
          <Button type="submit" loading={loading}>
            发布文章
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default CreatePost;
