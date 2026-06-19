<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">AI科普</h2>
        <span class="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-md text-[11px] font-bold flex items-center gap-0.5">
          <Sparkles class="w-3 h-3" />
          精选
        </span>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        更多文章
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="article in aiArticles"
        :key="article.id"
        class="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 cursor-pointer group flex flex-col"
      >
        <div class="relative aspect-[16/9] overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            :src="article.cover"
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-2 left-2 flex gap-1">
            <span class="px-2 py-0.5 bg-violet-500/90 backdrop-blur text-white rounded-md text-[10px] font-bold">
              {{ article.tag }}
            </span>
            <span class="px-2 py-0.5 bg-white/90 backdrop-blur text-violet-600 rounded-md text-[10px] font-bold">
              {{ article.category }}
            </span>
          </div>
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="text-sm font-bold text-ink line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[40px]">
            {{ article.title }}
          </h3>
          <p class="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
            {{ article.summary }}
          </p>
          <div class="flex items-center justify-between pt-3 border-t border-black/5">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-primary-500 flex items-center justify-center text-white text-[10px] font-bold">
                {{ article.author.charAt(0) }}
              </div>
              <span class="text-[11px] text-gray-500">{{ article.author }}</span>
            </div>
            <div class="flex items-center gap-3 text-[11px] text-gray-400">
              <span class="flex items-center gap-0.5">
                <Clock class="w-3 h-3" />
                {{ article.readTime }}分钟
              </span>
              <span class="flex items-center gap-0.5">
                <Eye class="w-3 h-3" />
                {{ formatViews(article.views) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  Eye,
} from 'lucide-vue-next'
import { fetchAiArticles } from '@/api/categories'
import type { AiArticle } from '@/types'

const aiArticles = ref<AiArticle[]>([])

function formatViews(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

async function loadAiArticles() {
  try {
    aiArticles.value = await fetchAiArticles(6)
  } catch (e) {
    console.error('Failed to load AI articles:', e)
  }
}

onMounted(() => {
  loadAiArticles()
})
</script>
