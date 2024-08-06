type BetEvent = {
    id: number
    avatar: string
    name: string
    price: number
    chance: number
    outcome: {
        yes: number
        no: number
    }
}

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
    price: string
    size: string
}

type OrderBookEvent = {
    asset_id: string
    event_type: EEventType
    hash: string
    market: string
    asks: Order[]
    bids: Order[]
}

interface PolyMarket {
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
    published_at: string
    updatedBy: string
    createdAt: string
    updatedAt: string
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
    cyom: boolean
    pagerDutyNotificationEnabled: boolean
    approved: boolean
    clobRewards: CLOBReward[]
    rewardsMinSize: number
    rewardsMaxSpread: number
    spread: number
    oneDayPriceChange: number
    lastTradePrice: number
    bestBid: number
    bestAsk: number
}

interface Market {
    id: string
    question: string
    conditionId: string
    slug: string
    resolutionSource: string
    endDate: string
    liquidity: string
    startDate: string
    fee: string
    image: string
    icon: string
    description: string
    outcomes: string
    outcomePrices: string
    volume: string
    active: boolean
    marketType: string
    closed: boolean
    marketMakerAddress: string
    updatedBy: number
    createdAt: string
    updatedAt: string
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
    endDateIso: string
    startDateIso: string
    hasReviewedDates: boolean
    commentsEnabled: boolean
    volume24hr: number
    secondsDelay: number
    clobTokenIds: string[]
    umaBond: string
    umaReward: string
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
    tags: Tag[]
    cyom: boolean
    competitive: number
    pagerDutyNotificationEnabled: boolean
    approved: boolean
}

interface Tag {
    id: string
    label: string
    slug: string
    forceShow: boolean
    publishedAt: string
    updatedBy: number
    createdAt: string
    updatedAt: string
    _sync: boolean
}

interface CLOBReward {
    id: string
    conditionId: string
    assetAddress: string
    rewardsAmount: number
    rewardsDailyRate: number
    startDate: string
    endDate: string
}

interface MarketDetail {
    id: string
    question: string
    conditionId: string
    slug: string
    resolutionSource: string
    endDate: string
    liquidity: string
    startDate: string
    fee: string
    image: string
    icon: string
    description: string
    outcomes: string
    outcomePrices: string
    volume: string
    active: boolean
    marketType: string
    closed: boolean
    marketMakerAddress: string
    updatedBy: number
    createdAt: string
    updatedAt: string
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
    endDateIso: string
    startDateIso: string
    hasReviewedDates: boolean
    commentsEnabled: boolean
    volume24hr: number
    secondsDelay: number
    clobTokenIds: string[] // Array of CLOB token IDs
    umaBond: string
    umaReward: string
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
    clobRewards: {
        id: string
        conditionId: string
        assetAddress: string
        rewardsAmount: number
        rewardsDailyRate: number
        startDate: string
        endDate: string
    }[]
    rewardsMinSize: number
    rewardsMaxSpread: number
    spread: number
    oneDayPriceChange: number
    lastTradePrice: number
    bestBid: number
    bestAsk: number
}

export type {
    BetEvent,
    PriceChangeEvent,
    Order,
    OrderBookEvent,
    PolyMarket,
    MarketDetail,
    Market
}

export { EFormType, EMarketDepth, ESide, EBetOption, EEventType }
