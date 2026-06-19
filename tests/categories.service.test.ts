import { describe, it, expect, beforeEach } from 'vitest'
import { categoriesService } from '../api/services/categories.service'
import type { ProductQueryParams } from '../api/types'

describe('CategoriesService - 分类切换功能', () => {
  describe('场景分类列表 (getScenarioCategories)', () => {
    it('返回完整的场景分类列表', () => {
      const categories = categoriesService.getScenarioCategories()
      expect(categories.length).toBeGreaterThan(0)
    })

    it('分类列表包含预期的一级分类', () => {
      const categories = categoriesService.getScenarioCategories()
      const names = categories.map((c) => c.name)
      expect(names).toContain('工业制造')
      expect(names).toContain('服务行业')
      expect(names).toContain('医疗健康')
      expect(names).toContain('教育培训')
    })

    it('每个一级分类包含必要字段', () => {
      const categories = categoriesService.getScenarioCategories()
      categories.forEach((cat) => {
        expect(cat).toHaveProperty('id')
        expect(cat).toHaveProperty('name')
        expect(cat).toHaveProperty('icon')
        expect(cat).toHaveProperty('description')
        expect(cat).toHaveProperty('count')
        expect(cat).toHaveProperty('color')
        expect(typeof cat.id).toBe('string')
        expect(typeof cat.name).toBe('string')
        expect(typeof cat.count).toBe('number')
      })
    })

    it('工业制造分类包含5个二级分类', () => {
      const categories = categoriesService.getScenarioCategories()
      const industryCat = categories.find((c) => c.id === 'sc1')
      expect(industryCat).toBeDefined()
      expect(industryCat?.children?.length).toBe(5)
    })

    it('医疗健康分类包含医疗陪护、康复训练、消毒、药品配送子分类', () => {
      const categories = categoriesService.getScenarioCategories()
      const medicalCat = categories.find((c) => c.id === 'sc3')
      expect(medicalCat).toBeDefined()
      const subNames = medicalCat?.children?.map((s) => s.name) || []
      expect(subNames).toContain('医疗陪护机器人')
      expect(subNames).toContain('康复训练机器人')
      expect(subNames).toContain('消毒机器人')
      expect(subNames).toContain('药品配送机器人')
    })
  })

  describe('分类商品查询 (getCategoryProducts)', () => {
    describe('按一级分类查询', () => {
      it('按一级分类工业制造查询，返回其下所有二级分类分组', () => {
        const params: ProductQueryParams = { category1Id: 'sc1' }
        const groups = categoriesService.getCategoryProducts(params)
        expect(groups.length).toBe(5)
        const groupNames = groups.map((g) => g.name)
        expect(groupNames).toContain('焊接机器人')
        expect(groupNames).toContain('装配机器人')
        expect(groupNames).toContain('搬运码垛机器人')
        expect(groupNames).toContain('喷涂机器人')
        expect(groupNames).toContain('打磨抛光机器人')
      })

      it('按一级分类查询，每组内的商品都属于该二级分类', () => {
        const params: ProductQueryParams = { category1Id: 'sc2' }
        const groups = categoriesService.getCategoryProducts(params)
        groups.forEach((group) => {
          group.products.forEach((product) => {
            expect(product.category1Id).toBe('sc2')
          })
        })
      })

      it('每个分组包含 id、name、count、products 字段', () => {
        const params: ProductQueryParams = { category1Id: 'sc1' }
        const groups = categoriesService.getCategoryProducts(params)
        groups.forEach((group) => {
          expect(group).toHaveProperty('id')
          expect(group).toHaveProperty('name')
          expect(group).toHaveProperty('count')
          expect(group).toHaveProperty('products')
          expect(group.count).toBe(group.products.length)
        })
      })

      it('不存在的一级分类返回空数组', () => {
        const params: ProductQueryParams = { category1Id: 'non-existent' }
        const groups = categoriesService.getCategoryProducts(params)
        expect(groups).toEqual([])
      })
    })

    describe('按二级分类查询', () => {
      it('按二级分类焊接机器人查询，返回其下三级分类分组', () => {
        const params: ProductQueryParams = { category1Id: 'sc1', category2Id: 'sc1-1' }
        const groups = categoriesService.getCategoryProducts(params)
        const groupNames = groups.map((g) => g.name)
        expect(groupNames).toContain('电弧焊接机器人')
        expect(groupNames).toContain('激光焊接机器人')
        expect(groupNames).toContain('点焊机器人')
      })

      it('按二级分类查询，商品都属于该二级分类', () => {
        const params: ProductQueryParams = { category1Id: 'sc1', category2Id: 'sc1-1' }
        const groups = categoriesService.getCategoryProducts(params)
        const allProducts = groups.flatMap((g) => g.products)
        allProducts.forEach((p) => {
          expect(p.category2Id).toBe('sc1-1')
        })
      })

      it('不存在的二级分类返回空数组', () => {
        const params: ProductQueryParams = { category1Id: 'sc1', category2Id: 'non-existent' }
        const groups = categoriesService.getCategoryProducts(params)
        expect(groups).toEqual([])
      })
    })

    describe('按三级分类查询', () => {
      it('按三级分类查询返回单一分组', () => {
        const params: ProductQueryParams = {
          category1Id: 'sc1',
          category2Id: 'sc1-1',
          category3Id: 'sc1-1-1',
        }
        const groups = categoriesService.getCategoryProducts(params)
        expect(groups.length).toBe(1)
        expect(groups[0].name).toBe('电弧焊接机器人')
      })

      it('按三级分类查询，所有商品属于该三级分类', () => {
        const params: ProductQueryParams = {
          category1Id: 'sc1',
          category2Id: 'sc1-1',
          category3Id: 'sc1-1-1',
        }
        const groups = categoriesService.getCategoryProducts(params)
        groups[0].products.forEach((p) => {
          expect(p.category3Id).toBe('sc1-1-1')
        })
      })

      it('不存在的三级分类返回空数组', () => {
        const params: ProductQueryParams = {
          category1Id: 'sc1',
          category2Id: 'sc1-1',
          category3Id: 'non-existent',
        }
        const groups = categoriesService.getCategoryProducts(params)
        expect(groups).toEqual([])
      })
    })

    describe('无分类参数查询', () => {
      it('不传分类参数时返回所有二级分类分组', () => {
        const groups = categoriesService.getCategoryProducts({})
        expect(groups.length).toBeGreaterThan(0)
      })

      it('无参数查询返回的分组总数等于所有一级分类下二级分类之和', () => {
        const categories = categoriesService.getScenarioCategories()
        const expectedCount = categories.reduce((sum, cat) => sum + (cat.children?.length || 0), 0)
        const groups = categoriesService.getCategoryProducts({})
        expect(groups.length).toBe(expectedCount)
      })
    })
  })

  describe('分类切换与筛选组合', () => {
    it('切换一级分类后查询结果正确', () => {
      const industryGroups = categoriesService.getCategoryProducts({ category1Id: 'sc1' })
      const medicalGroups = categoriesService.getCategoryProducts({ category1Id: 'sc3' })
      const industryNames = industryGroups.map((g) => g.name)
      const medicalNames = medicalGroups.map((g) => g.name)
      expect(industryNames).toContain('焊接机器人')
      expect(medicalNames).toContain('医疗陪护机器人')
      expect(industryNames).not.toContain('医疗陪护机器人')
      expect(medicalNames).not.toContain('焊接机器人')
    })

    it('切换二级分类后三级分组正确', () => {
      const weldingGroups = categoriesService.getCategoryProducts({
        category1Id: 'sc1',
        category2Id: 'sc1-1',
      })
      const assemblyGroups = categoriesService.getCategoryProducts({
        category1Id: 'sc1',
        category2Id: 'sc1-2',
      })
      expect(weldingGroups.map((g) => g.name)).toContain('电弧焊接机器人')
      expect(assemblyGroups.map((g) => g.name)).toContain('汽车装配机器人')
    })

    it('先选一级再选二级再选三级，查询结果逐级正确', () => {
      const groups = categoriesService.getCategoryProducts({
        category1Id: 'sc3',
        category2Id: 'sc3-2',
        category3Id: 'sc3-2-1',
      })
      expect(groups.length).toBe(1)
      expect(groups[0].name).toBe('下肢康复机器人')
      groups[0].products.forEach((p) => {
        expect(p.category1Id).toBe('sc3')
        expect(p.category2Id).toBe('sc3-2')
        expect(p.category3Id).toBe('sc3-2-1')
      })
    })
  })

  describe('其他分类数据获取', () => {
    it('getManufacturers 返回厂商列表', () => {
      const manufacturers = categoriesService.getManufacturers()
      expect(manufacturers.length).toBeGreaterThan(0)
      manufacturers.forEach((m) => {
        expect(m).toHaveProperty('id')
        expect(m).toHaveProperty('name')
        expect(m).toHaveProperty('robotCount')
      })
    })

    it('getPackages 返回套餐列表', () => {
      const packages = categoriesService.getPackages()
      expect(packages.length).toBeGreaterThan(0)
    })

    it('getSolutions 返回解决方案列表', () => {
      const solutions = categoriesService.getSolutions()
      expect(solutions.length).toBeGreaterThan(0)
    })

    it('getAiArticles 返回AI文章列表', () => {
      const articles = categoriesService.getAiArticles()
      expect(articles.length).toBeGreaterThan(0)
    })

    it('getAiArticles 支持 limit 参数', () => {
      const articles = categoriesService.getAiArticles(2)
      expect(articles.length).toBeLessThanOrEqual(2)
    })

    it('getHotAccessories 返回热门配件', () => {
      const accessories = categoriesService.getHotAccessories(3)
      expect(accessories.length).toBeLessThanOrEqual(3)
    })
  })
})
