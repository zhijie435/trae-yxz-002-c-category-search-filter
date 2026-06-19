import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../src/components/SearchBar.vue'

vi.mock('../src/api/robots', () => ({
  fetchSuggestions: vi.fn(),
}))

import { fetchSuggestions } from '../src/api/robots'

describe('SearchBar.vue - 搜索组件', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染', () => {
    it('正确渲染搜索栏结构', () => {
      const wrapper = mount(SearchBar, {
        props: { total: 100 },
      })
      expect(wrapper.find('header').exists()).toBe(true)
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('显示总数信息', () => {
      const wrapper = mount(SearchBar, {
        props: { total: 128 },
      })
      expect(wrapper.text()).toContain('128')
    })

    it('不传递 total 时不显示总数', () => {
      const wrapper = mount(SearchBar)
      expect(wrapper.text()).not.toContain('款机器人')
    })

    it('渲染三个搜索字段选项', () => {
      const wrapper = mount(SearchBar)
      const fieldButtons = wrapper.findAll('button').filter(
        (btn) =>
          btn.text().includes('机器人名称') ||
          btn.text().includes('应用场景') ||
          btn.text().includes('型号'),
      )
      expect(fieldButtons.length).toBe(3)
    })

    it('默认选中「机器人名称」字段', () => {
      const wrapper = mount(SearchBar)
      const activeFieldButton = wrapper.findAll('button').find((btn) => {
        return (
          btn.text().includes('机器人名称') &&
          btn.classes().some((c) => c.includes('text-primary'))
        )
      })
      expect(activeFieldButton).toBeDefined()
    })
  })

  describe('占位符文本', () => {
    it('名称字段显示对应占位符', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toContain('机器人名称')
    })

    it('切换到场景字段更新占位符', async () => {
      const wrapper = mount(SearchBar)
      const scenarioBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('应用场景'))
      await scenarioBtn?.trigger('click')
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toContain('应用场景')
    })

    it('切换到型号字段更新占位符', async () => {
      const wrapper = mount(SearchBar)
      const modelBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('型号'))
      await modelBtn?.trigger('click')
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toContain('型号')
    })
  })

  describe('字段切换', () => {
    it('点击字段按钮切换字段', async () => {
      const wrapper = mount(SearchBar)
      const modelBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('型号'))
      await modelBtn?.trigger('click')
      const activeButtons = wrapper.findAll('button').filter((btn) =>
        btn.classes().some((c) => c.includes('text-primary-600')),
      )
      expect(activeButtons.length).toBeGreaterThanOrEqual(1)
      expect(activeButtons[0].text()).toContain('型号')
    })

    it('切换字段时清空关键词', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('测试关键词')
      const scenarioBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('应用场景'))
      await scenarioBtn?.trigger('click')
      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('输入与清除', () => {
    it('输入内容后显示清除按钮', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('测试')
      const clearBtn = wrapper
        .findAll('button')
        .find((btn) => btn.attributes('aria-label') === '清除关键词')
      expect(clearBtn).toBeDefined()
      expect(clearBtn?.exists()).toBe(true)
    })

    it('无输入时不显示清除按钮', () => {
      const wrapper = mount(SearchBar)
      const clearBtn = wrapper
        .findAll('button')
        .find((btn) => btn.attributes('aria-label') === '清除关键词')
      expect(clearBtn).toBeUndefined()
    })

    it('点击清除按钮清空输入', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('测试关键词')
      const clearBtn = wrapper
        .findAll('button')
        .find((btn) => btn.attributes('aria-label') === '清除关键词')
      await clearBtn?.trigger('click')
      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('搜索触发', () => {
    it('点击搜索按钮触发 search 事件', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('星尘')
      const searchBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('搜索'))
      await searchBtn?.trigger('click')
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeDefined()
      expect(emitted?.length).toBe(1)
      expect(emitted?.[0][0]).toEqual({ keyword: '星尘', field: 'name' })
    })

    it('按回车键触发搜索', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('智行')
      await input.trigger('keydown.enter')
      const emitted = wrapper.emitted('search')
      expect(emitted).toBeDefined()
      expect(emitted?.[0][0]).toEqual({ keyword: '智行', field: 'name' })
    })

    it('搜索时自动去除关键词首尾空格', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('  康护  ')
      const searchBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('搜索'))
      await searchBtn?.trigger('click')
      const emitted = wrapper.emitted('search')
      expect(emitted?.[0][0].keyword).toBe('康护')
    })

    it('切换字段后搜索使用新字段值', async () => {
      const wrapper = mount(SearchBar)
      const modelBtn = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('型号'))
      await modelBtn?.trigger('click')
      const input = wrapper.find('input')
      await input.setValue('XC-W100')
      await input.trigger('keydown.enter')
      const emitted = wrapper.emitted('search')
      expect(emitted?.[0][0]).toEqual({ keyword: 'XC-W100', field: 'model' })
    })
  })

  describe('联想建议', () => {
    it('输入后触发联想建议请求（防抖200ms）', async () => {
      vi.mocked(fetchSuggestions).mockResolvedValue(['星尘机器人', '星尘焊接'])
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('星尘')
      await input.trigger('input')
      expect(fetchSuggestions).not.toHaveBeenCalled()
      vi.advanceTimersByTime(199)
      expect(fetchSuggestions).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(fetchSuggestions).toHaveBeenCalledWith('星尘', 'name')
    })

    it('快速输入取消前一次防抖请求', async () => {
      vi.mocked(fetchSuggestions).mockResolvedValue([])
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('星')
      await input.trigger('input')
      vi.advanceTimersByTime(100)
      await input.setValue('星尘')
      await input.trigger('input')
      vi.advanceTimersByTime(199)
      expect(fetchSuggestions).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(fetchSuggestions).toHaveBeenCalledTimes(1)
      expect(fetchSuggestions).toHaveBeenCalledWith('星尘', 'name')
    })

    it('清空输入后不请求联想建议', async () => {
      vi.mocked(fetchSuggestions).mockResolvedValue([])
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('星尘')
      await input.trigger('input')
      await input.setValue('')
      await input.trigger('input')
      vi.advanceTimersByTime(500)
      expect(fetchSuggestions).not.toHaveBeenCalled()
    })

    it('按 ESC 键隐藏联想建议', async () => {
      vi.mocked(fetchSuggestions).mockResolvedValue(['星尘机器人', '星尘焊接'])
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      await input.setValue('星尘')
      await input.trigger('input')
      vi.advanceTimersByTime(500)
      await vi.runAllTimersAsync()
      await input.trigger('focus')
      await input.trigger('keydown.esc')
      const suggestionsPanel = wrapper.find('.absolute.top-full')
      expect(suggestionsPanel.exists()).toBe(false)
    })
  })
})
