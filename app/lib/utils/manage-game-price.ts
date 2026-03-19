/**
 * Questo metodo si deve occupare di:
 * X filtrare tramite regex il titolo delle info recuperate da eBay
 * X filtrare la condizione (LOOSE, CIB, SEALED)
 * X calcolo mediana
 * X rimozione outlier (IQR Method)
 */

import { ConditionCode } from '@/app/generated/prisma/enums'
import { EbayItemsSearch } from '../types/EbayItemsSearch'

export function manageGamePrice(
  items: EbayItemsSearch[],
  gameTitle: string,
  conditionCode: ConditionCode,
): {
  median: number
  count: number
  outliers: number
  minPrice: number
  maxPrice: number
} {
  if (!items) throw Error()

  try {
    const escapedTitle = gameTitle
      .replaceAll('-', ' ')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const validGamesWithPrices = items.filter((i) => {
      const title = i.title.toLowerCase()
      const regex = new RegExp(`\\b${escapedTitle}\\b(?![\\s.\\-:,]*\\d)`, 'i')

      const alwaysExclude = ['wata', 'graded', 'vga', 'cgc']
      const hasExcludedKeyword = alwaysExclude.some((keyword) =>
        title.includes(keyword),
      )

      if (!regex.test(title) || hasExcludedKeyword) {
        return false
      }

      return matchesCondition(title, conditionCode)
    })

    const prices = validGamesWithPrices
      .map((item) => parseFloat(item.price.value))
      .filter((price) => !isNaN(price))
      .sort((a, b) => a - b)

    if (prices.length === 0) {
      return { median: 0, count: 0, outliers: 0, maxPrice: 0, minPrice: 0 }
    }

    const q1Index = Math.floor(prices.length * 0.25)
    const q3Index = Math.floor(prices.length * 0.75)
    const q1 = prices[q1Index]
    const q3 = prices[q3Index]
    const iqr = q3 - q1

    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    const pricesWithoutOutliers = prices.filter(
      (price) => price >= lowerBound && price <= upperBound,
    )

    const medianIndex = Math.floor(pricesWithoutOutliers.length / 2)
    const median =
      pricesWithoutOutliers.length % 2 === 0
        ? (pricesWithoutOutliers[medianIndex - 1] +
            pricesWithoutOutliers[medianIndex]) /
          2
        : pricesWithoutOutliers[medianIndex]

    return {
      median,
      count: pricesWithoutOutliers.length,
      outliers: prices.length - pricesWithoutOutliers.length,
      minPrice: pricesWithoutOutliers[0],
      maxPrice: pricesWithoutOutliers[pricesWithoutOutliers.length - 1],
    }
  } catch (error) {
    throw new Error('Problem with manage game prices')
  }
}

/**
 * Match eBay listing titles based on condition keywords
 */
function matchesCondition(title: string, condition: ConditionCode): boolean {
  const lowerTitle = title.toLowerCase()

  switch (condition) {
    case 'LOOSE':
      const looseInclude = [
        'loose',
        'cart only',
        'cartridge only',
        'game only',
        'no box',
        'no manual',
      ]
      const looseExclude = [
        'complete',
        'cib',
        'c.i.b',
        'boxed',
        'sealed',
        'new',
        'with box',
        'w/ box',
      ]

      const hasLooseKeyword = looseInclude.some((kw) => lowerTitle.includes(kw))
      const hasLooseExclude = looseExclude.some((kw) => lowerTitle.includes(kw))

      return (
        hasLooseKeyword ||
        (!hasLooseExclude && !hasCompleteOrSealedKeyword(lowerTitle))
      )

    case 'CIB':
      const cibInclude = [
        'complete',
        'cib',
        'c.i.b',
        'boxed',
        'with box',
        'w/ box',
        'box & manual',
        'box and manual',
      ]
      const cibExclude = [
        'loose',
        'cart only',
        'cartridge only',
        'game only',
        'no box',
        'sealed',
        'brand new',
      ]

      const hasCibKeyword = cibInclude.some((kw) => lowerTitle.includes(kw))
      const hasCibExclude = cibExclude.some((kw) => lowerTitle.includes(kw))

      return hasCibKeyword && !hasCibExclude

    case 'SEALED':
      const sealedInclude = [
        'sealed',
        'brand new',
        'factory sealed',
        'unopened',
        'new sealed',
        'bnib',
        'nib',
        'new',
      ]
      const sealedExclude = ['opened', 'open', 'used', 'loose', 'no seal']

      const hasSealedKeyword = sealedInclude.some((kw) =>
        lowerTitle.includes(kw),
      )
      const hasSealedExclude = sealedExclude.some((kw) =>
        lowerTitle.includes(kw),
      )

      return hasSealedKeyword && !hasSealedExclude

    default:
      return true
  }
}

function hasCompleteOrSealedKeyword(title: string): boolean {
  const keywords = [
    'complete',
    'cib',
    'c.i.b',
    'sealed',
    'boxed',
    'with box',
    'w/ box',
  ]
  return keywords.some((kw) => title.includes(kw))
}
