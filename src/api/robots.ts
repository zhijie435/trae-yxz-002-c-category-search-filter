import type { Robot, SearchQuery, SearchResult, SearchField } from '@/types'

const BASE = '/api'

export async function fetchRobots(params: SearchQuery): Promise<SearchResult> {
  const query = new URLSearchParams()
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.field) query.set('field', params.field)
  if (params.scenario) query.set('scenario', params.scenario)
  if (params.sort) query.set('sort', params.sort)

  const res = await fetch(`${BASE}/robots?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch robots')
  return res.json()
}

export async function fetchRobotById(id: string): Promise<Robot> {
  const res = await fetch(`${BASE}/robots/${id}`)
  if (!res.ok) throw new Error('Failed to fetch robot')
  return res.json()
}

export async function fetchScenarios(): Promise<string[]> {
  const res = await fetch(`${BASE}/scenarios`)
  if (!res.ok) throw new Error('Failed to fetch scenarios')
  return res.json()
}

export async function fetchSuggestions(keyword: string, field?: SearchField): Promise<string[]> {
  const query = new URLSearchParams()
  query.set('keyword', keyword)
  if (field) query.set('field', field)

  const res = await fetch(`${BASE}/suggest?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch suggestions')
  return res.json()
}
