import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {PolyMarket} from "@/types";
import {clsx} from "clsx";
import {useNavigate} from "react-router-dom";

const MarketCardGridItem: React.FC<{ data: PolyMarket }> = ({data}) => {
    const navigate = useNavigate()

    const {id, title,} = data;

    const handleNavigateEvent = () => {
        navigate(`/event/${id}`);
    }

    return (
        <Card className={clsx(
            "w-full shadow-sm",
            "hover:shadow-lg"
        )}
        onClick={handleNavigateEvent}
        >
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter className="flex justify-between">

            </CardFooter>
        </Card>
    );
};

export default MarketCardGridItem;