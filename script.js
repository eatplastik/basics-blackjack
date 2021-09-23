var gameMode = "start";

var deck = [];

var userHand = [];
var comHand = [];

var userHandSum = 0;
var comHandSum = 0;

var userHandString = "";
var comHandString = "";

var playedCards = []; // decide whether played cards get removed from unplayed deck or reshuffle after every round?

var gifs = {
  dealer21:
    '<img src="https://media3.giphy.com/media/26ufcZICbgCSGe5sQ/giphy.gif">',
  thinking:
    '<img src="https://c.tenor.com/RFRPkimHjfcAAAAC/zach-galifianakis-very-bad-trip-meme.gif">',
  applause:
    '<img src="https://media0.giphy.com/media/lodhOPXFCRTbTY9TbL/giphy.gif">',
  congrats:
    '<img src="https://c.tenor.com/TnSF3OSQE1cAAAAd/fireworks-congratulations.gif">',
  itsATie:
    '<img src="https://media1.giphy.com/media/xT3i0VNrc6Ny7bxfJm/giphy.gif">',
};

var main = function (input) {
  if (gameMode == "start") {
    deck = shuffleCards(makeDeck());

    // deal 2 cards to each player
    for (var dealCards = 0; dealCards < 2; dealCards++) {
      userHand.push(deck.shift());
      comHand.push(deck.shift());
    }

    // calculate sum of cards of dealer and user to determine if black jack
    userHandSum = calculateCardSum(userHand);
    comHandSum = calculateCardSum(comHand);

    console.log("user card total: " + userHandSum);
    console.log("dealer card total: " + comHandSum);

    // evaluate blackjack status
    blackjack(userHandSum, comHandSum);

    gameMode = "user turn";

    userHandString = concatHand(userHand);
    comHandString = concatHand(comHand);

    var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString} <br><br>Enter 'deal' to get additional card or 'pass' to end your turn`;

    return myOutputValue;
  } else if (gameMode == "user turn") {
    // waiting for user to hit or stand

    // auto evaluate whether ace should be 1 or 11 (rank)
    // ace should always count as 11 unless exceeds 21

    // ace rank should start at 11
    // if sum of cards > 21
    // if hand[n].cardName == ace
    // hand[n].rank = 1

    if (input.toLowerCase() == "deal") {
      userHand.push(deck.shift());
      userHandSum = calculateCardSum(userHand);
      userHandString = concatHand(userHand);
      comHandString = concatHand(comHand);

      console.log("user total after adding cards: " + userHandSum);

      if (userHandSum == 21) {
        gameReset();
        gameMode = "start";
        return `Blackjack! You win!`;
      }

      if (userHandSum > 21) {
        // check for aces in the hand
        gameReset();
        gameMode = "start";
        return "You exceeded 21, you lose!";
      } else {
        var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>Enter 'deal' to get additional card or 'pass' to end your turn`;

        return myOutputValue;
      }
      // need a conditional here to evaluate sum > 21
      // deal until you lose bitch
      // you automatically lose if you go beyond 21 and dealer wins
      // reset game

      // console.log(userHandString);

      // dealer's turn
    } else if (input.toLowerCase() == "pass") {
      gameMode = "dealer turn";

      while (comHandSum < 17) {
        comHand.push(deck.shift());
        comHandSum = calculateCardSum(comHand);
        comHandString = concatHand(comHand);
        console.log("dealer total after adding cards: " + comHandSum);
      }

      if (comHandSum > 21) {
        comHandString = concatHand(comHand);

        var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>Dealer exceeds 21, You win! Click Submit to begin a new round.`;
        gameReset();
        return myOutputValue;
      } else {
        gameMode = "determine winner";
        var myOutputValue = `Your hand: ${userHandString}<br>Dealer's hand: ${comHandString}<br><br>Click Submit to find out who wins<br><br>${gifs.thinking}`;
        return myOutputValue;
      }
    }
  } else if (gameMode == "determine winner") {
    var winner = gameResult(userHandSum, comHandSum);
    gameReset();
    gameMode = "start";
    return winner;
  }
};

var gameResult = function (userSum, comSum) {
  if (userSum > comSum) {
    return `You win! Click Submit to begin new round<br><br>${gifs.congrats}`;
  } else if (comSum > userSum) {
    return `Dealer wins! Click Submit to begin new round<br><br>${gifs.dealer21}`;
  } else {
    return `Nobody wins! Click Submit to begin new round<br><br>${gifs.itsATie}`;
  }
};

// check for aces in current hand
var checkAce = function (currentHandArray) {
  var numOfAces = 0;
  for (i = 0; i < currentHandArray.length; i++)
    if (currentHandArray[i].cardName == "ace") {
      numOfAces++;
    }
  return numOfAces;
};

// concatenate cards on hand into string, don't include comma on last element
var concatHand = function (cardsOnHand) {
  var handString = "";

  for (n = 0; n < cardsOnHand.length; n++) {
    if (n == cardsOnHand.length - 1) {
      handString += `${cardsOnHand[n].name} of ${cardsOnHand[n].suit} `;
    } else {
      handString += `${cardsOnHand[n].name} of ${cardsOnHand[n].suit}, `;
    }
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
// if holding 10 or picture cards + ace = blackjack
var blackjack = function (userSum, dealerSum) {
  if (userSum == 21 || dealerSum == 21) {
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
        rankCounter = 11;
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
      // change card ranks to 10 for court cards
      if (
        cardName == "ace" ||
        cardName == "jack" ||
        cardName == "queen" ||
        cardName == "king"
      ) {
        if (cardName == "ace") {
          rankCounter = 1;
          rankCounter++;
        } else if (cardName == "jack") {
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
