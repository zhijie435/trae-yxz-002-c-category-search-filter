import { robots } from '../data/robots'
import type { Robot, SearchField } from '../types'

export class RobotsRepository {
  findAll(): Robot[] {
    return robots
  }

  findById(id: string): Robot | undefined {
    return robots.find((r) => r.id === id)
  }

  getScenarios(): string[] {
    return [...new Set(robots.map((r) => r.scenario))]
  }

  getFieldValues(field: SearchField): string[] {
    return [...new Set(robots.map((r) => r[field]))]
  }
}
