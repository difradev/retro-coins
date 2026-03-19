import { PlatformCode, RegionCode } from '@/app/generated/prisma/enums'

export function getPlatformCode(
  searchKey: string,
  platforms: Set<string>,
): PlatformCode {
  return searchKey
    .split('-')
    .filter((s) => platforms.has(s))
    .join('')
    .toUpperCase() as PlatformCode
}

export function getSlugFromSearchQuery(
  searchKey: string,
  platforms: Set<string>,
): string {
  return searchKey
    .split('-')
    .filter((s) => !platforms.has(s))
    .join('-')
}

export function getRegionCode(
  searchKey: string,
  regions: Set<string>,
): RegionCode {
  return searchKey
    .split('-')
    .filter((s) => regions.has(s))
    .join('')
    .toUpperCase() as RegionCode
}

export function normalizeGameTitle(
  searchKey: string,
  excludeWords?: any,
): string {
  return searchKey
    .split('-')
    .filter((s) => !excludeWords.has(s))
    .join('-')
}
