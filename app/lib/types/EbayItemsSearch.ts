export interface EbayItemsSearch {
  itemId: string
  title: string
  leafCategoryIds: string[]
  categories: Category[]
  image: Image
  price: Price
  itemHref: string
  seller: Seller
  condition: string
  conditionId: string
  thumbnailImages: ThumbnailImage[]
  shippingOptions: ShippingOption[]
  buyingOptions: string[]
  epid: string
  itemWebUrl: string
  itemLocation: ItemLocation
  additionalImages: AdditionalImage[]
  adultOnly: boolean
  legacyItemId: string
  availableCoupons: boolean
  itemOriginDate: string
  itemCreationDate: string
  topRatedBuyingExperience: boolean
  priorityListing: boolean
  listingMarketplaceId: string
}

export interface Category {
  categoryId: string
  categoryName: string
}

export interface Image {
  imageUrl: string
}

export interface Price {
  value: string
  currency: string
  convertedFromValue: string
  convertedFromCurrency: string
}

export interface Seller {
  username: string
  feedbackPercentage: string
  feedbackScore: number
}

export interface ThumbnailImage {
  imageUrl: string
}

export interface ShippingOption {
  shippingCostType: string
  shippingCost: ShippingCost
  minEstimatedDeliveryDate: string
  maxEstimatedDeliveryDate: string
}

export interface ShippingCost {
  value: string
  currency: string
  convertedFromValue: string
  convertedFromCurrency: string
}

export interface ItemLocation {
  postalCode: string
  country: string
}

export interface AdditionalImage {
  imageUrl: string
}
