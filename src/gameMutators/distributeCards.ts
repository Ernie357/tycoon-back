import createDeck from "../deckUtil/createDeck";
import shuffleDeck from "../deckUtil/shuffleDeck";
import { User } from "../types";

const distributeCards = (users: User[]) => {
  const deck = createDeck();
  const shuffledDeck = shuffleDeck(deck);
  for(let i = 0; i < shuffledDeck.length;) {
    for(let j = 0; j < users.length; j++) {
      const currentCard = shuffledDeck[i];
      const currentUser = users[j];
      currentCard && currentUser.cards.push(currentCard);
      i++;
    }
  }
}

export default distributeCards;