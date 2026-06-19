<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <ShoppingBag class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">周边热销</h2>
        <span class="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[11px] font-bold flex items-center gap-0.5">
          <Flame class="w-3 h-3" />
          HOT
        </span>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        全部配件
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="item in hotAccessories"
        :key="item.id"
        class="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 cursor-pointer group"
      >
        <div class="relative aspect-square overflow-hidden bg-gray-50">
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-2 left-2 flex gap-1">
            <span
              v-for="tag in item.tags"
              :key="tag"
              :class="[
                'px-2 py-0.5 rounded-md text-[10px] font-bold',
                tag === '热销' ? 'bg-rose-500 text-white' :
                tag === '新品' ? 'bg-primary-500 text-white' :
                'bg-amber-500 text-white',
              ]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <div class="text-[11px] text-gray-400 mb-1">{{ item.category }} · {{ item.brand }}</div>
          <h3 class="text-sm font-bold text-ink line-clamp-2 mb-2 min-h-[40px] group-hover:text-primary-600 transition-colors">
            {{ item.name }}
          </h3>
          <p class="text-[11px] text-gray-500 line-clamp-2 mb-3 min-h-[32px]">
            {{ item.description }}
          </p>
          <div class="flex items-end justify-between">
            <div>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-bold text-rose-500">¥{{ item.price.toLocaleString() }}</span>
                <span
                  v-if="item.originalPrice"
                  class="text-[11px] text-gray-300 line-through"
                >
                  ¥{{ item.originalPrice.toLocaleString() }}
                </span>
              </div>
              <div class="text-[10px] text-gray-400 mt-0.5">
                已售 {{ formatSales(item.sales) }}
              </div>
            </div>
            <div class="flex items-center gap-0.5 text-amber-500">
              <Star class="w-3 h-3 fill-current" />
              <span class="text-xs font-medium">{{ item.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShoppingBag, ChevronRight, Flame, Star } from 'lucide-vue-next'
import { fetchHotAccessories } from '@/api/categories'
import type { Accessory } from '@/types'

const hotAccessories = ref<Accessory[]>([])

function formatSales(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

async function loadHotAccessories() {
  try {
    hotAccessories.value = await fetchHotAccessories(8)
  } catch (e) {
    console.error('Failed to load hot accessories:', e)
  }
}

onMounted(() => {
  loadHotAccessories()
})
</script>
