/**
 * Questo metodo si deve occupare di:
 * X filtrare tramite regex il titolo delle info recuperate da eBay
 * - filtare la regione (PAL)
 * - calcolo mediana
 * - rimozione outlier (IQR Method)
 */

import { EbayItemsSearch } from '../types/EbayItemsSearch'

export function manageGamePrice(
  items: EbayItemsSearch[],
  gameTitle: string,
): {
  median: number
  count: number
  outliers: number
} {
  if (!items) throw new Error()

  try {
    const escapedTitle = gameTitle
      .replaceAll('-', ' ')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const validGamesWithPrices = items.filter((i) => {
      const title = i.title.toLowerCase()
      const regex = new RegExp(`\\b${escapedTitle}\\b(?![\\s.\\-:,]*\\d)`, 'i')
      
      // Exclude graded/sealed items (usually much more expensive)
      const excludeKeywords = ['wata', 'graded', 'vga', 'cgc']
      const hasExcludedKeyword = excludeKeywords.some(keyword => title.includes(keyword))
      
      return regex.test(title) && !hasExcludedKeyword
    })

    // Extract and sort prices
    const prices = validGamesWithPrices
      .map((item) => parseFloat(item.price.value))
      .filter((price) => !isNaN(price))
      .sort((a, b) => a - b)

    if (prices.length === 0) {
      return { median: 0, count: 0, outliers: 0 }
    }

    // Calculate Q1 and Q3 for IQR Method
    const q1Index = Math.floor(prices.length * 0.25)
    const q3Index = Math.floor(prices.length * 0.75)
    const q1 = prices[q1Index]
    const q3 = prices[q3Index]
    const iqr = q3 - q1

    // Define outlier boundaries
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    // Remove outliers
    const pricesWithoutOutliers = prices.filter(
      (price) => price >= lowerBound && price <= upperBound,
    )

    // console.log('Prices before outlier removal:', prices.length)
    // console.log('Prices after outlier removal:', pricesWithoutOutliers.length)
    // console.log('Q1:', q1, 'Q3:', q3, 'IQR:', iqr)
    // console.log('Bounds:', lowerBound, '-', upperBound)

    // Calculate median
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
    }
  } catch (error) {
    throw new Error('Problem with manage game prices')
  }
}
