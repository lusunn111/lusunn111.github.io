#!/usr/bin/env python3
"""
Markdown笔记迁移工具
将markdown文件转换为Jekyll博客文章格式，自动处理图片迁移、标签提取和头部生成
"""

import os
import re
import shutil
import argparse
from pathlib import Path
from datetime import datetime
import hashlib
import urllib.parse
from collections import Counter
import jieba
import jieba.analyse


class MarkdownMigrator:
    def __init__(self, input_path):
        """
        初始化迁移工具
        
        Args:
            input_path: 输入的markdown文件或目录路径
        """
        self.input_path = Path(input_path)
        # 获取项目根目录（脚本所在目录的父目录）
        self.project_root = Path(__file__).parent.parent
        # 输出目录为项目根目录下的_posts
        self.output_dir = self.project_root / "_posts"
        # 图片目录为项目根目录下的images
        self.images_dir = self.project_root / "images"
        self.supported_image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'}
        
        # 确保输出目录存在
        self.output_dir.mkdir(exist_ok=True)
        self.images_dir.mkdir(exist_ok=True)
        
        # 初始化中文分词
        jieba.initialize()
    
    def extract_title_from_content(self, content):
        """从内容中提取标题"""
        # 尝试从第一个标题提取
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            return title_match.group(1).strip()
        
        # 尝试从文件名提取
        if self.input_path.is_file():
            filename = self.input_path.stem
            # 将下划线和连字符转换为空格
            title = re.sub(r'[_-]', ' ', filename)
            return title.title()
        
        return "Untitled Post"
    
    def extract_tags_from_content(self, content, max_tags=5):
        """从内容中自动提取标签"""
        # 移除markdown语法
        content = re.sub(r'[#*`\[\]()]', ' ', content)
        content = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', content)  # 移除链接但保留文本
        content = re.sub(r'!\[([^\]]*)\]\([^)]+\)', '', content)    # 移除图片
        
        # 移除代码块
        content = re.sub(r'```[\s\S]*?```', '', content)
        content = re.sub(r'`[^`]*`', '', content)
        
        # 使用jieba提取关键词
        try:
            keywords = jieba.analyse.extract_tags(content, topK=max_tags, withWeight=False)
            # 过滤掉太短的关键词
            keywords = [kw for kw in keywords if len(kw) > 1]
            return keywords[:max_tags]
        except:
            # 如果中文分词失败，使用英文单词
            words = re.findall(r'\b[a-zA-Z]{3,}\b', content.lower())
            word_counts = Counter(words)
            return [word for word, count in word_counts.most_common(max_tags)]
    
    def find_and_copy_images(self, content, source_dir):
        """查找并复制图片文件"""
        copied_images = {}
        
        # 查找所有图片引用
        image_patterns = [
            r'!\[([^\]]*)\]\(([^)]+)\)',  # markdown图片语法
            r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>',  # html img标签
        ]
        
        for pattern in image_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if isinstance(match, tuple):
                    alt_text, image_path = match[0], match[1]
                else:
                    image_path = match
                    alt_text = ""
                
                # 处理URL编码
                image_path = urllib.parse.unquote(image_path)
                
                # 跳过网络图片
                if image_path.startswith(('http://', 'https://')):
                    continue
                
                # 查找图片文件
                source_file = self.find_image_file(image_path, source_dir)
                if source_file:
                    # 生成新的文件名
                    new_filename = self.generate_image_filename(source_file)
                    dest_path = self.images_dir / new_filename
                    
                    # 复制图片
                    shutil.copy2(source_file, dest_path)
                    copied_images[image_path] = f"/images/{new_filename}"
        
        return copied_images
    
    def find_image_file(self, image_path, source_dir):
        """查找图片文件"""
        # 尝试多种路径
        possible_paths = [
            Path(image_path),
            source_dir / image_path,
            source_dir / "images" / Path(image_path).name,
            Path.cwd() / image_path,
        ]
        
        for path in possible_paths:
            if path.exists() and path.suffix.lower() in self.supported_image_extensions:
                return path
        
        return None
    
    def generate_image_filename(self, source_file):
        """生成唯一的图片文件名"""
        # 使用文件内容的哈希值生成唯一文件名
        with open(source_file, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()[:8]
        
        extension = source_file.suffix.lower()
        return f"{file_hash}{extension}"
    
    def update_image_paths(self, content, image_mapping):
        """更新markdown中的图片路径"""
        for old_path, new_path in image_mapping.items():
            # 更新markdown图片语法
            content = re.sub(
                r'!\[([^\]]*)\]\(' + re.escape(old_path) + r'\)',
                f'![\\1]({new_path})',
                content
            )
            # 更新html img标签
            content = re.sub(
                r'<img([^>]+)src=["\']' + re.escape(old_path) + r'["\']([^>]*)>',
                f'<img\\1src="{new_path}"\\2>',
                content
            )
        
        return content
    
    def generate_jekyll_front_matter(self, title, date, tags):
        """生成Jekyll头部"""
        # 生成permalink
        title_slug = re.sub(r'[^\w\s-]', '', title.lower())
        title_slug = re.sub(r'[-\s]+', '-', title_slug)
        permalink = f"/posts/{date.strftime('%Y/%m')}/{title_slug}/"
        
        front_matter = f"""---
title: '{title}'
date: {date.strftime('%Y-%m-%d')}
permalink: {permalink}
tags:
"""
        
        for tag in tags:
            front_matter += f"  - {tag}\n"
        
        front_matter += "---\n\n"
        
        return front_matter
    
    def process_markdown_file(self, markdown_file):
        """处理单个markdown文件"""
        print(f"Processing: {markdown_file}")
        
        try:
            # 读取文件内容
            with open(markdown_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取信息
            title = self.extract_title_from_content(content)
            tags = self.extract_tags_from_content(content)
            
            # 获取文件修改时间作为发布日期
            file_stat = markdown_file.stat()
            date = datetime.fromtimestamp(file_stat.st_mtime)
            
            # 查找并复制图片
            source_dir = markdown_file.parent
            image_mapping = self.find_and_copy_images(content, source_dir)
            
            # 更新图片路径
            content = self.update_image_paths(content, image_mapping)
            
            # 生成Jekyll头部
            front_matter = self.generate_jekyll_front_matter(title, date, tags)
            
            # 生成输出文件名
            title_slug = re.sub(r'[^\w\s-]', '', title.lower())
            title_slug = re.sub(r'[-\s]+', '-', title_slug)
            output_filename = f"{date.strftime('%Y-%m-%d')}-{title_slug}.md"
            output_path = self.output_dir / output_filename
            
            # 写入文件
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(front_matter + content)
            
            print(f"✓ Created: {output_path}")
            print(f"  Title: {title}")
            print(f"  Date: {date.strftime('%Y-%m-%d')}")
            print(f"  Tags: {', '.join(tags)}")
            if image_mapping:
                print(f"  Images copied: {len(image_mapping)}")
            print()
            
            return True
            
        except Exception as e:
            print(f"✗ Error processing {markdown_file}: {e}")
            return False
    
    def process_directory(self):
        """处理目录中的所有markdown文件"""
        markdown_files = []
        
        if self.input_path.is_file():
            if self.input_path.suffix.lower() in ['.md', '.markdown']:
                markdown_files = [self.input_path]
        elif self.input_path.is_dir():
            markdown_files = list(self.input_path.rglob('*.md')) + list(self.input_path.rglob('*.markdown'))
        
        if not markdown_files:
            print("No markdown files found.")
            return
        
        print(f"Found {len(markdown_files)} markdown files to process.")
        print()
        
        success_count = 0
        for markdown_file in markdown_files:
            if self.process_markdown_file(markdown_file):
                success_count += 1
        
        print(f"Processed {success_count}/{len(markdown_files)} files successfully.")


def main():
    parser = argparse.ArgumentParser(description='Markdown笔记迁移工具')
    parser.add_argument('input_path', help='输入的markdown文件或目录路径')
    
    args = parser.parse_args()
    
    # 创建迁移器
    migrator = MarkdownMigrator(args.input_path)
    
    # 处理文件
    migrator.process_directory()


if __name__ == '__main__':
    main()