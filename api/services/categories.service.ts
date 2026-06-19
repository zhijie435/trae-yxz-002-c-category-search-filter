import type {
  Manufacturer,
  Accessory,
  Package,
  Solution,
  AiArticle,
  ScenarioCategory,
} from '../types'
import {
  manufacturers,
  accessories,
  packages,
  solutions,
  aiArticles,
  scenarioCategories,
} from '../data/categories'

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
}

export const categoriesService = new CategoriesService()
