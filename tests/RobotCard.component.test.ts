import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotCard from '../src/components/RobotCard.vue'
import type { Robot } from '../src/types'

const mockRobot: Robot = {
  id: 'test-1',
  name: '星尘工业焊接机器人',
  model: 'XC-W100',
  scenario: '工业制造',
  brand: '星尘科技',
  price: 128000,
  description: '高精度六轴焊接机器人',
  image: 'https://example.com/robot.jpg',
  specs: [
    { label: '负载能力', value: '6kg' },
    { label: '重复精度', value: '±0.03mm' },
    { label: '工作半径', value: '1440mm' },
  ],
  category1Id: 'sc1',
  category2Id: 'sc1-1',
  category3Id: 'sc1-1-1',
  sales: 2680,
  rating: 4.8,
  popularity: 9500,
  createdAt: '2023-06-15',
  deliveryMethod: ['送货上门', '上门安装', '全国联保'],
  dailyPrice: 398,
  rentedCount: 156,
}

describe('RobotCard.vue - 商品卡片字段', () => {
  describe('图片展示', () => {
    it('正确渲染商品图片 src', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(mockRobot.image)
    })

    it('图片 alt 使用机器人名称', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe(mockRobot.name)
    })
  })

  describe('场景标签', () => {
    it('显示场景标签文本', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain('工业制造')
    })
  })

  describe('销量与出租次数', () => {
    it('正确显示已售数量', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain(`已售 ${mockRobot.sales} 台`)
    })

    it('正确显示已租次数', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain(`已租 ${mockRobot.rentedCount} 次`)
    })
  })

  describe('名称展示', () => {
    it('短名称完整显示', () => {
      const shortNameRobot: Robot = {
        ...mockRobot,
        name: '短名称',
      }
      const wrapper = mount(RobotCard, {
        props: { robot: shortNameRobot },
      })
      const title = wrapper.find('h3')
      expect(title.text()).toBe('短名称')
    })

    it('超过10个字符的名称截断并添加省略号', () => {
      const longNameRobot: Robot = {
        ...mockRobot,
        name: '星尘工业焊接机器人超长版本测试名称',
      }
      const wrapper = mount(RobotCard, {
        props: { robot: longNameRobot },
      })
      const title = wrapper.find('h3')
      expect(title.text()).toContain('…')
      expect(title.text().length).toBeLessThanOrEqual(11)
    })

    it('名称 title 属性显示完整名称', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const title = wrapper.find('h3')
      expect(title.attributes('title')).toBe(mockRobot.name)
    })
  })

  describe('型号与品牌', () => {
    it('正确显示型号和品牌', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain(`型号：${mockRobot.model}`)
      expect(wrapper.text()).toContain(`品牌：${mockRobot.brand}`)
    })
  })

  describe('价格展示', () => {
    it('正确显示日租价格', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain(String(mockRobot.dailyPrice))
      expect(wrapper.text()).toContain('/天')
    })

    it('显示人民币符号 ¥', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const priceSection = wrapper.findAll('span').find((s) => s.text().includes('¥'))
      expect(priceSection).toBeDefined()
    })

    it('售价数字添加千分位格式化', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain('¥128,000')
    })

    it('售价显示「售价 ¥」前缀', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain('售价')
    })
  })

  describe('评分展示', () => {
    it('显示评分数值', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.text()).toContain(String(mockRobot.rating))
    })

    it('渲染星形评分图标', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })
  })

  describe('规格参数标签', () => {
    it('渲染所有规格参数标签', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const specTags = wrapper.findAll('span.bg-gray-50')
      expect(specTags.length).toBe(mockRobot.specs.length)
    })

    it('规格参数格式为「标签：值」', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const specTags = wrapper.findAll('span.bg-gray-50')
      mockRobot.specs.forEach((spec, idx) => {
        expect(specTags[idx].text()).toBe(`${spec.label}：${spec.value}`)
      })
    })

    it('空规格参数不渲染任何标签', () => {
      const robotNoSpecs: Robot = {
        ...mockRobot,
        specs: [],
      }
      const wrapper = mount(RobotCard, {
        props: { robot: robotNoSpecs },
      })
      const specTags = wrapper.findAll('span.bg-gray-50')
      expect(specTags.length).toBe(0)
    })
  })

  describe('卡片结构完整性', () => {
    it('卡片最外层使用 div 包装', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    })

    it('包含图片区域和内容区域', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const imageArea = wrapper.find('.aspect-\\[4\\/3\\]')
      const contentArea = wrapper.find('.p-4')
      expect(imageArea.exists()).toBe(true)
      expect(contentArea.exists()).toBe(true)
    })

    it('内容与价格区域之间有分隔线', () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const separator = wrapper.find('.border-b.border-gray-100')
      expect(separator.exists()).toBe(true)
    })
  })

  describe('响应式数据变化', () => {
    it('更新 robot prop 后显示新数据', async () => {
      const wrapper = mount(RobotCard, {
        props: { robot: mockRobot },
      })
      const newRobot: Robot = {
        ...mockRobot,
        id: 'test-2',
        name: '智行酒店服务机器人',
        model: 'ZX-H200',
        scenario: '服务行业',
        brand: '智行机器人',
        price: 39800,
        dailyPrice: 128,
        sales: 5820,
        rating: 4.6,
        rentedCount: 892,
      }
      await wrapper.setProps({ robot: newRobot })
      expect(wrapper.text()).toContain('智行酒店服务机器人')
      expect(wrapper.text()).toContain('ZX-H200')
      expect(wrapper.text()).toContain('服务行业')
      expect(wrapper.text()).toContain('智行机器人')
      expect(wrapper.text()).toContain('¥39,800')
      expect(wrapper.text()).toContain('128')
      expect(wrapper.text()).toContain('5820')
      expect(wrapper.text()).toContain('4.6')
      expect(wrapper.text()).toContain('892')
    })
  })

  describe('不同数据边界情况', () => {
    it('销量为 0 时正确显示', () => {
      const zeroSalesRobot: Robot = {
        ...mockRobot,
        sales: 0,
      }
      const wrapper = mount(RobotCard, {
        props: { robot: zeroSalesRobot },
      })
      expect(wrapper.text()).toContain('已售 0 台')
    })

    it('出租次数为 0 时正确显示', () => {
      const zeroRentedRobot: Robot = {
        ...mockRobot,
        rentedCount: 0,
      }
      const wrapper = mount(RobotCard, {
        props: { robot: zeroRentedRobot },
      })
      expect(wrapper.text()).toContain('已租 0 次')
    })

    it('评分为 0 时正确显示', () => {
      const zeroRatingRobot: Robot = {
        ...mockRobot,
        rating: 0,
      }
      const wrapper = mount(RobotCard, {
        props: { robot: zeroRatingRobot },
      })
      expect(wrapper.text()).toContain('0')
    })

    it('价格为 0 时正确显示', () => {
      const zeroPriceRobot: Robot = {
        ...mockRobot,
        price: 0,
      }
      const wrapper = mount(RobotCard, {
        props: { robot: zeroPriceRobot },
      })
      expect(wrapper.text()).toContain('¥0')
    })

    it('日租价为 0 时正确显示', () => {
      const zeroDailyRobot: Robot = {
        ...mockRobot,
        dailyPrice: 0,
      }
      const wrapper = mount(RobotCard, {
        props: { robot: zeroDailyRobot },
      })
      expect(wrapper.text()).toContain('0')
    })

    it('名称恰好 10 个字符不截断', () => {
      const tenCharRobot: Robot = {
        ...mockRobot,
        name: '一二三四五六七八九十',
      }
      const wrapper = mount(RobotCard, {
        props: { robot: tenCharRobot },
      })
      const title = wrapper.find('h3')
      expect(title.text()).toBe('一二三四五六七八九十')
      expect(title.text()).not.toContain('…')
    })

    it('名称 11 个字符时截断', () => {
      const elevenCharRobot: Robot = {
        ...mockRobot,
        name: '一二三四五六七八九十①',
      }
      const wrapper = mount(RobotCard, {
        props: { robot: elevenCharRobot },
      })
      const title = wrapper.find('h3')
      expect(title.text()).toContain('…')
    })
  })
})
