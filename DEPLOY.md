# 分类搜索模块部署文档

## 1. 项目概述

本项目是C端分类搜索筛选模块，基于 Vue 3 + Express + TypeScript 技术栈，提供机器人商品的分类浏览、搜索筛选功能。

### 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS + Vue Router
- **后端**: Express + TypeScript
- **测试**: Vitest + @vue/test-utils
- **包管理**: npm

### 核心功能

- 三级分类导航（场景分类 → 子分类 → 细分品类）
- 分类商品分组展示
- 多维筛选（价格区间、配送方式、排序）
- 关键词搜索与搜索建议
- 厂商、配件、套餐、解决方案、AI文章等辅助数据展示

---

## 2. 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 18.x | 推荐使用 LTS 版本 |
| npm | >= 9.x | 随 Node.js 一起安装 |
| 浏览器 | Chrome >= 90 / Firefox >= 88 | 支持现代 ES6+ 特性 |

### 端口说明

| 服务 | 默认端口 | 说明 |
|------|----------|------|
| 前端开发服务器 | 5173 | Vite 开发服务器 |
| 后端 API 服务 | 3001 | Express 服务 |

---

## 3. 安装与启动

### 3.1 安装依赖

```bash
npm install
```

### 3.2 开发模式启动

#### 方式一：同时启动前后端（推荐）

```bash
npm run dev
```

该命令会使用 `concurrently` 同时启动前端和后端服务。

#### 方式二：分别启动

启动前端开发服务器：

```bash
npm run client:dev
```

启动后端开发服务器（带热重载）：

```bash
npm run server:dev
```

### 3.3 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 3.4 预览生产构建

```bash
npm run preview
```

---

## 4. 接口联调说明

### 4.1 接口基地址

- 开发环境: `http://localhost:5173/api`（通过 Vite 代理转发到后端 3001 端口）
- 后端直连: `http://localhost:3001/api`

### 4.2 分类相关接口

#### 4.2.1 获取场景分类列表

- **接口地址**: `GET /api/scenario-categories`
- **描述**: 获取所有一级场景分类及其子分类树
- **响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "sc1",
      "name": "工业制造",
      "icon": "Factory",
      "description": "焊接、装配、搬运、码垛",
      "count": 48,
      "color": "from-blue-500",
      "children": [
        {
          "id": "sc1-1",
          "name": "焊接机器人",
          "count": 12,
          "children": [
            { "id": "sc1-1-1", "name": "电弧焊接机器人", "count": 5 }
          ]
        }
      ]
    }
  ]
}
```

#### 4.2.2 获取分类商品列表

- **接口地址**: `GET /api/scenario-categories/products`
- **描述**: 根据分类ID查询商品，支持筛选和排序
- **请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category1Id | string | 否 | 一级分类ID |
| category2Id | string | 否 | 二级分类ID |
| category3Id | string | 否 | 三级分类ID |
| sort | string | 否 | 排序方式，见下方枚举 |
| minPrice | number | 否 | 最低价格 |
| maxPrice | number | 否 | 最高价格 |
| delivery | string | 否 | 配送方式 |

**sort 枚举值**:
- `default` - 默认排序
- `price-asc` - 价格升序
- `price-desc` - 价格降序
- `sales` - 销量排序
- `popularity` - 人气排序
- `newest` - 最新上架
- `rating` - 评分排序

- **响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "sc1-1",
      "name": "焊接机器人",
      "count": 12,
      "products": [
        {
          "id": "1",
          "name": "星尘工业焊接机器人",
          "model": "XC-W100",
          "price": 128000,
          "image": "...",
          "sales": 2680,
          "rating": 4.8
        }
      ]
    }
  ]
}
```

#### 4.2.3 按分类ID获取商品

- **接口地址**: `GET /api/scenario-categories/:id/products`
- **描述**: 根据分类ID自动识别分类层级并返回商品
- **路径参数**:
  - `id` - 分类ID（支持一级/二级/三级格式）
- **查询参数**: 同 4.2.2 中的 sort、minPrice、maxPrice、delivery

#### 4.2.4 获取厂商列表

- **接口地址**: `GET /api/manufacturers`
- **描述**: 获取所有品牌厂商列表

#### 4.2.5 获取热门配件

- **接口地址**: `GET /api/accessories/hot`
- **描述**: 获取热门配件排行榜
- **请求参数**: `limit` - 返回数量，默认 8

#### 4.2.6 获取套餐列表

- **接口地址**: `GET /api/packages`
- **描述**: 获取所有解决方案套餐

#### 4.2.7 获取解决方案列表

- **接口地址**: `GET /api/solutions`
- **描述**: 获取行业解决方案列表

#### 4.2.8 获取AI文章列表

- **接口地址**: `GET /api/ai-articles`
- **描述**: 获取AI/机器人相关文章
- **请求参数**: `limit` - 返回数量，默认 6

### 4.3 搜索相关接口

#### 4.3.1 搜索机器人

- **接口地址**: `GET /api/robots`
- **描述**: 关键词搜索机器人商品
- **请求参数**: `keyword` - 搜索关键词

#### 4.3.2 获取搜索建议

- **接口地址**: `GET /api/suggest`
- **描述**: 获取搜索建议词列表
- **请求参数**: `q` - 输入的关键词前缀

#### 4.3.3 获取机器人详情

- **接口地址**: `GET /api/robots/:id`
- **描述**: 根据ID获取单个机器人的详细信息

#### 4.3.4 获取场景列表

- **接口地址**: `GET /api/scenarios`
- **描述**: 获取所有可用的场景分类标签

### 4.4 健康检查接口

- **接口地址**: `GET /api/health`
- **描述**: 服务健康检查
- **响应**:

```json
{
  "success": true,
  "message": "ok"
}
```

### 4.5 联调验证步骤

1. 启动后端服务：`npm run server:dev`
2. 验证服务健康：访问 `http://localhost:3001/api/health`
3. 验证分类接口：访问 `http://localhost:3001/api/scenario-categories`
4. 验证搜索接口：访问 `http://localhost:3001/api/robots?keyword=焊接`
5. 启动前端服务：`npm run client:dev`
6. 验证前端联调：访问 `http://localhost:5173`

---

## 5. 分类种子数据说明

### 5.1 数据文件位置

分类种子数据位于 `api/data/categories.ts`，包含以下数据：

| 数据类型 | 变量名 | 数量 | 说明 |
|----------|--------|------|------|
| 厂商 | manufacturers | 6 个 | 品牌厂商信息 |
| 配件 | accessories | 8 个 | 机器人配件商品 |
| 套餐 | packages | 4 个 | 解决方案套餐 |
| 解决方案 | solutions | 4 个 | 行业解决方案 |
| AI文章 | aiArticles | 6 篇 | 行业资讯文章 |
| 场景分类 | scenarioCategories | 8 个 | 三级分类树结构 |

机器人商品数据位于 `api/data/robots.ts`。

### 5.2 场景分类层级结构

系统采用三级分类体系：

```
一级分类（场景）
  └── 二级分类（品类）
        └── 三级分类（细分）
```

### 5.3 一级分类列表

| 分类ID | 分类名称 | 图标 | 描述 | 二级分类数 |
|--------|----------|------|------|------------|
| sc1 | 工业制造 | Factory | 焊接、装配、搬运、码垛 | 5 |
| sc2 | 服务行业 | UtensilsCrossed | 酒店、餐饮、零售配送 | 4 |
| sc3 | 医疗健康 | HeartPulse | 陪护、康复、消毒、配送 | 4 |
| sc4 | 教育培训 | GraduationCap | STEM教育、竞赛、编程学习 | 3 |
| sc5 | 物流仓储 | Package | 搬运、分拣、码垛 | 4 |
| sc6 | 安防巡检 | ShieldCheck | 巡逻、监控、应急响应 | 3 |
| sc7 | 农业种植 | Sprout | 采摘、巡检、喷药 | 3 |
| sc8 | 家庭服务 | Home | 清洁、陪伴、养老 | 4 |

### 5.4 分类ID命名规则

- 一级分类: `sc{序号}` （如 sc1, sc2, ... sc8）
- 二级分类: `sc{一级序号}-{二级序号}` （如 sc1-1, sc1-2）
- 三级分类: `sc{一级序号}-{二级序号}-{三级序号}` （如 sc1-1-1, sc1-1-2）

### 5.5 数据示例

#### 工业制造分类 (sc1)

| 二级分类 | 三级分类 |
|----------|----------|
| 焊接机器人 (sc1-1) | 电弧焊接机器人 (sc1-1-1) |
| | 激光焊接机器人 (sc1-1-2) |
| | 点焊机器人 (sc1-1-3) |
| 装配机器人 (sc1-2) | 汽车装配机器人 (sc1-2-1) |
| | 电子装配机器人 (sc1-2-2) |
| | 精密装配机器人 (sc1-2-3) |
| 搬运码垛机器人 (sc1-3) | 码垛机器人 (sc1-3-1) |
| | 上下料机器人 (sc1-3-2) |
| | 注塑取件机器人 (sc1-3-3) |
| 喷涂机器人 (sc1-4) | 汽车喷涂机器人 (sc1-4-1) |
| | 家电喷涂机器人 (sc1-4-2) |
| 打磨抛光机器人 (sc1-5) | 金属打磨机器人 (sc1-5-1) |
| | 抛光机器人 (sc1-5-2) |

### 5.6 数据扩展方式

如需新增分类数据，请编辑 `api/data/categories.ts` 文件，按照现有格式添加新的分类项。同时需要确保：

1. 分类ID唯一且符合命名规则
2. 三级分类的 count 字段总和与二级分类 count 一致
3. 二级分类的 count 字段总和与一级分类 count 一致
4. 机器人商品数据中的 category1Id、category2Id、category3Id 与分类ID对应

---

## 6. 验收命令

### 6.1 代码质量检查

#### 类型检查

```bash
npm run check
```

使用 `vue-tsc` 进行 TypeScript 类型检查，确保所有类型定义正确。

#### ESLint 代码检查

```bash
npm run lint
```

使用 ESLint 检查代码风格和潜在问题。

#### 自动修复 lint 问题

```bash
npm run lint:fix
```

### 6.2 单元测试

#### 运行所有测试

```bash
npm run test
```

运行 Vitest 测试套件，输出测试报告。

#### 监听模式运行测试

```bash
npm run test:watch
```

在开发过程中持续运行测试，文件变更时自动重跑。

#### 可视化测试面板

```bash
npm run test:ui
```

启动 Vitest UI 面板，可视化查看测试结果。

### 6.3 核心测试用例

项目包含以下测试文件，覆盖核心功能：

| 测试文件 | 测试内容 |
|----------|----------|
| `tests/categories.service.test.ts` | 分类服务测试（三级分类、分类切换、筛选组合） |
| `tests/robots.service.search.test.ts` | 搜索服务测试（关键词搜索、搜索建议） |
| `tests/sort-filter.test.ts` | 排序筛选测试（价格排序、销量排序、价格区间筛选） |
| `tests/RobotCard.component.test.ts` | 机器人卡片组件测试 |
| `tests/SearchBar.component.test.ts` | 搜索栏组件测试 |

### 6.4 构建验证

```bash
npm run build
```

执行生产构建，验证代码能否正常编译打包。

### 6.5 完整验收流程

执行以下命令进行完整的验收检查：

```bash
# 1. 安装依赖
npm install

# 2. 类型检查
npm run check

# 3. 代码风格检查
npm run lint

# 4. 运行所有单元测试
npm run test

# 5. 生产构建验证
npm run build
```

全部通过后，可认为验收合格。

### 6.6 接口冒烟测试

可使用 curl 命令快速验证后端接口：

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取分类列表
curl http://localhost:3001/api/scenario-categories

# 一级分类商品查询
curl "http://localhost:3001/api/scenario-categories/products?category1Id=sc1"

# 二级分类商品查询
curl "http://localhost:3001/api/scenario-categories/products?category1Id=sc1&category2Id=sc1-1"

# 带排序的分类查询
curl "http://localhost:3001/api/scenario-categories/products?category1Id=sc1&sort=price-asc"

# 搜索接口
curl "http://localhost:3001/api/robots?keyword=焊接"

# 搜索建议
curl "http://localhost:3001/api/suggest?q=焊"
```

---

## 7. 目录结构说明

```
.
├── api/                      # 后端代码
│   ├── controllers/          # 控制器层
│   ├── data/                 # 种子数据
│   │   ├── categories.ts     # 分类数据
│   │   └── robots.ts         # 机器人数据
│   ├── repositories/         # 数据访问层
│   ├── routes/               # 路由定义
│   ├── services/             # 业务逻辑层
│   ├── types.ts              # 类型定义
│   └── app.ts                # Express 应用
├── src/                      # 前端代码
│   ├── api/                  # API 请求封装
│   ├── components/           # 组件
│   ├── composables/          # 组合式函数
│   ├── pages/                # 页面组件
│   ├── router/               # 路由配置
│   └── types/                # 类型定义
├── tests/                    # 测试文件
├── public/                   # 静态资源
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置
├── vitest.config.ts          # Vitest 配置
├── tailwind.config.js        # Tailwind 配置
├── package.json              # 项目配置
└── DEPLOY.md                 # 本文档
```

---

## 8. 常见问题

### Q: 前端请求不到后端接口？

A: 请检查：
1. 后端服务是否已启动（端口 3001）
2. Vite 代理配置是否正确（见 `vite.config.ts`）
3. 接口路径是否以 `/api` 开头

### Q: 如何修改后端端口？

A: 在 `api/index.ts` 或环境变量中修改端口配置。

### Q: 分类数据如何与数据库对接？

A: 当前为内存数据模式，可在 `api/repositories/` 层替换为数据库实现，Service 层无需修改。

### Q: 测试运行失败怎么办？

A: 执行 `npm run test:ui` 打开可视化面板，查看具体失败的测试用例和错误信息。
