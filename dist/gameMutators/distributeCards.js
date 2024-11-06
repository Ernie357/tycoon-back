"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createDeck_1 = __importDefault(require("../deckUtil/createDeck"));
const shuffleDeck_1 = __importDefault(require("../deckUtil/shuffleDeck"));
const distributeCards = (users) => {
    const deck = (0, createDeck_1.default)();
    const shuffledDeck = (0, shuffleDeck_1.default)(deck);
    for (let i = 0; i < shuffledDeck.length;) {
        for (let j = 0; j < users.length; j++) {
            const currentCard = shuffledDeck[i];
            const currentUser = users[j];
            currentCard && currentUser.cards.push(currentCard);
            i++;
        }
    }
};
exports.default = distributeCards;
//# sourceMappingURL=distributeCards.js.map