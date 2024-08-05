import React from 'react';
import MarketListLayout from "@/views/market/MarketListLayout.tsx";
import MarketProvider from "@/contexts/MarketsContext.tsx";

const MarketPage: React.FC = () => {
    return (
        <MarketProvider>
            <div className="w-full mt-3">
                <MarketListLayout layout="grid"/>
            </div>
        </MarketProvider>
    );
};

export default MarketPage;