"use strict";
// gets the cards able to be traded during the card trade step between rounds for the poor
Object.defineProperty(exports, "__esModule", { value: true });
const getPoorTradeCards = (cardNumberValues) => {
    return [Math.max(...cardNumberValues.map(val => Number(val))).toString()];
};
exports.default = getPoorTradeCards;
//# sourceMappingURL=getPoorTradeCards.js.map