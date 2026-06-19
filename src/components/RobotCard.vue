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
    </div>
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3 class="text-base font-bold text-ink leading-snug">{{ robot.name }}</h3>
      </div>
      <p class="text-xs text-gray-500 mb-3">
        型号：{{ robot.model }} · 品牌：{{ robot.brand }}
      </p>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ robot.description }}</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="spec in robot.specs"
          :key="spec.label"
          class="px-2 py-1 bg-gray-50 rounded-md text-[11px] text-gray-600"
        >
          {{ spec.label }}：{{ spec.value }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-lg font-bold text-primary-600">
          ¥{{ robot.price.toLocaleString() }}
        </div>
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
