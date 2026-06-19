<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <Building2 class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-bold text-ink">厂商推荐</h2>
      </div>
      <button class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        更多厂商
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div
        v-for="m in manufacturers"
        :key="m.id"
        class="bg-white rounded-2xl p-4 border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-start gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-black/5 flex-shrink-0">
            <img :src="m.logo" :alt="m.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-ink truncate group-hover:text-primary-600 transition-colors">
              {{ m.name }}
            </div>
            <div class="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin class="w-3 h-3" />
              {{ m.country }} · {{ m.establishedYear }}年
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[32px]">
          {{ m.tagline }}
        </p>
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="cat in m.categories"
            :key="cat"
            class="px-2 py-0.5 bg-primary-50 rounded-md text-[10px] text-primary-600 font-medium"
          >
            {{ cat }}
          </span>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-black/5">
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <Bot class="w-3.5 h-3.5" />
            <span>{{ m.robotCount }} 款机器人</span>
          </div>
          <span class="text-xs text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            进入店铺
            <ArrowRight class="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Building2,
  ChevronRight,
  MapPin,
  Bot,
  ArrowRight,
} from 'lucide-vue-next'
import { fetchManufacturers } from '@/api/categories'
import type { Manufacturer } from '@/types'

const manufacturers = ref<Manufacturer[]>([])

async function loadManufacturers() {
  try {
    manufacturers.value = await fetchManufacturers()
  } catch (e) {
    console.error('Failed to load manufacturers:', e)
  }
}

onMounted(() => {
  loadManufacturers()
})
</script>
