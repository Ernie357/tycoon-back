// gets the cards able to be traded during the card trade step between rounds for the poor

const getPoorTradeCards = (cardNumberValues: string[]): string[] => {
    return [ Math.max(...cardNumberValues.map(val => Number(val))).toString() ];
}

export default getPoorTradeCards;