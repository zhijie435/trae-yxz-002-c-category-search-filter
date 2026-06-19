<template>
  <div class="flex gap-4 mb-8">
    <aside class="w-56 flex-shrink-0">
      <div class="bg-white rounded-2xl border border-black/5 shadow-soft overflow-hidden">
        <div class="px-4 py-3 border-b border-black/5 bg-gradient-to-r from-primary-50 to-white">
          <div class="flex items-center gap-2">
            <LayoutGrid class="w-4 h-4 text-primary-600" />
            <span class="text-sm font-bold text-ink">全部商品分类</span>
          </div>
        </div>
        <ul class="py-1">
          <li
            v-for="(cat, index) in scenarioCategories"
            :key="cat.id"
            :class="[
              'relative px-4 py-2.5 cursor-pointer transition-colors group',
              activeIndex === index
                ? 'bg-primary-50 border-l-2 border-primary-600'
                : 'hover:bg-gray-50 border-l-2 border-transparent',
            ]"
            @mouseenter="handleCategoryHover(index)"
            @click="handleCategoryClick(index)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    activeIndex === index
                      ? colorMap[cat.color]?.iconBgActive || 'bg-primary-100'
                      : 'bg-gray-50 group-hover:bg-gray-100',
                  ]"
                >
                  <component
                    :is="iconMap[cat.icon]"
                    :class="[
                      'w-4 h-4 transition-colors',
                      activeIndex === index
                        ? colorMap[cat.color]?.iconTextActive || 'text-primary-600'
                        : 'text-gray-500 group-hover:text-gray-700',
                    ]"
                  />
                </div>
                <div>
                  <div
                    :class="[
                      'text-sm font-medium transition-colors',
                      activeIndex === index ? 'text-primary-700' : 'text-ink',
                    ]"
                  >
                    {{ cat.name }}
                  </div>
                  <div class="text-[10px] text-gray-400">{{ cat.count }}款机器人</div>
                </div>
              </div>
              <ChevronRight
                :class="[
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  activeIndex === index ? 'text-primary-500' : 'text-gray-300',
                ]"
              />
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <div
      v-if="activeCategory && activeCategory.children"
      class="w-72 flex-shrink-0 bg-white rounded-2xl border border-black/5 shadow-soft p-5 min-h-[420px]"
    >
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-1">
          <component
            :is="iconMap[activeCategory.icon]"
            :class="['w-5 h-5', colorMap[activeCategory.color]?.iconTextActive || 'text-primary-600']"
          />
          <h3 class="text-base font-bold text-ink">{{ activeCategory.name }}</h3>
          <span class="text-xs text-gray-400">共{{ activeCategory.count }}款机器人</span>
        </div>
        <p class="text-xs text-gray-500">{{ activeCategory.description }}</p>
      </div>

      <div class="space-y-5">
        <div
          v-for="sub in activeCategory.children"
          :key="sub.id"
          class="group"
        >
          <div class="flex items-center gap-2 mb-2">
            <div
              :class="[
                'w-1 h-4 rounded-full',
                colorMap[activeCategory.color]?.iconBgActive || 'bg-primary-500',
              ]"
            />
            <h4 class="text-sm font-bold text-ink">{{ sub.name }}</h4>
            <span class="text-[11px] text-gray-400">{{ sub.count }}款</span>
          </div>
          <div v-if="sub.children && sub.children.length > 0" class="flex flex-wrap gap-2 pl-3">
            <button
              v-for="third in sub.children"
              :key="third.id"
              class="px-3 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
            >
              {{ third.name }}
              <span class="text-gray-300 ml-1">({{ third.count }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 bg-white rounded-2xl border border-black/5 shadow-soft p-5 min-h-[420px]">
      <div class="flex items-center gap-2 mb-4">
        <Boxes class="w-5 h-5 text-primary-600" />
        <h3 class="text-base font-bold text-ink">商品展示</h3>
        <span class="text-xs text-gray-400">按二级分类分组</span>
      </div>

      <div v-if="productsLoading" class="py-20 text-center text-sm text-gray-400">
        加载中...
      </div>

      <div
        v-else-if="productGroups.length === 0"
        class="py-20 text-center text-sm text-gray-400"
      >
        暂无商品
      </div>

      <div v-else class="space-y-6">
        <div v-for="group in productGroups" :key="group.id">
          <div class="flex items-center gap-2 mb-3">
            <div :class="['w-1 h-4 rounded-full', activeAccent]" />
            <h4 class="text-sm font-bold text-ink">{{ group.name }}</h4>
            <span class="text-[11px] text-gray-400">{{ group.products.length }}款商品</span>
          </div>
          <div v-if="group.products.length > 0" class="grid grid-cols-2 gap-4">
            <RobotCard
              v-for="robot in group.products"
              :key="robot.id"
              :robot="robot"
            />
          </div>
          <div v-else class="pl-3 py-2 text-xs text-gray-400">
            该分类暂无商品
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  LayoutGrid,
  ChevronRight,
  Boxes,
  Factory,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Package,
  ShieldCheck,
  Sprout,
  Home,
} from 'lucide-vue-next'
import { fetchScenarioCategories, fetchCategoryProducts } from '@/api/categories'
import RobotCard from '@/components/RobotCard.vue'
import type { ScenarioCategory, CategoryProductGroup } from '@/types'

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

const colorMap: Record<
  string,
  { iconBgActive: string; iconTextActive: string }
> = {
  'from-blue-500': {
    iconBgActive: 'bg-blue-100',
    iconTextActive: 'text-blue-600',
  },
  'from-orange-500': {
    iconBgActive: 'bg-orange-100',
    iconTextActive: 'text-orange-600',
  },
  'from-emerald-500': {
    iconBgActive: 'bg-emerald-100',
    iconTextActive: 'text-emerald-600',
  },
  'from-violet-500': {
    iconBgActive: 'bg-violet-100',
    iconTextActive: 'text-violet-600',
  },
  'from-cyan-500': {
    iconBgActive: 'bg-cyan-100',
    iconTextActive: 'text-cyan-600',
  },
  'from-rose-500': {
    iconBgActive: 'bg-rose-100',
    iconTextActive: 'text-rose-600',
  },
  'from-lime-500': {
    iconBgActive: 'bg-lime-100',
    iconTextActive: 'text-lime-600',
  },
  'from-pink-500': {
    iconBgActive: 'bg-pink-100',
    iconTextActive: 'text-pink-600',
  },
}

const scenarioCategories = ref<ScenarioCategory[]>([])
const activeIndex = ref(0)
const productGroups = ref<CategoryProductGroup[]>([])
const productsLoading = ref(false)
let productRequestId = 0

const activeCategory = computed(() => {
  if (scenarioCategories.value.length === 0) return null
  return scenarioCategories.value[activeIndex.value]
})

const activeAccent = computed(
  () => colorMap[activeCategory.value?.color ?? '']?.iconBgActive || 'bg-primary-500',
)

function handleCategoryHover(index: number) {
  activeIndex.value = index
}

function handleCategoryClick(index: number) {
  activeIndex.value = index
}

async function loadScenarioCategories() {
  try {
    scenarioCategories.value = await fetchScenarioCategories()
  } catch (e) {
    console.error('Failed to load scenario categories:', e)
  }
}

async function loadCategoryProducts() {
  const cat = activeCategory.value
  if (!cat) return
  const requestId = ++productRequestId
  productsLoading.value = true
  try {
    const data = await fetchCategoryProducts(cat.id)
    if (requestId !== productRequestId) return
    productGroups.value = data
  } catch (e) {
    if (requestId !== productRequestId) return
    console.error('Failed to load category products:', e)
    productGroups.value = []
  } finally {
    if (requestId === productRequestId) {
      productsLoading.value = false
    }
  }
}

watch(activeCategory, () => {
  loadCategoryProducts()
})

onMounted(() => {
  loadScenarioCategories()
})
</script>
