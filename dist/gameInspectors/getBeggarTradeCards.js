"use strict";
// gets the number values able to be traded during the card trade step between rounds for the beggar
Object.defineProperty(exports, "__esModule", { value: true });
const getBeggarTradeCards = (cardNumberValues) => {
    const firstMax = Math.max(...cardNumberValues.map(val => Number(val))).toString();
    cardNumberValues.splice(cardNumberValues.indexOf(firstMax), 1);
    const secondMax = Math.max(...cardNumberValues.map(val => Number(val))).toString();
    ;
    return [firstMax, secondMax];
};
exports.default = getBeggarTradeCards;
//# sourceMappingURL=getBeggarTradeCards.js.map