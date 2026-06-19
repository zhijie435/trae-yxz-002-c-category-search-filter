import { type Request, type Response } from 'express'
import { RobotsService } from '../services/robots.service'
import type { SearchField, SearchQuery } from '../types'

const service = new RobotsService()

function parseQuery(req: Request): SearchQuery {
  const { keyword, field, scenario, sort } = req.query
  const validFields: SearchField[] = ['name', 'scenario', 'model']
  const validSorts = ['default', 'price-asc', 'price-desc', 'name'] as const

  return {
    keyword: typeof keyword === 'string' ? keyword : undefined,
    field:
      typeof field === 'string' && validFields.includes(field as SearchField)
        ? (field as SearchField)
        : undefined,
    scenario: typeof scenario === 'string' ? scenario : undefined,
    sort:
      typeof sort === 'string' &&
      validSorts.includes(sort as (typeof validSorts)[number])
        ? (sort as SearchQuery['sort'])
        : 'default',
  }
}

export function searchRobots(req: Request, res: Response): void {
  const query = parseQuery(req)
  const result = service.search(query)
  res.json(result)
}

export function getRobotById(req: Request, res: Response): void {
  const robot = service.getById(req.params.id)
  if (!robot) {
    res.status(404).json({ error: 'Robot not found' })
    return
  }
  res.json(robot)
}

export function getScenarios(_req: Request, res: Response): void {
  const scenarios = service.getScenarios()
  res.json(scenarios)
}

export function getSuggestions(req: Request, res: Response): void {
  const { keyword, field } = req.query
  const validFields: SearchField[] = ['name', 'scenario', 'model']
  const suggestions = service.suggest(
    typeof keyword === 'string' ? keyword : '',
    typeof field === 'string' && validFields.includes(field as SearchField)
      ? (field as SearchField)
      : undefined,
  )
  res.json(suggestions)
}
