import type {
  Manufacturer,
  Accessory,
  Package,
  Solution,
  AiArticle,
  ScenarioCategory,
  CategoryProductGroup,
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

  getCategoryProducts(categoryId: string): CategoryProductGroup[] {
    const category = scenarioCategories.find((c) => c.id === categoryId)
    if (!category || !category.children) return []
    return category.children.map((sub) => ({
      id: sub.id,
      name: sub.name,
      count: sub.count,
      products: robots.filter((r) => r.subCategoryId === sub.id),
    }))
  }
}

export const categoriesService = new CategoriesService()
