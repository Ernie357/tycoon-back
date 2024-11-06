"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDeck = () => {
    try {
        const deck = [];
        const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
        const faceValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        const numberValues = ['15', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
        for (let i = 0; i < suits.length; i++) {
            const suit = suits[i];
            for (let j = 0; j < faceValues.length; j++) {
                const faceValue = faceValues[j];
                const numberValue = numberValues[j];
                deck.push({
                    faceValue: faceValue,
                    numberValue: numberValue,
                    suit: suit,
                    image: `${faceValue.toLowerCase()}_of_${suit.toLowerCase()}.png`
                });
            }
        }
        for (let i = 0; i < 2; i++) {
            deck.push({
                faceValue: 'Joker',
                numberValue: '16',
                suit: 'Joker',
                image: `${i === 0 ? 'black' : 'red'}_joker.png`
            });
        }
        return deck;
    }
    catch (err) {
        console.log("Error in creating deck: " + err);
        return [];
    }
};
exports.default = createDeck;
//# sourceMappingURL=createDeck.js.map