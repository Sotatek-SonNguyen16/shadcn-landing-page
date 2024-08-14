enum ESide {
    BUY = 'BUY',
    SELL = 'SELL'
}

enum EFormType {
    MARKET = 'Market',
    LIMIT = 'Limit',
    AMM = 'AMM'
}

enum EMarketDepth {
    ORDER_BOOK = 'OrderBook',
    GRAPH = 'Graph',
    RESOLUTION = 'Resolution'
}

enum EBetOption {
    YES = 'Yes',
    NO = 'No'
}

enum EEventType {
    PRICE_CHANGE = 'price_change',
    BOOK = 'book'
}

type PriceChangeEvent = {
    asset_id: string
    event_type: EEventType
    hash: string
    market: string
    price: string
    side: ESide
    size: string
    timestamp: string
}

type Order = {
    price: number
    size: number
}

type OrderBookEvent = {
    asset_id: string
    event_type: EEventType
    hash: string
    market: string
    asks: Order[]
    bids: Order[]
}

interface PredictionMarket {
    id: string
    ticker: string
    slug: string
    title: string
    description: string
    resolutionSource: string
    startDate: string
    creationDate: string
    endDate: string
    image: string
    icon: string
    active: boolean
    closed: boolean
    archived: boolean
    new: boolean
    featured: boolean
    restricted: boolean
    liquidity: number
    volume: number
    openInterest: number
    sortBy: string
    reviewStatus: string
    published_at: string
    updatedBy: string
    createdAt: string
    updatedAt: string
    commentCount: string
    commentsEnabled: boolean
    competitive: number
    volume24hr: number
    featuredImage: string
    enableOrderBook: boolean
    liquidityClob: number
    _sync: boolean
    negRisk: boolean
    negRiskFeeBips: number
    negRiskMarketID: string
    markets: Market[]
}

interface Market {
    id: string
    outcomes: string[]
    outcomePrices: number[]
    active: boolean
    marketType: string
    closed: boolean
    groupItemTitle: string
    groupItemThreshold: string
    clobTokenIds: string[]
    icon: string
    volume: number
}

interface MarketDetail {
    id: string
    question: string
    conditionId: string
    slug: string
    resolutionSource: string
    endDate: string // ISO 8601 format
    liquidity: string // consider converting to number if appropriate
    startDate: string // ISO 8601 format
    fee: string // consider converting to number if appropriate
    image: string
    icon: string
    description: string
    outcomes: string // JSON-encoded string
    outcomePrices: string // JSON-encoded string
    volume: number // consider converting to number if appropriate
    active: boolean
    marketType: string
    closed: boolean
    marketMakerAddress: string
    updatedBy: number
    createdAt: string // ISO 8601 format
    updatedAt: string // ISO 8601 format
    wideFormat: boolean
    new: boolean
    featured: boolean
    submitted_by: string
    archived: boolean
    resolvedBy: string
    restricted: boolean
    groupItemTitle: string
    groupItemThreshold: string
    questionID: string
    enableOrderBook: boolean
    orderPriceMinTickSize: number
    orderMinSize: number
    volumeNum: number
    liquidityNum: number
    endDateIso: string // ISO 8601 format
    startDateIso: string // ISO 8601 format
    hasReviewedDates: boolean
    commentsEnabled: boolean
    volume24hr: number
    secondsDelay: number
    clobTokenIds: string[] // array of strings
    umaBond: string // consider converting to number if appropriate
    umaReward: string // consider converting to number if appropriate
    fpmmLive: boolean
    volume24hrClob: number
    volumeClob: number
    liquidityClob: number
    makerBaseFee: number
    takerBaseFee: number
    customLiveness: number
    acceptingOrders: boolean
    negRisk: boolean
    negRiskMarketID: string
    negRiskRequestID: string
    commentCount: number
    notificationsEnabled: boolean
    _sync: boolean
    creator: string
    ready: boolean
    funded: boolean
    cyom: boolean
    competitive: number
    pagerDutyNotificationEnabled: boolean
    approved: boolean
    clobRewards: ClobReward[]
    rewardsMinSize: number
    rewardsMaxSpread: number
    spread: number
    oneDayPriceChange: number
    lastTradePrice: number
    bestBid: number
    bestAsk: number
}

interface ClobReward {
    id: string
    conditionId: string
    assetAddress: string
    rewardsAmount: number
    rewardsDailyRate: number
    startDate: string // ISO 8601 format
    endDate: string // ISO 8601 format
}

interface PolyMarketDetail {
    id: string
    ticker: string
    slug: string
    title: string
    description: string
    resolutionSource: string
    startDate: string // ISO 8601 date format
    creationDate: string // ISO 8601 date format
    endDate: string // ISO 8601 date format
    image: string
    icon: string
    active: boolean
    closed: boolean
    archived: boolean
    new: boolean
    featured: boolean
    restricted: boolean
    liquidity: number
    volume: number
    openInterest: number
    sortBy: string
    reviewStatus: string
    published_at: string // ISO 8601 date format
    updatedBy: string
    createdAt: string // ISO 8601 date format
    updatedAt: string // ISO 8601 date format
    commentsEnabled: boolean
    competitive: number
    volume24hr: number
    featuredImage: string
    enableOrderBook: boolean
    liquidityClob: number
    _sync: boolean
    negRisk: boolean
    negRiskMarketID: string
    negRiskFeeBips: number
    commentCount: number
    markets: Market[]
}

export type {
    PriceChangeEvent,
    Order,
    OrderBookEvent,
    PredictionMarket,
    MarketDetail,
    Market,
    PolyMarketDetail
}

export { EFormType, EMarketDepth, ESide, EBetOption, EEventType }
