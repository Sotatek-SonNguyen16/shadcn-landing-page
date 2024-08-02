import React from 'react';
import {Button} from "@/components/ui/button.tsx";
import {clsx} from "clsx";
import {SquareArrowOutUpRight} from "lucide-react";

const EventResolution: React.FC = () => {
    return (
        <div className={`flex justify-between pt-3`}>
            <Button variant={`outline`} className={clsx("rounded-2xl border-gray-500")}>Propose resolution</Button>
            <div className={clsx(
                "flex items-center justify-center gap-2 p-3",
                "font-semibold text-gray-400 cursor-pointer",
                "hover:text-gray-500"
            )}>
                View details
                <SquareArrowOutUpRight width={18} height={18}/>
            </div>
        </div>
    );
};

export default EventResolution;