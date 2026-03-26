import { PlatformCode, RegionCode } from '@/app/generated/prisma/enums'

export const SS_REGIONS_CODE: Record<string, string> = {
  jp: 'JAP',
  us: 'NTSC',
  eu: 'PAL',
}

export const SS_PLATFORM_CODE: Record<string, number> = {
  SMD: 1,
}

export const IGDB_REGIONS: Record<number, string> = {
  1: 'PAL',
  2: 'NTSC',
  3: 'PAL',
  4: 'PAL',
  5: 'JAP',
  6: 'PAL',
  7: 'PAL',
  8: 'PAL',
}

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
