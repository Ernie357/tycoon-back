"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shuffleDeck = (deck) => {
    try {
        // Fisher-Yates shuffle function from chatgpt
        const shuffledDeck = deck.slice(); // Create a copy of the original array
        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
            // Swap elements at index i and j
            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }
        return shuffledDeck;
    }
    catch (err) {
        console.log("Error in creating deck: " + err);
        return [];
    }
};
exports.default = shuffleDeck;
//# sourceMappingURL=shuffleDeck.js.map