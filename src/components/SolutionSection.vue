<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">解决方案</h2>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        更多方案
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="sol in solutions"
        :key="sol.id"
        class="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 cursor-pointer group"
      >
        <div class="relative h-44 overflow-hidden bg-gray-50">
          <img
            :src="sol.cover"
            :alt="sol.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div class="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur rounded-full text-[11px] font-bold text-primary-700">
            {{ sol.category }}
          </div>
          <div class="absolute top-3 right-3 px-2.5 py-1 bg-primary-600 rounded-full text-[11px] font-bold text-white">
            {{ sol.tag }}
          </div>
          <div class="absolute bottom-3 left-4 right-4">
            <h3 class="text-base font-bold text-white line-clamp-1 group-hover:text-primary-100 transition-colors">
              {{ sol.title }}
            </h3>
          </div>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[40px]">
            {{ sol.description }}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="feat in sol.features.slice(0, 4)"
              :key="feat"
              class="px-2 py-1 bg-gray-50 rounded-md text-[11px] text-gray-600 flex items-center gap-1"
            >
              <Check class="w-3 h-3 text-emerald-500" />
              {{ feat }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-black/5">
            <div class="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Users class="w-3.5 h-3.5" />
              <span>{{ sol.customerCases.length }} 个客户案例</span>
            </div>
            <span class="text-xs text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              查看详情
              <ArrowRight class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Lightbulb,
  ChevronRight,
  Check,
  Users,
  ArrowRight,
} from 'lucide-vue-next'
import { fetchSolutions } from '@/api/categories'
import type { Solution } from '@/types'

const solutions = ref<Solution[]>([])

async function loadSolutions() {
  try {
    solutions.value = await fetchSolutions()
  } catch (e) {
    console.error('Failed to load solutions:', e)
  }
}

onMounted(() => {
  loadSolutions()
})
</script>
