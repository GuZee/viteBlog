// 在文件顶部添加Deno类型声明
/// <reference types="https://deno.land/x/oak@v12.6.1/types.d.ts" />
// 移除了不存在的cors类型引用，因为oakCors模块已经包含了必要的类型定义

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// 定义博客文章接口
interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: string;
}

// 数据存储文件路径
const DB_FILE = "blog.db.json";

// 保存数据到文件
const savePosts = async (posts: Post[]) => {
    try {
        await Deno.writeTextFile(DB_FILE, JSON.stringify(posts, null, 2));
        console.log("Data saved to " + DB_FILE);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

// 从文件加载数据
const loadPosts = async (): Promise<Post[]> => {
    try {
        const fileExists = await fileExistsCheck(DB_FILE);
        if (!fileExists) {
            // 如果文件不存在，初始化样本数据
            const initialPosts: Post[] = [
                {
                    id: 1,
                    title: "第一篇博客文章",
                    content: "这是我的第一篇博客文章内容...",
                    author: "管理员",
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    title: "Deno 简介",
                    content:
                        "Deno是一个JavaScript和TypeScript运行时，默认安全并支持TypeScript...",
                    author: "技术团队",
                    created_at: new Date().toISOString(),
                },
                {
                    id: 3,
                    title: "React 18 新特性",
                    content:
                        "React 18带来了许多令人兴奋的新特性，包括自动批处理更新、并发特性等...",
                    author: "前端开发者",
                    created_at: new Date().toISOString(),
                },
            ];
            await savePosts(initialPosts);
            console.log("Initialized sample data");
            return initialPosts;
        }

        const content = await Deno.readTextFile(DB_FILE);
        return JSON.parse(content) as Post[];
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
};

// 检查文件是否存在
const fileExistsCheck = async (path: string): Promise<boolean> => {
    try {
        await Deno.stat(path);
        return true;
    } catch {
        return false;
    }
};

// 初始化数据
let posts: Post[] = [];
let nextId = 1;

// 加载数据
loadPosts().then((loadedPosts) => {
    posts = loadedPosts;
    // 计算下一个可用ID
    nextId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
    console.log(`Loaded ${posts.length} posts, next ID: ${nextId}`);
});

const app = new Application();
const router = new Router();

// 中间件
app.use(
    oakCors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }),
); // 配置更精确的CORS

app.use(async (ctx, next) => {
    // 手动添加CORS头以确保跨域请求工作
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE",
    );
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
    await next();
});

// 路由
router.get("/", (ctx) => {
    ctx.response.body = "Welcome to Blog API!";
});

// 获取所有博客文章
router.get("/api/posts", (ctx) => {
    // 按创建时间降序排序
    const sortedPosts = [...posts].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    ctx.response.body = sortedPosts;
});

// 获取单个博客文章
router.get("/api/posts/:id", (ctx) => {
    const id = Number(ctx.params.id);
    const post = posts.find((p) => p.id === id);

    if (post) {
        ctx.response.body = post;
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Post not found" };
    }
});

// 创建新博客文章
router.post("/api/posts", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    const { title, content, author } = body;

    if (!title || !content || !author) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Missing required fields" };
        return;
    }

    const created_at = new Date().toISOString();
    const id = nextId++;

    const newPost = { id, title, content, author, created_at };
    posts.push(newPost);

    // 保存到文件
    await savePosts(posts);

    ctx.response.status = 201;
    ctx.response.body = newPost;
});

// 更新博客文章
router.put("/api/posts/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    const body = await ctx.request.body({ type: "json" }).value;
    const { title, content, author } = body;

    if (!title || !content || !author) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Missing required fields" };
        return;
    }

    const index = posts.findIndex((p) => p.id === id);

    if (index !== -1) {
        const updatedPost = {
            ...posts[index],
            title,
            content,
            author,
        };

        posts[index] = updatedPost;

        // 保存到文件
        await savePosts(posts);

        ctx.response.body = updatedPost;
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Post not found" };
    }
});

// 删除博客文章
router.delete("/api/posts/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    posts = posts.filter((p) => p.id !== id);

    // 保存到文件
    await savePosts(posts);

    ctx.response.status = 204; // No content
});

app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
