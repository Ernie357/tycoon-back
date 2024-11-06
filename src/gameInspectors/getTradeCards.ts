// gets the number values able to be traded during the card trade step between rounds

import { Card } from "../types";
import getBeggarTradeCards from "./getBeggarTradeCards";
import getPoorTradeCards from "./getPoorTradeCards";

const getTradeCards = (cards: Card[], rank: string): string[] => {
    const cardNumberValues = cards.map(card => card.numberValue);
    switch(rank) {
        case 'beggar':
            return getBeggarTradeCards(cardNumberValues);
        case 'poor':
            return getPoorTradeCards(cardNumberValues);
        default: 
            return cardNumberValues;
    }
}

export default getTradeCards;