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
              activeCategory1Id === cat.id
                ? 'bg-primary-50 border-l-2 border-primary-600'
                : 'hover:bg-gray-50 border-l-2 border-transparent',
            ]"
            @mouseenter="handleCategory1Hover(cat.id)"
            @click="handleCategory1Click(cat.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    activeCategory1Id === cat.id
                      ? colorMap[cat.color]?.iconBgActive || 'bg-primary-100'
                      : 'bg-gray-50 group-hover:bg-gray-100',
                  ]"
                >
                  <component
                    :is="iconMap[cat.icon]"
                    :class="[
                      'w-4 h-4 transition-colors',
                      activeCategory1Id === cat.id
                        ? colorMap[cat.color]?.iconTextActive || 'text-primary-600'
                        : 'text-gray-500 group-hover:text-gray-700',
                    ]"
                  />
                </div>
                <div>
                  <div
                    :class="[
                      'text-sm font-medium transition-colors',
                      activeCategory1Id === cat.id ? 'text-primary-700' : 'text-ink',
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
                  activeCategory1Id === cat.id ? 'text-primary-500' : 'text-gray-300',
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

      <div class="space-y-3">
        <div
          v-for="sub in activeCategory.children"
          :key="sub.id"
          class="group"
        >
          <div
            class="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
            :class="[
              activeCategory2Id === sub.id
                ? 'bg-primary-50'
                : 'hover:bg-gray-50',
            ]"
            @click="handleCategory2Click(sub.id)"
          >
            <div
              :class="[
                'w-1 h-4 rounded-full flex-shrink-0',
                activeCategory2Id === sub.id
                  ? colorMap[activeCategory.color]?.iconBgActive || 'bg-primary-500'
                  : 'bg-gray-200',
              ]"
            />
            <h4
              :class="[
                'text-sm font-bold transition-colors',
                activeCategory2Id === sub.id
                  ? 'text-primary-700'
                  : 'text-ink',
              ]"
            >
              {{ sub.name }}
            </h4>
            <span class="text-[11px] text-gray-400">{{ sub.count }}款</span>
          </div>
        </div>
      </div>

      <div
        v-if="activeSubCategory && activeSubCategory.children && activeSubCategory.children.length > 0"
        class="mt-4 pt-4 border-t border-gray-100"
      >
        <div class="flex items-center gap-2 mb-3">
          <component
            :is="iconMap[activeCategory.icon]"
            :class="['w-4 h-4', colorMap[activeCategory.color]?.iconTextActive || 'text-primary-600']"
          />
          <span class="text-xs font-medium text-gray-500">{{ activeSubCategory.name }} - 细分分类</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="third in activeSubCategory.children"
            :key="third.id"
            :class="[
              'px-3 py-1.5 text-xs rounded-lg transition-colors',
              activeCategory3Id === third.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-600',
            ]"
            @click="handleCategory3Click(third.id)"
          >
            {{ third.name }}
            <span :class="activeCategory3Id === third.id ? 'text-white/70' : 'text-gray-300'" class="ml-1">({{ third.count }})</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 bg-white rounded-2xl border border-black/5 shadow-soft p-5 min-h-[420px]">
      <div class="flex items-center gap-2 mb-4">
        <Boxes class="w-5 h-5 text-primary-600" />
        <h3 class="text-base font-bold text-ink">商品展示</h3>
        <span class="text-xs text-gray-400">
          {{ activeCategory3Id ? '按三级分类展示' : activeCategory2Id ? '按三级分类分组' : '按二级分类分组' }}
        </span>
      </div>

      <div class="mb-4 bg-gray-50 rounded-xl p-4 space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-gray-500 whitespace-nowrap w-12">排序</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in sortOptions"
              :key="opt.value"
              :class="[
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                queryParams.sort === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
              @click="handleSortChange(opt.value)"
            >
              <component :is="opt.icon" class="w-3.5 h-3.5" />
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-gray-500 whitespace-nowrap w-12">价格</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(range, idx) in priceRanges"
              :key="idx"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activePriceRange === idx
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
              @click="handlePriceSelect(idx)"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-gray-500 whitespace-nowrap w-12">
            <Truck class="w-3.5 h-3.5 inline mr-1" />
            配送
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                queryParams.delivery === undefined
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
              @click="handleDeliverySelect(undefined)"
            >
              全部
            </button>
            <button
              v-for="opt in deliveryOptions"
              :key="opt.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                queryParams.delivery === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
              @click="handleDeliverySelect(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div class="flex justify-end pt-2 border-t border-gray-200">
          <button
            class="text-xs text-gray-500 hover:text-primary-600 transition-colors"
            @click="resetFilters"
          >
            重置筛选
          </button>
        </div>
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
import { ref, computed, watch, onMounted, reactive } from 'vue'
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
  Star,
  TrendingUp,
  Zap,
  Clock,
  ThumbsUp,
  Truck,
  DollarSign,
} from 'lucide-vue-next'
import { fetchScenarioCategories, fetchCategoryProducts } from '@/api/categories'
import RobotCard from '@/components/RobotCard.vue'
import type { ScenarioCategory, CategoryProductGroup, ProductQueryParams, SortType } from '@/types'

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
const activeCategory1Id = ref<string>('')
const activeCategory2Id = ref<string>('')
const activeCategory3Id = ref<string>('')
const productGroups = ref<CategoryProductGroup[]>([])
const productsLoading = ref(false)
let productRequestId = 0

const queryParams = reactive<ProductQueryParams>({
  category1Id: undefined,
  category2Id: undefined,
  category3Id: undefined,
  sort: 'default',
  minPrice: undefined,
  maxPrice: undefined,
  delivery: undefined,
})

const activeCategory = computed(() => {
  if (!activeCategory1Id.value) return null
  return scenarioCategories.value.find((c) => c.id === activeCategory1Id.value) || null
})

const activeSubCategory = computed(() => {
  const cat = activeCategory.value
  if (!cat || !cat.children || !activeCategory2Id.value) return null
  return cat.children.find((sub) => sub.id === activeCategory2Id.value) || null
})

const activeAccent = computed(
  () => colorMap[activeCategory.value?.color ?? '']?.iconBgActive || 'bg-primary-500',
)

interface SortOption {
  label: string
  value: SortType
  icon: any
}

const sortOptions: SortOption[] = [
  { label: '默认', value: 'default', icon: Star },
  { label: '销量', value: 'sales', icon: TrendingUp },
  { label: '人气', value: 'popularity', icon: Zap },
  { label: '最新', value: 'newest', icon: Clock },
  { label: '好评', value: 'rating', icon: ThumbsUp },
  { label: '价格↓', value: 'price-desc', icon: DollarSign },
  { label: '价格↑', value: 'price-asc', icon: DollarSign },
]

const deliveryOptions = [
  { label: '送货上门', value: '送货上门' },
  { label: '上门安装', value: '上门安装' },
  { label: '全国联保', value: '全国联保' },
  { label: '专业培训', value: '专业培训' },
  { label: '驻场调试', value: '驻场调试' },
  { label: '快递包邮', value: '快递包邮' },
  { label: '一年保修', value: '一年保修' },
  { label: '三年保修', value: '三年保修' },
  { label: '7天无理由', value: '7天无理由' },
  { label: '技术支持', value: '技术支持' },
]

const priceRanges = [
  { label: '全部', min: undefined, max: undefined },
  { label: '1万以下', min: undefined, max: 10000 },
  { label: '1万-5万', min: 10000, max: 50000 },
  { label: '5万-10万', min: 50000, max: 100000 },
  { label: '10万-20万', min: 100000, max: 200000 },
  { label: '20万以上', min: 200000, max: undefined },
]

const activePriceRange = ref(0)

function handleSortChange(value: SortType) {
  queryParams.sort = value
}

function handlePriceSelect(index: number) {
  activePriceRange.value = index
  queryParams.minPrice = priceRanges[index].min
  queryParams.maxPrice = priceRanges[index].max
}

function handleDeliverySelect(value: string | undefined) {
  queryParams.delivery = value
}

function resetFilters() {
  queryParams.sort = 'default'
  queryParams.minPrice = undefined
  queryParams.maxPrice = undefined
  queryParams.delivery = undefined
  activePriceRange.value = 0
}

function handleCategory1Hover(categoryId: string) {
  if (activeCategory1Id.value === categoryId) return
  activeCategory1Id.value = categoryId
  const cat = scenarioCategories.value.find((c) => c.id === categoryId)
  if (cat && cat.children && cat.children.length > 0) {
    activeCategory2Id.value = cat.children[0].id
    activeCategory3Id.value = ''
  } else {
    activeCategory2Id.value = ''
    activeCategory3Id.value = ''
  }
}

function handleCategory1Click(categoryId: string) {
  resetFilters()
  activeCategory1Id.value = categoryId
  queryParams.category1Id = categoryId
  queryParams.category2Id = undefined
  queryParams.category3Id = undefined
  const cat = scenarioCategories.value.find((c) => c.id === categoryId)
  if (cat && cat.children && cat.children.length > 0) {
    activeCategory2Id.value = cat.children[0].id
    activeCategory3Id.value = ''
  } else {
    activeCategory2Id.value = ''
    activeCategory3Id.value = ''
  }
}

function handleCategory2Click(subId: string) {
  activeCategory2Id.value = activeCategory2Id.value === subId ? '' : subId
  if (activeCategory2Id.value) {
    queryParams.category2Id = subId
    queryParams.category3Id = undefined
    activeCategory3Id.value = ''
  } else {
    queryParams.category2Id = undefined
    queryParams.category3Id = undefined
    activeCategory3Id.value = ''
  }
}

function handleCategory3Click(thirdId: string) {
  activeCategory3Id.value = activeCategory3Id.value === thirdId ? '' : thirdId
  queryParams.category3Id = activeCategory3Id.value || undefined
}

async function loadScenarioCategories() {
  try {
    scenarioCategories.value = await fetchScenarioCategories()
    const firstCat = scenarioCategories.value[0]
    if (firstCat) {
      activeCategory1Id.value = firstCat.id
      queryParams.category1Id = firstCat.id
      if (firstCat.children && firstCat.children.length > 0) {
        activeCategory2Id.value = firstCat.children[0].id
        queryParams.category2Id = firstCat.children[0].id
      }
    }
  } catch (e) {
    console.error('Failed to load scenario categories:', e)
  }
}

async function loadCategoryProducts() {
  const requestId = ++productRequestId
  productsLoading.value = true
  try {
    const params: ProductQueryParams = {
      category1Id: queryParams.category1Id,
      category2Id: queryParams.category2Id,
      category3Id: queryParams.category3Id,
      sort: queryParams.sort,
      minPrice: queryParams.minPrice,
      maxPrice: queryParams.maxPrice,
      delivery: queryParams.delivery,
    }
    const data = await fetchCategoryProducts(params)
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

watch(
  () => ({
    category1Id: queryParams.category1Id,
    category2Id: queryParams.category2Id,
    category3Id: queryParams.category3Id,
    sort: queryParams.sort,
    minPrice: queryParams.minPrice,
    maxPrice: queryParams.maxPrice,
    delivery: queryParams.delivery,
  }),
  () => {
    loadCategoryProducts()
  },
  { deep: true },
)

onMounted(() => {
  loadScenarioCategories()
})
</script>
