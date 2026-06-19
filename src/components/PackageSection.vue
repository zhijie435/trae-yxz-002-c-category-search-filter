<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <Gift class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">套餐推荐</h2>
        <span class="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[11px] font-bold">
          超值优惠
        </span>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        全部套餐
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 cursor-pointer group"
      >
        <div class="flex">
          <div class="relative w-48 flex-shrink-0 overflow-hidden bg-gray-50">
            <img
              :src="pkg.image"
              :alt="pkg.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md text-[11px] font-bold">
              {{ pkg.tag }}
            </div>
          </div>
          <div class="flex-1 p-4 flex flex-col min-w-0">
            <h3 class="text-base font-bold text-ink line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
              {{ pkg.name }}
            </h3>
            <p class="text-xs text-gray-500 line-clamp-1 mb-3">
              {{ pkg.description }}
            </p>
            <div class="flex flex-wrap gap-1 mb-3 max-h-14 overflow-hidden">
              <span
                v-for="(item, idx) in pkg.items.slice(0, 3)"
                :key="idx"
                class="px-2 py-0.5 bg-gray-50 rounded-md text-[10px] text-gray-600"
              >
                {{ item.name }} × {{ item.quantity }}
              </span>
              <span
                v-if="pkg.items.length > 3"
                class="px-2 py-0.5 bg-gray-50 rounded-md text-[10px] text-gray-400"
              >
                +{{ pkg.items.length - 3 }}项
              </span>
            </div>
            <div class="mt-auto flex items-end justify-between">
              <div>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl font-bold text-rose-500">¥{{ pkg.discountPrice.toLocaleString() }}</span>
                  <span class="text-xs text-gray-300 line-through">¥{{ pkg.originalPrice.toLocaleString() }}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-1.5 py-0.5 bg-rose-50 text-rose-500 rounded text-[10px] font-bold">
                    省¥{{ pkg.saveAmount.toLocaleString() }}
                  </span>
                  <span class="text-[10px] text-gray-400">{{ pkg.validPeriod }}</span>
                </div>
              </div>
              <button class="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1">
                立即抢购
                <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Gift, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { fetchPackages } from '@/api/categories'
import type { Package as PackageType } from '@/types'

const packages = ref<PackageType[]>([])

async function loadPackages() {
  try {
    packages.value = await fetchPackages()
  } catch (e) {
    console.error('Failed to load packages:', e)
  }
}

onMounted(() => {
  loadPackages()
})
</script>
