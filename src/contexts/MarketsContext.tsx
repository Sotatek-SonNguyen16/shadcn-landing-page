import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import RequestFactory from "@/services/RequestFactory.ts";
import {PolyMarket} from "@/types";

interface MarketContextReturnValue {
    polyMarkets: PolyMarket[] | null,
}

const MarketContext = createContext<MarketContextReturnValue | undefined>(undefined)

const useMarketsContext = () => {
    const context = useContext(MarketContext);
    if (context === undefined) {
        throw new Error('useMarketContext must be used within an MarketProvider');
    }
    return context;
}

const MarketProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const request = RequestFactory.getRequest("MarketRequest")

    const [polyMarkets, setPolyMarkets] = useState<PolyMarket[] | null>(null)

    const fetchMarkets = async () => {
        try {
            const response = await request.getTopEvents()
            if (response) {
                setPolyMarkets(response)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchMarkets()
    }, []);

    return (
        <MarketContext.Provider
            value={{
                polyMarkets,
            }}>
            {children}
        </MarketContext.Provider>
    )
}

export {useMarketsContext};
export default MarketProvider;