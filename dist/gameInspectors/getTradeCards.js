"use strict";
// gets the number values able to be traded during the card trade step between rounds
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getBeggarTradeCards_1 = __importDefault(require("./getBeggarTradeCards"));
const getPoorTradeCards_1 = __importDefault(require("./getPoorTradeCards"));
const getTradeCards = (cards, rank) => {
    const cardNumberValues = cards.map(card => card.numberValue);
    switch (rank) {
        case 'beggar':
            return (0, getBeggarTradeCards_1.default)(cardNumberValues);
        case 'poor':
            return (0, getPoorTradeCards_1.default)(cardNumberValues);
        default:
            return cardNumberValues;
    }
};
exports.default = getTradeCards;
//# sourceMappingURL=getTradeCards.js.map