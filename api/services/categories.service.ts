import type {
  Manufacturer,
  Accessory,
  Package,
  Solution,
  AiArticle,
  ScenarioCategory,
  CategoryProductGroup,
  SearchQuery,
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
    categoryId: string,
    filters?: Partial<SearchQuery>,
  ): CategoryProductGroup[] {
    const category = scenarioCategories.find((c) => c.id === categoryId)
    if (!category || !category.children) return []
    return category.children.map((sub) => {
      let products = robots.filter((r) => r.subCategoryId === sub.id)
      if (filters) {
        products = this.applyFilters(products, filters)
      }
      return {
        id: sub.id,
        name: sub.name,
        count: products.length,
        products,
      }
    })
  }

  private applyFilters(list: Robot[], filters: Partial<SearchQuery>): Robot[] {
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
