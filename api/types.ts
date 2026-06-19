export interface Robot {
  id: string
  name: string
  model: string
  scenario: string
  brand: string
  price: number
  description: string
  image: string
  specs: { label: string; value: string }[]
}

export interface SearchQuery {
  keyword?: string
  field?: 'name' | 'scenario' | 'model'
  scenario?: string
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name'
}

export interface SearchResult {
  total: number
  list: Robot[]
}

export type SearchField = 'name' | 'scenario' | 'model'

export interface Manufacturer {
  id: string
  name: string
  logo: string
  description: string
  robotCount: number
  tagline: string
  establishedYear: number
  country: string
  categories: string[]
}

export interface Accessory {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
  sales: number
  rating: number
  tags: string[]
}

export interface Package {
  id: string
  name: string
  description: string
  originalPrice: number
  discountPrice: number
  image: string
  items: { name: string; quantity: number }[]
  validPeriod: string
  saveAmount: number
  tag: string
}

export interface Solution {
  id: string
  title: string
  category: string
  cover: string
  description: string
  features: string[]
  applicableScenarios: string[]
  customerCases: {
    name: string
    industry: string
  }[]
  tag: string
}

export interface AiArticle {
  id: string
  title: string
  summary: string
  cover: string
  category: string
  author: string
  publishDate: string
  readTime: number
  views: number
  tag: string
}

export interface ScenarioCategory {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
}
