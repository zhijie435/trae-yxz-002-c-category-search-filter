import type {
  Manufacturer,
  Accessory,
  Package,
  Solution,
  AiArticle,
  ScenarioCategory,
  CategoryProductGroup,
  ProductQueryParams,
  Robot,
} from '../types'
import {
  manufacturers,
  accessories,
  packages,
  solutions,
  aiArticles,
  scenarioCategories,
} from '../data/categories'
import { robots } from '../data/robots'

class CategoriesService {
  getManufacturers(): Manufacturer[] {
    return manufacturers
  }

  getHotAccessories(limit = 8): Accessory[] {
    return [...accessories]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
  }

  getPackages(): Package[] {
    return packages
  }

  getSolutions(): Solution[] {
    return solutions
  }

  getAiArticles(limit = 6): AiArticle[] {
    return aiArticles.slice(0, limit)
  }

  getScenarioCategories(): ScenarioCategory[] {
    return scenarioCategories
  }

  getCategoryProducts(
    params: ProductQueryParams = {},
  ): CategoryProductGroup[] {
    const category1Id = params.category1Id
    const category2Id = params.category2Id
    const category3Id = params.category3Id

    if (category3Id) {
      const thirdCategory = this.findThirdCategory(category3Id)
      if (!thirdCategory) return []
      let products = robots.filter((r) => r.category3Id === category3Id)
      products = this.applyFilters(products, params)
      return [
        {
          id: thirdCategory.id,
          name: thirdCategory.name,
          count: products.length,
          products,
        },
      ]
    }

    if (category2Id) {
      const subCategory = this.findSubCategory(category2Id)
      if (!subCategory) return []
      let products = robots.filter((r) => r.category2Id === category2Id)
      products = this.applyFilters(products, params)
      if (subCategory.children && subCategory.children.length > 0) {
        return subCategory.children.map((third) => {
          const thirdProducts = products.filter((r) => r.category3Id === third.id)
          return {
            id: third.id,
            name: third.name,
            count: thirdProducts.length,
            products: thirdProducts,
          }
        })
      }
      return [
        {
          id: subCategory.id,
          name: subCategory.name,
          count: products.length,
          products,
        },
      ]
    }

    if (category1Id) {
      const category = scenarioCategories.find((c) => c.id === category1Id)
      if (!category || !category.children) return []
      return category.children.map((sub) => {
        let products = robots.filter((r) => r.category2Id === sub.id)
        products = this.applyFilters(products, params)
        return {
          id: sub.id,
          name: sub.name,
          count: products.length,
          products,
        }
      })
    }

    const allSubCategories: { id: string; name: string; category1Id: string }[] = []
    for (const cat of scenarioCategories) {
      if (cat.children) {
        for (const sub of cat.children) {
          allSubCategories.push({ id: sub.id, name: sub.name, category1Id: cat.id })
        }
      }
    }
    return allSubCategories.map((sub) => {
      let products = robots.filter((r) => r.category2Id === sub.id)
      products = this.applyFilters(products, params)
      return {
        id: sub.id,
        name: sub.name,
        count: products.length,
        products,
      }
    })
  }

  private findSubCategory(subId: string) {
    for (const cat of scenarioCategories) {
      if (cat.children) {
        const sub = cat.children.find((s) => s.id === subId)
        if (sub) return sub
      }
    }
    return null
  }

  private findThirdCategory(thirdId: string) {
    for (const cat of scenarioCategories) {
      if (cat.children) {
        for (const sub of cat.children) {
          if (sub.children) {
            const third = sub.children.find((t) => t.id === thirdId)
            if (third) return third
          }
        }
      }
    }
    return null
  }

  private applyFilters(list: Robot[], filters: ProductQueryParams): Robot[] {
    let result = list
    if (filters.minPrice !== undefined) {
      result = result.filter((r) => r.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((r) => r.price <= filters.maxPrice!)
    }
    if (filters.delivery) {
      result = result.filter((r) => r.deliveryMethod.includes(filters.delivery!))
    }
    switch (filters.sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'sales':
        result = [...result].sort((a, b) => b.sales - a.sales)
        break
      case 'popularity':
        result = [...result].sort((a, b) => b.popularity - a.popularity)
        break
      case 'newest':
        result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
    }
    return result
  }
}

export const categoriesService = new CategoriesService()
