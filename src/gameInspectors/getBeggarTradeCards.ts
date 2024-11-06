// gets the number values able to be traded during the card trade step between rounds for the beggar

const getBeggarTradeCards = (cardNumberValues: string[]): string[] => {
    const firstMax: string = Math.max(...cardNumberValues.map(val => Number(val))).toString();
    cardNumberValues.splice(cardNumberValues.indexOf(firstMax), 1);
    const secondMax: string = Math.max(...cardNumberValues.map(val => Number(val))).toString();;
    return [firstMax, secondMax];
}

export default getBeggarTradeCards;