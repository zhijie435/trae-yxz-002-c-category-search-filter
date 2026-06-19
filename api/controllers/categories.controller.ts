import { type Request, type Response } from 'express'
import { categoriesService } from '../services/categories.service'

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

export function getCategoryProducts(req: Request, res: Response): void {
  const data = categoriesService.getCategoryProducts(req.params.id)
  res.status(200).json({
    success: true,
    data,
  })
}
