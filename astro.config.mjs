// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import catppuccin from "@catppuccin/starlight";

// https://astro.build/config
export default defineConfig({
  base: '/pca-docs/',
  integrations: [
    starlight({
      plugins: [catppuccin()],
      title: '跨平台比价智能体',
      description: '基于大模型的跨平台自动比价桌面应用',
      social: [{
        icon: 'github',
        label: 'GitHub',
        href: 'https://github.com/Badnuker/price-compare-agent',
      }],
      sidebar: [
        {
          label: '概览',
          items: [
            { label: '项目介绍', slug: '' },
          ],
        },
        {
          label: '使用指南',
          items: [
            { label: '快速开始', slug: 'guides/quickstart' },
            { label: '功能介绍', slug: 'guides/features' },
            { label: '项目结构', slug: 'guides/project-structure' },
            { label: '一次搜索的旅程', slug: 'guides/how-it-works' },
            { label: '设置与配置', slug: 'guides/configuration' },
          ],
        },
        {
          label: '技术参考',
          items: [
            { label: '技术栈', slug: 'reference/tech-stack' },
            { label: '架构设计', slug: 'reference/architecture' },
            { label: 'Agent 工作流', slug: 'reference/agent-workflow' },
          ],
        },
      ],
    }),
  ],
});
