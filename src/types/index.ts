type BetEvent = {
    id: number;
    avatar: string;
    name: string;
    price: number;
    chance: number;
    outcome: {
        yes: number;
        no: number;
    }
}

enum ESide {
    BUY = 'BUY',
    SELL = 'SELL',
}

enum EFormType {
    MARKET = "Market",
    LIMIT = "Limit",
    AMM = "AMM"
}

enum EMarketDepth {
    ORDER_BOOK = "OrderBook",
    GRAPH = "Graph",
    RESOLUTION = "Resolution",
}

enum EBetOption {
    YES = "Yes",
    NO = "No",
}

enum EEventType {
    PRICE_CHANGE = "price_change",
    BOOK = 'book'
}

type PriceChangeEvent = {
    asset_id: string;
    event_type: EEventType;
    hash: string;
    market: string;
    price: string;
    side: ESide;
    size: string;
    timestamp: string;
}

type Order = {
    price: string;
    size: string;
}

type OrderBookEvent = {
    asset_id: string;
    event_type: EEventType;
    hash: string;
    market: string;
    asks: Order[];
    bids: Order[];
}

export type {
    BetEvent,
    PriceChangeEvent,
    Order,
    OrderBookEvent,
}

export {
    EFormType,
    EMarketDepth,
    ESide,
    EBetOption,
    EEventType
}