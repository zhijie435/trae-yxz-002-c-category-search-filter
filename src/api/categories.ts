import type {
  Manufacturer,
  Accessory,
  Package,
  Solution,
  AiArticle,
  ScenarioCategory,
  CategoryProductGroup,
  ProductQueryParams,
} from '@/types'

const BASE = '/api'

export async function fetchManufacturers(): Promise<Manufacturer[]> {
  const res = await fetch(`${BASE}/manufacturers`)
  if (!res.ok) throw new Error('Failed to fetch manufacturers')
  const json = await res.json()
  return json.data
}

export async function fetchHotAccessories(limit = 8): Promise<Accessory[]> {
  const query = new URLSearchParams()
  if (limit) query.set('limit', String(limit))
  const res = await fetch(`${BASE}/accessories/hot?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch hot accessories')
  const json = await res.json()
  return json.data
}

export async function fetchPackages(): Promise<Package[]> {
  const res = await fetch(`${BASE}/packages`)
  if (!res.ok) throw new Error('Failed to fetch packages')
  const json = await res.json()
  return json.data
}

export async function fetchSolutions(): Promise<Solution[]> {
  const res = await fetch(`${BASE}/solutions`)
  if (!res.ok) throw new Error('Failed to fetch solutions')
  const json = await res.json()
  return json.data
}

export async function fetchAiArticles(limit = 6): Promise<AiArticle[]> {
  const query = new URLSearchParams()
  if (limit) query.set('limit', String(limit))
  const res = await fetch(`${BASE}/ai-articles?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch AI articles')
  const json = await res.json()
  return json.data
}

export async function fetchScenarioCategories(): Promise<ScenarioCategory[]> {
  const res = await fetch(`${BASE}/scenario-categories`)
  if (!res.ok) throw new Error('Failed to fetch scenario categories')
  const json = await res.json()
  return json.data
}

export async function fetchCategoryProducts(
  params?: ProductQueryParams,
): Promise<CategoryProductGroup[]> {
  const queryParams = new URLSearchParams()
  if (params) {
    if (params.category1Id) queryParams.append('category1Id', params.category1Id)
    if (params.category2Id) queryParams.append('category2Id', params.category2Id)
    if (params.category3Id) queryParams.append('category3Id', params.category3Id)
    if (params.sort && params.sort !== 'default') queryParams.append('sort', params.sort)
    if (params.minPrice !== undefined) queryParams.append('minPrice', String(params.minPrice))
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', String(params.maxPrice))
    if (params.delivery) queryParams.append('delivery', params.delivery)
  }
  const queryString = queryParams.toString()
  const url = `${BASE}/scenario-categories/products${queryString ? `?${queryString}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch category products')
  const json = await res.json()
  return json.data
}
