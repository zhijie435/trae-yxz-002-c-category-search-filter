<template>
  <div class="min-h-screen bg-canvas">
    <SearchBar :total="total" @search="handleSearch" />

    <main class="max-w-7xl mx-auto px-6 py-8">
      <LeftCategorySidebar />

      <ManufacturerSection />

      <AiArticleSection />

      <AccessorySection />

      <PackageSection />

      <SolutionSection />

      <section class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <Layers class="w-5 h-5 text-primary-600" />
            <h2 class="text-lg font-bold text-ink">场景分类</h2>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              !selectedScenario
                ? 'bg-primary-600 text-white shadow-lift'
                : 'bg-white text-gray-600 border border-black/10 hover:border-primary-300 hover:text-primary-600',
            ]"
            @click="handleScenarioChange('')"
          >
            全部场景
          </button>
          <button
            v-for="scenario in scenarios"
            :key="scenario"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              selectedScenario === scenario
                ? 'bg-primary-600 text-white shadow-lift'
                : 'bg-white text-gray-600 border border-black/10 hover:border-primary-300 hover:text-primary-600',
            ]"
            @click="handleScenarioChange(scenario)"
          >
            {{ scenario }}
          </button>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <Bot class="w-5 h-5 text-primary-600" />
            <h2 class="text-lg font-bold text-ink">机器人列表</h2>
            <span class="text-sm text-gray-400 font-medium">
              共 {{ total }} 款
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">排序：</span>
            <select
              v-model="sortBy"
              class="px-3 py-2 text-sm rounded-xl border border-black/10 bg-white text-gray-600 outline-none focus:border-primary-400 transition-colors cursor-pointer"
              @change="loadRobots"
            >
              <option value="default">默认排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="name">按名称排序</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="py-20 text-center">
          <div class="inline-flex items-center gap-3 text-gray-500">
            <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>加载中...</span>
          </div>
        </div>

        <div
          v-else-if="robotList.length === 0"
          class="py-20 text-center bg-white rounded-2xl border border-black/5"
        >
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-base font-medium text-gray-700 mb-2">
            暂无匹配的机器人
          </p>
          <p class="text-sm text-gray-400">试试其他关键词或筛选条件吧</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <RobotCard v-for="robot in robotList" :key="robot.id" :robot="robot" />
        </div>
      </section>
    </main>

    <footer class="mt-16 py-8 border-t border-black/5 bg-white">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-sm text-gray-400">
          © 2024 机器人检索平台 · 发现更多智能机器人
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bot, Layers } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
import RobotCard from '@/components/RobotCard.vue'
import LeftCategorySidebar from '@/components/LeftCategorySidebar.vue'
import ManufacturerSection from '@/components/ManufacturerSection.vue'
import AiArticleSection from '@/components/AiArticleSection.vue'
import AccessorySection from '@/components/AccessorySection.vue'
import PackageSection from '@/components/PackageSection.vue'
import SolutionSection from '@/components/SolutionSection.vue'
import { fetchRobots, fetchScenarios } from '@/api/robots'
import type { Robot, SearchField, SearchQuery, SortType } from '@/types'

const robotList = ref<Robot[]>([])
const total = ref(0)
const loading = ref(false)
const scenarios = ref<string[]>([])
const selectedScenario = ref('')
const sortBy = ref<SortType>('default')
const currentKeyword = ref('')
const currentField = ref<SearchField>('name')

async function loadScenarios() {
  try {
    scenarios.value = await fetchScenarios()
  } catch (e) {
    console.error('Failed to load scenarios:', e)
  }
}

async function loadRobots() {
  loading.value = true
  try {
    const params: SearchQuery = {
      keyword: currentKeyword.value || undefined,
      field: currentField.value,
      scenario: selectedScenario.value || undefined,
      sort: sortBy.value,
    }
    const result = await fetchRobots(params)
    robotList.value = result.list
    total.value = result.total
  } catch (e) {
    console.error('Failed to load robots:', e)
    robotList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch(payload: { keyword: string; field: SearchField }) {
  currentKeyword.value = payload.keyword
  currentField.value = payload.field
  loadRobots()
}

function handleScenarioChange(scenario: string) {
  selectedScenario.value = scenario
  loadRobots()
}

onMounted(() => {
  loadScenarios()
  loadRobots()
})
</script>
