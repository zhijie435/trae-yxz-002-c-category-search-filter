<template>
  <header class="sticky top-0 z-40 w-full bg-canvas/80 backdrop-blur-xl border-b border-black/5">
    <div class="max-w-7xl mx-auto px-6 pt-6 pb-5">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="grid place-items-center w-10 h-10 rounded-xl bg-primary-600 text-white shadow-lift">
            <Bot class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-ink leading-tight">机器人检索平台</h1>
            <p class="text-xs text-gray-500 font-medium">按名称 · 场景 · 型号 精准检索</p>
          </div>
        </div>
        <div
          v-if="total !== undefined"
          class="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>共 {{ total }} 款机器人</span>
        </div>
      </div>

      <div class="relative" ref="containerRef">
        <div
          class="flex items-stretch rounded-2xl overflow-hidden bg-white border border-black/10 shadow-soft transition-all focus-within:border-primary-400 focus-within:shadow-lift"
        >
          <div class="flex items-stretch border-r border-black/5 bg-gray-50/60">
            <button
              v-for="opt in fieldOptions"
              :key="opt.value"
              @click="currentField = opt.value"
              :class="[
                'px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5',
                currentField === opt.value
                  ? 'text-primary-600 bg-white'
                  : 'text-gray-500 hover:text-ink',
              ]"
            >
              <component :is="opt.icon" class="w-4 h-4" />
              {{ opt.label }}
            </button>
          </div>

          <div class="flex-1 flex items-center relative min-w-0">
            <Search class="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input
              ref="inputRef"
              v-model="keyword"
              type="text"
              :placeholder="placeholderText"
              class="flex-1 min-w-0 px-3 py-3.5 text-base outline-none bg-transparent placeholder:text-gray-400"
              @input="onInput"
              @focus="showSuggestions = true"
              @keydown.enter="handleSearch"
              @keydown.esc="showSuggestions = false"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
            />
            <button
              v-if="keyword"
              @click="clearKeyword"
              class="p-1 mr-1 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="清除关键词"
            >
              <X class="w-5 h-5" />
            </button>
            <button
              @click="handleSearch"
              class="m-1.5 px-5 sm:px-7 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Search class="w-4 h-4" />
              <span class="hidden sm:inline">搜索</span>
            </button>
          </div>
        </div>

        <Transition name="fade">
          <div
            v-if="showSuggestions && suggestions.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lift border border-black/5 overflow-hidden z-50"
          >
            <div
              class="px-4 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400"
            >
              联想建议
            </div>
            <div class="pb-1">
              <div
                v-for="(item, idx) in suggestions"
                :key="item"
                @mousedown.prevent="selectSuggestion(item)"
                @mouseenter="highlightedIndex = idx"
                :class="[
                  'px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors',
                  highlightedIndex === idx
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                <Search class="w-4 h-4 text-gray-400 shrink-0" />
                <span class="text-sm font-medium">{{ item }}</span>
                <span class="ml-auto text-xs text-gray-400">{{ fieldLabel }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { Search, Bot, X, Tag, Cpu, Settings2, Sparkles } from 'lucide-vue-next'
import { fetchSuggestions } from '@/api/robots'
import type { SearchField } from '@/types'

interface FieldOption {
  value: SearchField
  label: string
  icon: typeof Search
}

const fieldOptions: FieldOption[] = [
  { value: 'name', label: '机器人名称', icon: Tag },
  { value: 'scenario', label: '应用场景', icon: Settings2 },
  { value: 'model', label: '型号', icon: Cpu },
]

defineProps<{ total?: number }>()

const emit = defineEmits<{
  (e: 'search', payload: { keyword: string; field: SearchField }): void
}>()

const currentField = ref<SearchField>('name')
const keyword = ref('')
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const placeholderText = computed(() => {
  const map: Record<SearchField, string> = {
    name: '请输入机器人名称，如：星尘、智行、康护',
    scenario: '请输入应用场景，如：工业制造、医疗健康、教育培训',
    model: '请输入型号，如：XC-W100、ZX-H200',
  }
  return map[currentField.value]
})

const fieldLabel = computed(() => {
  return fieldOptions.find((o) => o.value === currentField.value)?.label ?? ''
})

function onInput() {
  highlightedIndex.value = -1
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!keyword.value.trim()) {
    suggestions.value = []
    return
  }
  debounceTimer = setTimeout(async () => {
    try {
      suggestions.value = await fetchSuggestions(keyword.value, currentField.value)
    } catch {
      suggestions.value = []
    }
  }, 200)
}

function selectSuggestion(value: string) {
  keyword.value = value
  showSuggestions.value = false
  handleSearch()
}

function highlightNext() {
  if (suggestions.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length
}

function highlightPrev() {
  if (suggestions.value.length === 0) return
  highlightedIndex.value =
    highlightedIndex.value <= 0 ? suggestions.value.length - 1 : highlightedIndex.value - 1
}

function handleSearch() {
  showSuggestions.value = false
  if (highlightedIndex.value >= 0 && highlightedIndex.value < suggestions.value.length) {
    keyword.value = suggestions.value[highlightedIndex.value]
  }
  highlightedIndex.value = -1
  emit('search', { keyword: keyword.value.trim(), field: currentField.value })
}

function clearKeyword() {
  keyword.value = ''
  suggestions.value = []
  inputRef.value?.focus()
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    showSuggestions.value = false
  }
}

watch(currentField, () => {
  keyword.value = ''
  suggestions.value = []
  highlightedIndex.value = -1
  inputRef.value?.focus()
})

document.addEventListener('click', handleClickOutside)
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
