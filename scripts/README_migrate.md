# Markdown笔记迁移工具

这个工具可以将你的markdown笔记转换为Jekyll博客文章格式，自动处理图片迁移、标签提取和头部生成。

## 功能特点

- 自动提取标题和标签
- 迁移图片文件到统一目录
- 更新markdown中的图片路径
- 生成符合Jekyll格式的头部信息
- 支持中文分词和标签提取
- 批量处理多个文件

## 使用方法

### 安装依赖

```bash
pip install -r scripts/requirements.txt
```

### 基本使用

```bash
# 处理单个文件
python scripts/migrate_markdown.py path/to/your/note.md

# 处理整个目录
python scripts/migrate_markdown.py path/to/your/notes/
```

### 参数说明

- `input_path`: 输入的markdown文件或目录路径（必需）

脚本会自动将生成的markdown文件放到项目根目录的`_posts\`文件夹中，图片放到`images\`文件夹中。

## 输出格式

生成的文件会自动包含Jekyll头部：

```yaml
---
title: '文章标题'
date: 2025-08-03
permalink: /posts/2025/08/article-title/
tags:
  - 标签1
  - 标签2
  - 标签3
---
```

## 注意事项

1. 图片会被复制到项目根目录的`images\`文件夹，并生成唯一的文件名
2. 生成的markdown文件会放到项目根目录的`_posts\`文件夹
3. 标签会从内容中自动提取，支持中文分词
4. 发布日期默认使用文件的修改时间
5. 原始文件不会被修改

## 示例

假设你有一个笔记文件 `my_notes/python_basics.md`，运行：

```bash
python scripts/migrate_markdown.py my_notes/python_basics.md
```

会生成类似 `_posts/2025-08-03-python-basics.md` 的文件。