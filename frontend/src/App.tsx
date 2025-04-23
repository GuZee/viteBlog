import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { MantineProvider, AppShell, Burger, Group, Title, Container } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import '@mantine/core/styles.css'
import './App.css'

// 导入组件
import Home from './components/Home'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'
import EditPost from './components/EditPost'

function App() {
  const [opened, { toggle }] = useDisclosure();
  
  return (
    <MantineProvider>
      <Router>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        >
          <AppShell.Header>
            <Container p="md">
              <Group justify="space-between">
                <Group>
                  <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                  <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Title order={3}>博客系统</Title>
                  </Link>
                </Group>
                <Group>
                  <Link to="/" style={{ textDecoration: 'none', padding: '0 12px' }}>首页</Link>
                  <Link to="/posts" style={{ textDecoration: 'none', padding: '0 12px' }}>文章列表</Link>
                  <Link to="/posts/create" style={{ textDecoration: 'none', padding: '0 12px' }}>创建文章</Link>
                </Group>
              </Group>
            </Container>
          </AppShell.Header>
          
          <AppShell.Navbar p="md">
            <Title order={6} mb="md">博客导航</Title>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/" style={{ padding: '8px 0', textDecoration: 'none' }}>首页</Link>
              <Link to="/posts" style={{ padding: '8px 0', textDecoration: 'none' }}>文章列表</Link>
              <Link to="/posts/create" style={{ padding: '8px 0', textDecoration: 'none' }}>创建文章</Link>
            </div>
          </AppShell.Navbar>
          
          <AppShell.Main>
            <Container p="md">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts/create" element={<CreatePost />} />
                <Route path="/posts/edit/:id" element={<EditPost />} />
              </Routes>
            </Container>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  )
}

export default App
