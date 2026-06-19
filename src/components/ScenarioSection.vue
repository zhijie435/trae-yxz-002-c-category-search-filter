<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <LayoutGrid class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">场景选择</h2>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        查看全部
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <div
        v-for="item in scenarioCategories"
        :key="item.id"
        class="group cursor-pointer"
      >
        <div
          :class="[
            'relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 border border-black/5 hover:shadow-lift bg-gradient-to-br overflow-hidden',
            colorMap[item.color].cardBg,
            colorMap[item.color].cardBgHover,
          ]"
        >
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 bg-gradient-to-br',
              colorMap[item.color].iconBg,
              colorMap[item.color].iconText,
            ]"
          >
            <component :is="iconMap[item.icon]" class="w-5 h-5" />
          </div>
          <div class="text-sm font-bold text-ink mb-0.5">{{ item.name }}</div>
          <div class="text-[11px] text-gray-500 text-center line-clamp-1">{{ item.count }} 款机器人</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  LayoutGrid,
  ChevronRight,
  Factory,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Package,
  ShieldCheck,
  Sprout,
  Home,
} from 'lucide-vue-next'
import { fetchScenarioCategories } from '@/api/categories'
import type { ScenarioCategory as ScenarioCategoryType } from '@/types'

const iconMap: Record<string, any> = {
  Factory,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Package,
  ShieldCheck,
  Sprout,
  Home,
}

const colorMap: Record<string, { cardBg: string; cardBgHover: string; iconBg: string; iconText: string }> = {
  'from-blue-500': {
    cardBg: 'from-blue-500/10 to-blue-50',
    cardBgHover: 'group-hover:from-blue-500/20 group-hover:to-blue-100',
    iconBg: 'from-blue-500/20 to-blue-200',
    iconText: 'text-blue-600',
  },
  'from-orange-500': {
    cardBg: 'from-orange-500/10 to-orange-50',
    cardBgHover: 'group-hover:from-orange-500/20 group-hover:to-orange-100',
    iconBg: 'from-orange-500/20 to-orange-200',
    iconText: 'text-orange-600',
  },
  'from-emerald-500': {
    cardBg: 'from-emerald-500/10 to-emerald-50',
    cardBgHover: 'group-hover:from-emerald-500/20 group-hover:to-emerald-100',
    iconBg: 'from-emerald-500/20 to-emerald-200',
    iconText: 'text-emerald-600',
  },
  'from-violet-500': {
    cardBg: 'from-violet-500/10 to-violet-50',
    cardBgHover: 'group-hover:from-violet-500/20 group-hover:to-violet-100',
    iconBg: 'from-violet-500/20 to-violet-200',
    iconText: 'text-violet-600',
  },
  'from-cyan-500': {
    cardBg: 'from-cyan-500/10 to-cyan-50',
    cardBgHover: 'group-hover:from-cyan-500/20 group-hover:to-cyan-100',
    iconBg: 'from-cyan-500/20 to-cyan-200',
    iconText: 'text-cyan-600',
  },
  'from-rose-500': {
    cardBg: 'from-rose-500/10 to-rose-50',
    cardBgHover: 'group-hover:from-rose-500/20 group-hover:to-rose-100',
    iconBg: 'from-rose-500/20 to-rose-200',
    iconText: 'text-rose-600',
  },
  'from-lime-500': {
    cardBg: 'from-lime-500/10 to-lime-50',
    cardBgHover: 'group-hover:from-lime-500/20 group-hover:to-lime-100',
    iconBg: 'from-lime-500/20 to-lime-200',
    iconText: 'text-lime-600',
  },
  'from-pink-500': {
    cardBg: 'from-pink-500/10 to-pink-50',
    cardBgHover: 'group-hover:from-pink-500/20 group-hover:to-pink-100',
    iconBg: 'from-pink-500/20 to-pink-200',
    iconText: 'text-pink-600',
  },
}

const scenarioCategories = ref<ScenarioCategoryType[]>([])

async function loadScenarioCategories() {
  try {
    scenarioCategories.value = await fetchScenarioCategories()
  } catch (e) {
    console.error('Failed to load scenario categories:', e)
  }
}

onMounted(() => {
  loadScenarioCategories()
})
</script>
