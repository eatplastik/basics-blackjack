var gameMode = "start";
// deal - deal cards
// userTurn -- hit or stand
// computerTurn

var deck = [];

var userHand = [];
var comHand = [];

var userHandSum = 0;
var comHandSum = 0;

var userHandString = "";
var comHandString = "";

var playedCards = []; // decide whether played cards get removed from unplayed deck or reshuffle after every round?

var blackjack = 21;

var main = function (input) {
  if (gameMode == "start") {
    // only initialise deck at start of game
    deck = shuffleCards(makeDeck());

    // deal 2 cards to each player
    for (var dealCards = 0; dealCards < 2; dealCards++) {
      userHand.push(deck.shift());
      comHand.push(deck.shift());
    }
    // console.log(userHand);
    // console.log(comHand);

    // calculate sum of cards of dealer and user to determine if black jack
    userHandSum = calculateCardSum(userHand);
    comHandSum = calculateCardSum(comHand);

    console.log("user card total: " + userHandSum);
    console.log("dealer card total: " + comHandSum);

    // evaluate blackjack status
    blackjack(userHandSum, comHandSum);

    gameMode = "user turn";

    userHandString = concatHand(userHand);

    var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHand[0].name} of ${comHand[0].suit}, ${comHand[1].name} of ${comHand[1].suit}<br><br>Enter 'deal' to get additional card or 'pass' to end your turn`;

    return myOutputValue;
  } else if (gameMode == "user turn") {
    // waiting for user to hit or stand

    if (input.toLowerCase() == "deal") {
      userHand.push(deck.shift());
      userHandSum = calculateCardSum(userHand);
      console.log("user total after adding cards: " + userHandSum);

      // console.log(deck.length);

      // need a conditional here to evaluate sum > 21
      // deal until you lose bitch
      // you automatically lose if you go beyond 21 and dealer wins
      // reset game

      userHandString = concatHand(userHand);
      comHandString = concatHand(comHand);

      // console.log(userHandString);

      // gameMode = "deal";

      var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>Enter 'deal' to get additional card or 'pass' to end your turn`;

      return myOutputValue;
    } else if (input.toLowerCase() == "pass") {
      gameMode = "dealer turn";

      var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>It's the dealer's turn. Click submit to determine winner`;
      return myOutputValue;
    }
  } else if (gameMode == "dealer turn") {
    while (comHandSum < 17) {
      comHand.push(deck.shift());
      comHandSum = calculateCardSum(comHand);
      comHandString = concatHand(comHand);
      console.log("dealer total after adding cards: " + comHandSum);
    }

    if (comHandSum > 21) {
      var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>You Win! Click Submit to begin a new round.`;
      gameReset();
      return myOutputValue;
    } else {
      gameMode = "determine winner";
      var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>You Win! Click Submit to find out who wins!.`;
      return myOutputValue;
    }
  } else if (gameMode == "determine winner") {
    gameResult(userHandSum, comHandSum);
    gameReset();
    gameMode = "start";
  }
};

var gameResult = function (userSum, comSum) {
  if (userSum > comSum) {
    return `You win!`;
  } else if (comSum > userSum) {
    return `Dealer wins!`;
  } else {
    return `Nobody wins!`;
  }
};

// concatenate cards on hand into string so i don't have to type them out like a retard
// make life difficult by adding conditional that don't include ',' in last element
var concatHand = function (cardsOnHand) {
  var handString = "";

  for (n = 0; n < cardsOnHand.length; n++) {
    handString += `${cardsOnHand[n].name} of ${cardsOnHand[n].suit}, `;
  }
  return handString;
};

var calculateCardSum = function (currentHandArray) {
  var cardSum = 0;
  for (i = 0; i < currentHandArray.length; i++) {
    var currentCard = currentHandArray[i];
    cardSum = cardSum + currentCard.rank;
  }
  return cardSum;
};

// empty all variables
var gameReset = function () {
  deck = [];

  userHand = [];
  userHandSum = 0;

  comHand = [];
  comHandSum = 0;

  gameMode = "start";
};

// evaluate blackjack
var blackjack = function (userSum, dealerSum) {
  if (userSum > 21 || dealerSum > 21) {
    if (userSum > 21) {
      gameReset();
      return "You went over 21, you lose!<br>Click Submit to begin a new round.";
    } else if (dealerSum > 21) {
      gameReset();
      return "Dealer went over 21, you win!<br>Click Submit to begin a new round.";
    }
  } else if (userSum == 21 || dealerSum == 21) {
    if (userSum == 21) {
      gameReset();
      return "You got blackjack!<br>Click Submit to begin a new round.";
    } else if (dealerSum == 21) {
      gameReset();
      return "Dealer got blackjack!<br>Click Submit to begin a new round.";
    }
  }
};

// if com's turn, run function function -> hit if under 17 stand if more --> click submit to determine winner
var dealersChoice = function (card1, card2) {
  var cardSum = card1 + card2;

  // find sum with rank
  // hit if under 17
  //
  // stand if above 17
  // if 21 return win
  // else if 21 return lose
  // else return card array
};

// 2 players : human vs computer
// computer is always dealer
// dealer has to hit if hand < 17
// player who is closer to 21 winds hand. aces can be 1 or 11
// court cards are 10

// ace can be 1 or 11

var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  var suitIndex = 0;

  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];

    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;

      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
        rankCounter = 10;
      } else if (cardName == 12) {
        cardName = "queen";
        rankCounter = 10;
      } else if (cardName == 13) {
        cardName = "king";
        rankCounter = 10;
      }

      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      cardDeck.push(card);
      if (cardName == "jack" || cardName == "queen" || cardName == "king") {
        if (cardName == "jack") {
          rankCounter = 11;
          rankCounter++;
        } else if (cardName == "queen") {
          rankCounter = 12;
          rankCounter++;
        } else if (cardName == "king") {
          rankCounter = 13;
          rankCounter++;
        }
      } else {
        rankCounter++;
      }
    }
    suitIndex++;
  }

  return cardDeck;
};

var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};
