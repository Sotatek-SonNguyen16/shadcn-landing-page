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

export enum EInterval {
    _1H = '1h',
    _6H = '6h',
    _1D = '1d',
    _1W = '1w',
    _1M = '1m',
    ALL = 'max'
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

interface MarketPriceHistory {
    value: number
    time: number
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
    outcomePrices: string[] // JSON-encoded string
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
    eventId: string
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

type OrderFormValues = {
    amount: number
    size: number
}

type OrderStatus =
    | 'New'
    | 'Pending'
    | 'Accepted'
    | 'Rejected'
    | 'Cancelling'
    | 'Cancelled'
    | 'Filled'
    | 'Partially Filled'

type ActiveOrder = {
    orderId: string
    marketId: string
    assetId: string
    price: number
    side: ESide
    size: number
    sizeMatched: number
    orderType: string
    userAddress: string
    status: OrderStatus
    createdAt: string
}

type MarketTrade = {
    orderIds: string[]
    assetId: string
    price: number
    side: ESide
    size: number
    sizeMatched: number
}

export type ITrade = {
    eventId: string
    assetId: string
    marketId: string
    price: number
    shares: number
    timestamp: number
    totalValue: number
    type: string
    userAddress: string
    name?: string
    image?: string
    positionType?: string
}

type MyActiveOrder = {
    activeOrder: ActiveOrder
    marketDetail?: MarketDetail
}

type TPosition = {
    userAddress: string
    positionId: string
    marketId: string
    avgPrice: number
    currentPrice: number
    size: number
    expiredAt: number
    status: string
}

interface ITelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    photo_url?: string
}

interface IWebApp {
    ready: () => void
    initData: string
    initDataUnsafe: {
        query_id: string
        user: ITelegramUser
        auth_date: string
        hash: string
    }
    version: string
    platform: string
    colorScheme: string
    themeParams: {
        link_color: string
        button_color: string
        button_text_color: string
        secondary_bg_color: string
        hint_color: string
        bg_color: string
        text_color: string
    }
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    isClosingConfirmationEnabled: boolean
    headerColor: string
    backgroundColor: string
    BackButton: {
        isVisible: boolean
    }
    MainButton: {
        text: string
        color: string
        textColor: string
        isVisible: boolean
        isProgressVisible: boolean
        isActive: boolean
    }
    HapticFeedback: any
}

type TradeType = 'BUY' | 'SELL' | 'REDEEM'
type SortByType = 'timestamp' | 'shares' | 'totalValue' | 'price'
type SortOrderType = 'asc' | 'desc'

export type {
    ActiveOrder,
    Market,
    MarketDetail,
    MarketPriceHistory,
    MarketTrade,
    MyActiveOrder,
    Order,
    OrderBookEvent,
    OrderFormValues,
    OrderStatus,
    PolyMarketDetail,
    PredictionMarket,
    PriceChangeEvent,
    TPosition,
    ITelegramUser,
    IWebApp,
    TradeType,
    SortByType,
    SortOrderType
}

export { EBetOption, EEventType, EFormType, EMarketDepth, ESide }
