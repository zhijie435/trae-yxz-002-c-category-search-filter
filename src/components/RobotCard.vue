<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-soft hover:shadow-lift transition-all duration-300 group">
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img
        :src="robot.image"
        :alt="robot.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-primary-700">
        {{ robot.scenario }}
      </div>
      <div class="absolute bottom-3 right-3 flex flex-col gap-1 items-end">
        <div class="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md">
          已售 {{ robot.sales }} 台
        </div>
        <div class="px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md">
          已租 {{ robot.rentedCount }} 次
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="mb-2">
        <h3 class="text-base font-bold text-ink leading-snug truncate" :title="robot.name">
          {{ robot.name.length > 10 ? robot.name.slice(0, 10) + '…' : robot.name }}
        </h3>
      </div>
      <p class="text-xs text-gray-500 mb-3">
        型号：{{ robot.model }} · 品牌：{{ robot.brand }}
      </p>
      <div class="flex items-end justify-between mb-3 pb-3 border-b border-gray-100">
        <div>
          <div class="flex items-baseline gap-0.5">
            <span class="text-xs text-rose-500 font-medium">¥</span>
            <span class="text-2xl font-extrabold text-rose-600 leading-none">
              {{ robot.dailyPrice }}
            </span>
            <span class="text-[11px] text-gray-400 ml-1">/天</span>
          </div>
          <div class="text-[11px] text-gray-400 mt-1">
            售价 ¥{{ robot.price.toLocaleString() }}
          </div>
        </div>
        <div class="flex items-center gap-1 text-[11px] text-amber-500">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
          <span class="font-bold">{{ robot.rating }}</span>
        </div>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="spec in robot.specs"
          :key="spec.label"
          class="px-2 py-1 bg-gray-50 rounded-md text-[11px] text-gray-600"
        >
          {{ spec.label }}：{{ spec.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Robot } from '@/types'

defineProps<{
  robot: Robot
}>()
</script>
