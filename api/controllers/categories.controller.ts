import { type Request, type Response } from 'express'
import { categoriesService } from '../services/categories.service'
import type { ProductQueryParams, SortType } from '../types'

export function getManufacturers(req: Request, res: Response): void {
  const data = categoriesService.getManufacturers()
  res.status(200).json({
    success: true,
    data,
  })
}

export function getHotAccessories(req: Request, res: Response): void {
  const limit = Number(req.query.limit) || 8
  const data = categoriesService.getHotAccessories(limit)
  res.status(200).json({
    success: true,
    data,
  })
}

export function getPackages(req: Request, res: Response): void {
  const data = categoriesService.getPackages()
  res.status(200).json({
    success: true,
    data,
  })
}

export function getSolutions(req: Request, res: Response): void {
  const data = categoriesService.getSolutions()
  res.status(200).json({
    success: true,
    data,
  })
}

export function getAiArticles(req: Request, res: Response): void {
  const limit = Number(req.query.limit) || 6
  const data = categoriesService.getAiArticles(limit)
  res.status(200).json({
    success: true,
    data,
  })
}

export function getScenarioCategories(req: Request, res: Response): void {
  const data = categoriesService.getScenarioCategories()
  res.status(200).json({
    success: true,
    data,
  })
}

function parseCategoryQuery(req: Request): ProductQueryParams {
  const { category1Id, category2Id, category3Id, sort, minPrice, maxPrice, delivery } = req.query
  const validSorts = [
    'default', 'price-asc', 'price-desc', 'name',
    'sales', 'popularity', 'newest', 'rating',
  ] as const

  return {
    category1Id: typeof category1Id === 'string' ? category1Id : undefined,
    category2Id: typeof category2Id === 'string' ? category2Id : undefined,
    category3Id: typeof category3Id === 'string' ? category3Id : undefined,
    sort:
      typeof sort === 'string' && validSorts.includes(sort as SortType)
        ? (sort as SortType)
        : undefined,
    minPrice: minPrice !== undefined ? Number(minPrice) || undefined : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) || undefined : undefined,
    delivery: typeof delivery === 'string' ? delivery : undefined,
  }
}

export function getCategoryProducts(req: Request, res: Response): void {
  const filters = parseCategoryQuery(req)
  const data = categoriesService.getCategoryProducts(filters)
  res.status(200).json({
    success: true,
    data,
  })
}

export function getCategoryProductsById(req: Request, res: Response): void {
  const { sort, minPrice, maxPrice, delivery } = req.query
  const validSorts = [
    'default', 'price-asc', 'price-desc', 'name',
    'sales', 'popularity', 'newest', 'rating',
  ] as const
  const id = req.params.id
  const filters: ProductQueryParams = {
    sort:
      typeof sort === 'string' && validSorts.includes(sort as SortType)
        ? (sort as SortType)
        : undefined,
    minPrice: minPrice !== undefined ? Number(minPrice) || undefined : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) || undefined : undefined,
    delivery: typeof delivery === 'string' ? delivery : undefined,
  }

  if (id.match(/^sc\d+-\d+-\d+$/)) {
    filters.category3Id = id
  } else if (id.match(/^sc\d+-\d+$/)) {
    filters.category2Id = id
  } else {
    filters.category1Id = id
  }

  const data = categoriesService.getCategoryProducts(filters)
  res.status(200).json({
    success: true,
    data,
  })
}
