export interface IGDBGame {
  id: number
  cover: Cover
  first_release_date: number
  involved_companies: InvolvedCompany[]
  name: string
  platforms: number[]
  summary: string
}

export interface Cover {
  id: number
  image_id: string
}

export interface InvolvedCompany {
  id: number
  company: Company
}

export interface Company {
  id: number
  name: string
}
