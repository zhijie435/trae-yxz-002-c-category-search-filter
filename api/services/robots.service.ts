import { RobotsRepository } from '../repositories/robots.repository'
import type { Robot, SearchQuery, SearchResult, SearchField } from '../types'

export class RobotsService {
  private repository = new RobotsRepository()

  search(query: SearchQuery): SearchResult {
    let list = this.repository.findAll()

    if (query.keyword && query.keyword.trim()) {
      const keyword = query.keyword.trim().toLowerCase()
      const searchField = query.field
      if (searchField) {
        list = list.filter((r) => {
          const value = r[searchField]
          return value.toLowerCase().includes(keyword)
        })
      } else {
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(keyword) ||
            r.scenario.toLowerCase().includes(keyword) ||
            r.model.toLowerCase().includes(keyword),
        )
      }
    }

    if (query.scenario) {
      list = list.filter((r) => r.scenario === query.scenario)
    }

    switch (query.sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return {
      total: list.length,
      list,
    }
  }

  getById(id: string): Robot | undefined {
    return this.repository.findById(id)
  }

  getScenarios(): string[] {
    return this.repository.getScenarios()
  }

  suggest(keyword: string, field?: SearchField): string[] {
    if (!keyword || !keyword.trim()) return []
    const kw = keyword.trim().toLowerCase()
    const all = this.repository.findAll()
    const fields: SearchField[] = field ? [field] : ['name', 'scenario', 'model']
    const result = new Set<string>()
    for (const robot of all) {
      for (const f of fields) {
        const value = robot[f]
        if (value.toLowerCase().includes(kw)) {
          result.add(value)
        }
      }
    }
    return [...result].slice(0, 10)
  }
}
