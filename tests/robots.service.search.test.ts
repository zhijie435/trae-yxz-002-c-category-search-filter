import { describe, it, expect, beforeEach } from 'vitest'
import { RobotsService } from '../api/services/robots.service'
import type { SearchQuery } from '../api/types'

describe('RobotsService - 搜索功能', () => {
  let service: RobotsService

  beforeEach(() => {
    service = new RobotsService()
  })

  describe('基础搜索', () => {
    it('无参数时返回全部机器人', () => {
      const query: SearchQuery = {}
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      expect(result.list.length).toBe(result.total)
    })

    it('空字符串关键词不进行过滤', () => {
      const all = service.search({})
      const withEmpty = service.search({ keyword: '', field: 'name' })
      expect(withEmpty.total).toBe(all.total)
    })

    it('空白关键词不进行过滤', () => {
      const all = service.search({})
      const withSpaces = service.search({ keyword: '   ', field: 'name' })
      expect(withSpaces.total).toBe(all.total)
    })
  })

  describe('按名称搜索 (field=name)', () => {
    it('按名称完整匹配搜索', () => {
      const query: SearchQuery = { keyword: '星尘工业焊接机器人', field: 'name' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.name).toContain('星尘工业焊接机器人')
      })
    })

    it('按名称部分匹配搜索', () => {
      const query: SearchQuery = { keyword: '星尘', field: 'name' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.name).toContain('星尘')
      })
    })

    it('按名称搜索不区分大小写', () => {
      const query1: SearchQuery = { keyword: '康护', field: 'name' }
      const query2: SearchQuery = { keyword: '康护'.toLowerCase(), field: 'name' }
      const result1 = service.search(query1)
      const result2 = service.search(query2)
      expect(result1.total).toBe(result2.total)
    })

    it('按不存在的名称搜索返回空结果', () => {
      const query: SearchQuery = { keyword: '不存在的机器人名称XYZ123', field: 'name' }
      const result = service.search(query)
      expect(result.total).toBe(0)
      expect(result.list).toEqual([])
    })
  })

  describe('按场景搜索 (field=scenario)', () => {
    it('按场景完整匹配搜索', () => {
      const query: SearchQuery = { keyword: '工业制造', field: 'scenario' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.scenario).toBe('工业制造')
      })
    })

    it('按场景部分匹配搜索', () => {
      const query: SearchQuery = { keyword: '医疗', field: 'scenario' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.scenario).toContain('医疗')
      })
    })

    it('按不存在的场景搜索返回空结果', () => {
      const query: SearchQuery = { keyword: '太空探索', field: 'scenario' }
      const result = service.search(query)
      expect(result.total).toBe(0)
    })
  })

  describe('按型号搜索 (field=model)', () => {
    it('按型号完整匹配搜索', () => {
      const query: SearchQuery = { keyword: 'XC-W100', field: 'model' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.model).toContain('XC-W100')
      })
    })

    it('按型号前缀搜索', () => {
      const query: SearchQuery = { keyword: 'XC', field: 'model' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(1)
      result.list.forEach((r) => {
        expect(r.model).toContain('XC')
      })
    })

    it('按不存在的型号搜索返回空结果', () => {
      const query: SearchQuery = { keyword: 'NONEXIST-999', field: 'model' }
      const result = service.search(query)
      expect(result.total).toBe(0)
    })
  })

  describe('不指定搜索字段时 (全字段搜索)', () => {
    it('在名称、场景、型号中任意字段匹配', () => {
      const query: SearchQuery = { keyword: '机器人' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        const inName = r.name.includes('机器人')
        const inScenario = r.scenario.includes('机器人')
        const inModel = r.model.includes('机器人')
        expect(inName || inScenario || inModel).toBe(true)
      })
    })
  })

  describe('联想建议 (suggest)', () => {
    it('空关键词返回空数组', () => {
      expect(service.suggest('', 'name')).toEqual([])
      expect(service.suggest('   ', 'name')).toEqual([])
    })

    it('按名称联想返回最多10条建议', () => {
      const suggestions = service.suggest('星', 'name')
      expect(suggestions.length).toBeLessThanOrEqual(10)
      suggestions.forEach((s) => {
        expect(s.toLowerCase()).toContain('星')
      })
    })

    it('指定字段时只返回该字段的建议', () => {
      const suggestions = service.suggest('X', 'model')
      suggestions.forEach((s) => {
        expect(s.toLowerCase()).toContain('x')
      })
    })

    it('不指定字段时返回所有字段的建议', () => {
      const suggestions = service.suggest('工')
      expect(suggestions.length).toBeGreaterThanOrEqual(1)
    })

    it('联想建议结果去重', () => {
      const suggestions = service.suggest('器', 'name')
      const unique = new Set(suggestions)
      expect(suggestions.length).toBe(unique.size)
    })
  })

  describe('场景列表获取 (getScenarios)', () => {
    it('返回去重后的场景列表', () => {
      const scenarios = service.getScenarios()
      const unique = new Set(scenarios)
      expect(scenarios.length).toBe(unique.size)
      expect(scenarios.length).toBeGreaterThan(0)
    })

    it('场景列表不为空', () => {
      const scenarios = service.getScenarios()
      expect(scenarios).toContain('工业制造')
      expect(scenarios).toContain('服务行业')
      expect(scenarios).toContain('医疗健康')
    })
  })

  describe('按ID获取 (getById)', () => {
    it('存在的ID返回对应机器人', () => {
      const robot = service.getById('1')
      expect(robot).toBeDefined()
      expect(robot?.id).toBe('1')
    })

    it('不存在的ID返回undefined', () => {
      const robot = service.getById('non-existent-id')
      expect(robot).toBeUndefined()
    })
  })
})
