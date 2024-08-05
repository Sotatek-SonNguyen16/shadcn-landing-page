import {BetEvent} from "@/types";

const events: BetEvent[] = [
    {
        id: 1,
        name: 'Donald Trump',
        avatar: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-donald-trump-win-the-2024-us-presidential-election-c83f01bb-5089-4222-9347-3f12673b6a48.png&w=96&q=100",
        chance: 55,
        price: 58359314,
        outcome: {
            yes: 55,
            no: 46,
        }
    },
    {
        id: 2,
        name: 'Kamala Harris',
        avatar: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-kamala-harris-win-the-2024-us-presidential-election-21483ac3-94a5-4efd-b89e-05cdca69753f.png&w=96&q=100",
        chance: 43,
        price: 43045314,
        outcome: {
            yes: 55,
            no: 46,
        }
    },
    {
        id: 3,
        name: 'Michelle Obama',
        avatar: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-michelle-obama-win-the-2024-us-presidential-election-4e54018f-04e2-47e8-93e4-35ecc0a4ac16.png&w=96&q=100",
        chance: 1,
        price: 38731513,
        outcome: {
            yes: 55,
            no: 46,
        }
    }
]


const placholder: {events: BetEvent[]} = {
    events: events,
}

export default placholder