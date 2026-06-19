import { describe, it, expect, beforeEach } from 'vitest'
import { RobotsService } from '../api/services/robots.service'
import { categoriesService } from '../api/services/categories.service'
import type { SearchQuery, ProductQueryParams } from '../api/types'

describe('排序与筛选功能', () => {
  let service: RobotsService

  beforeEach(() => {
    service = new RobotsService()
  })

  describe('价格排序 (RobotsService)', () => {
    it('价格从低到高排序 (price-asc)', () => {
      const query: SearchQuery = { sort: 'price-asc' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].price).toBeLessThanOrEqual(result.list[i + 1].price)
      }
    })

    it('价格从高到低排序 (price-desc)', () => {
      const query: SearchQuery = { sort: 'price-desc' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].price).toBeGreaterThanOrEqual(result.list[i + 1].price)
      }
    })

    it('默认排序不改变原始顺序', () => {
      const unsorted = service.search({})
      const defaultSorted = service.search({ sort: 'default' })
      expect(defaultSorted.list.map((r) => r.id)).toEqual(unsorted.list.map((r) => r.id))
    })
  })

  describe('名称排序 (RobotsService)', () => {
    it('按名称升序排序 (name)', () => {
      const query: SearchQuery = { sort: 'name' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].name.localeCompare(result.list[i + 1].name)).toBeLessThanOrEqual(0)
      }
    })
  })

  describe('业务指标排序 (RobotsService)', () => {
    it('按销量从高到低排序 (sales)', () => {
      const query: SearchQuery = { sort: 'sales' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].sales).toBeGreaterThanOrEqual(result.list[i + 1].sales)
      }
    })

    it('按人气从高到低排序 (popularity)', () => {
      const query: SearchQuery = { sort: 'popularity' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].popularity).toBeGreaterThanOrEqual(result.list[i + 1].popularity)
      }
    })

    it('按最新创建时间排序 (newest)', () => {
      const query: SearchQuery = { sort: 'newest' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(
          result.list[i].createdAt.localeCompare(result.list[i + 1].createdAt),
        ).toBeGreaterThanOrEqual(0)
      }
    })

    it('按评分从高到低排序 (rating)', () => {
      const query: SearchQuery = { sort: 'rating' }
      const result = service.search(query)
      expect(result.list.length).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].rating).toBeGreaterThanOrEqual(result.list[i + 1].rating)
      }
    })
  })

  describe('价格区间筛选 (RobotsService)', () => {
    it('仅设置最低价格 minPrice', () => {
      const query: SearchQuery = { minPrice: 50000 }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.price).toBeGreaterThanOrEqual(50000)
      })
    })

    it('仅设置最高价格 maxPrice', () => {
      const query: SearchQuery = { maxPrice: 50000 }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.price).toBeLessThanOrEqual(50000)
      })
    })

    it('同时设置最低和最高价格 (区间筛选)', () => {
      const query: SearchQuery = { minPrice: 10000, maxPrice: 100000 }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.price).toBeGreaterThanOrEqual(10000)
        expect(r.price).toBeLessThanOrEqual(100000)
      })
    })

    it('价格区间 1万以下筛选', () => {
      const query: SearchQuery = { maxPrice: 10000 }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.price).toBeLessThanOrEqual(10000)
      })
    })

    it('价格区间 1万-5万筛选', () => {
      const query: SearchQuery = { minPrice: 10000, maxPrice: 50000 }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.price).toBeGreaterThanOrEqual(10000)
        expect(r.price).toBeLessThanOrEqual(50000)
      })
    })

    it('价格区间 20万以上筛选', () => {
      const query: SearchQuery = { minPrice: 200000 }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.price).toBeGreaterThanOrEqual(200000)
      })
    })

    it('空价格区间不影响结果', () => {
      const all = service.search({})
      const withEmptyRange = service.search({ minPrice: undefined, maxPrice: undefined })
      expect(withEmptyRange.total).toBe(all.total)
    })
  })

  describe('配送方式筛选 (RobotsService)', () => {
    it('按「送货上门」配送方式筛选', () => {
      const query: SearchQuery = { delivery: '送货上门' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.deliveryMethod).toContain('送货上门')
      })
    })

    it('按「上门安装」配送方式筛选', () => {
      const query: SearchQuery = { delivery: '上门安装' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.deliveryMethod).toContain('上门安装')
      })
    })

    it('按「全国联保」配送方式筛选', () => {
      const query: SearchQuery = { delivery: '全国联保' }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.deliveryMethod).toContain('全国联保')
      })
    })

    it('按「专业培训」配送方式筛选', () => {
      const query: SearchQuery = { delivery: '专业培训' }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.deliveryMethod).toContain('专业培训')
      })
    })

    it('不存在的配送方式返回空结果', () => {
      const query: SearchQuery = { delivery: '不存在的配送方式' }
      const result = service.search(query)
      expect(result.total).toBe(0)
    })
  })

  describe('场景筛选 (RobotsService)', () => {
    it('按「工业制造」场景筛选', () => {
      const query: SearchQuery = { scenario: '工业制造' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.scenario).toBe('工业制造')
      })
    })

    it('按「服务行业」场景筛选', () => {
      const query: SearchQuery = { scenario: '服务行业' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.scenario).toBe('服务行业')
      })
    })

    it('按「医疗健康」场景筛选', () => {
      const query: SearchQuery = { scenario: '医疗健康' }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(0)
      result.list.forEach((r) => {
        expect(r.scenario).toBe('医疗健康')
      })
    })
  })

  describe('分类筛选 (RobotsService)', () => {
    it('按一级分类 category1Id 筛选', () => {
      const query: SearchQuery = { category1Id: 'sc1' }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.category1Id).toBe('sc1')
      })
    })

    it('按二级分类 category2Id 筛选', () => {
      const query: SearchQuery = { category2Id: 'sc1-1' }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.category2Id).toBe('sc1-1')
      })
    })

    it('按三级分类 category3Id 筛选', () => {
      const query: SearchQuery = { category3Id: 'sc1-1-1' }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.category3Id).toBe('sc1-1-1')
      })
    })
  })

  describe('多条件组合筛选', () => {
    it('场景 + 价格区间组合筛选', () => {
      const query: SearchQuery = {
        scenario: '工业制造',
        minPrice: 50000,
        maxPrice: 200000,
      }
      const result = service.search(query)
      result.list.forEach((r) => {
        expect(r.scenario).toBe('工业制造')
        expect(r.price).toBeGreaterThanOrEqual(50000)
        expect(r.price).toBeLessThanOrEqual(200000)
      })
    })

    it('搜索关键词 + 价格排序组合', () => {
      const query: SearchQuery = {
        keyword: '机器人',
        field: 'name',
        sort: 'price-desc',
      }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].price).toBeGreaterThanOrEqual(result.list[i + 1].price)
      }
      result.list.forEach((r) => {
        expect(r.name).toContain('机器人')
      })
    })

    it('配送方式 + 销量排序组合', () => {
      const query: SearchQuery = {
        delivery: '送货上门',
        sort: 'sales',
      }
      const result = service.search(query)
      expect(result.total).toBeGreaterThan(1)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].sales).toBeGreaterThanOrEqual(result.list[i + 1].sales)
      }
      result.list.forEach((r) => {
        expect(r.deliveryMethod).toContain('送货上门')
      })
    })

    it('分类 + 场景 + 价格筛选 + 评分排序组合', () => {
      const query: SearchQuery = {
        category1Id: 'sc3',
        scenario: '医疗健康',
        minPrice: 10000,
        sort: 'rating',
      }
      const result = service.search(query)
      expect(result.total).toBeGreaterThanOrEqual(0)
      for (let i = 0; i < result.list.length - 1; i++) {
        expect(result.list[i].rating).toBeGreaterThanOrEqual(result.list[i + 1].rating)
      }
      result.list.forEach((r) => {
        expect(r.category1Id).toBe('sc3')
        expect(r.scenario).toBe('医疗健康')
        expect(r.price).toBeGreaterThanOrEqual(10000)
      })
    })
  })

  describe('CategoriesService 排序与筛选', () => {
    it('按价格升序排序分类商品', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc1',
        sort: 'price-asc',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      for (let i = 0; i < allProducts.length - 1; i++) {
        if (allProducts[i].category2Id === allProducts[i + 1].category2Id) {
          expect(allProducts[i].price).toBeLessThanOrEqual(allProducts[i + 1].price)
        }
      }
    })

    it('按销量降序排序分类商品', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc1',
        sort: 'sales',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      for (let i = 0; i < allProducts.length - 1; i++) {
        if (allProducts[i].category2Id === allProducts[i + 1].category2Id) {
          expect(allProducts[i].sales).toBeGreaterThanOrEqual(allProducts[i + 1].sales)
        }
      }
    })

    it('分类商品按价格区间筛选', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc1',
        minPrice: 10000,
        maxPrice: 150000,
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      allProducts.forEach((p) => {
        expect(p.price).toBeGreaterThanOrEqual(10000)
        expect(p.price).toBeLessThanOrEqual(150000)
      })
    })

    it('分类商品按配送方式筛选', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc1',
        delivery: '上门安装',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      allProducts.forEach((p) => {
        expect(p.deliveryMethod).toContain('上门安装')
      })
    })

    it('分类商品按人气排序', () => {
      const params: ProductQueryParams = {
        category2Id: 'sc2-1',
        sort: 'popularity',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      allProducts.forEach((p, i) => {
        if (i > 0 && allProducts[i - 1].category3Id === p.category3Id) {
          expect(allProducts[i - 1].popularity).toBeGreaterThanOrEqual(p.popularity)
        }
      })
    })

    it('分类商品按最新创建时间排序', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc2',
        sort: 'newest',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      for (let i = 0; i < allProducts.length - 1; i++) {
        if (allProducts[i].category2Id === allProducts[i + 1].category2Id) {
          expect(
            allProducts[i].createdAt.localeCompare(allProducts[i + 1].createdAt),
          ).toBeGreaterThanOrEqual(0)
        }
      }
    })

    it('分类商品按评分排序', () => {
      const params: ProductQueryParams = {
        category1Id: 'sc3',
        sort: 'rating',
      }
      const groups = categoriesService.getCategoryProducts(params)
      const allProducts = groups.flatMap((g) => g.products)
      for (let i = 0; i < allProducts.length - 1; i++) {
        if (allProducts[i].category2Id === allProducts[i + 1].category2Id) {
          expect(allProducts[i].rating).toBeGreaterThanOrEqual(allProducts[i + 1].rating)
        }
      }
    })
  })
})
