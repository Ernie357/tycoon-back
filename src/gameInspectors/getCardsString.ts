import { Card } from "../types";

const getCardsString = (cards: Card[]) => {
    if(cards.length === 0) {
        return 'nothing'
    }
    if(cards.length === 1) {
        if(cards[0].faceValue === 'Ace' || cards[0].faceValue === '8') {
            return `an ${cards[0].faceValue}`;
        } else {
            return `a ${cards[0].faceValue}`;
        }
    }
    const cardMap = {};
    for(let idx = 0; idx < cards.length; idx++) {
        if(!cardMap[cards[idx].faceValue]) {
            cardMap[cards[idx].faceValue] = 1;
        } else {
            cardMap[cards[idx].faceValue]++;
        }
    }
    const keys = Object.keys(cardMap);
    let result = '';
    for(let idx = 0; idx < keys.length; idx++) {
        let numberPlayed: string;
        switch(cardMap[keys[idx]]) {
            case 1:
                numberPlayed = 'one'
                break;
            case 2:
                numberPlayed = 'two'
                break;
            case 3: 
                numberPlayed = 'three'
                break;
            case 4:
                numberPlayed = 'four'
                break;
            default:
                numberPlayed = cardMap[keys[idx]]
                break;
        }
        result += `${idx > 0 ? ' and ' : ''}${numberPlayed} ${keys[idx]}${Number(cardMap[keys[idx]]) > 1 ? "s" : ''}`
    }
    return result;
}

export default getCardsString;