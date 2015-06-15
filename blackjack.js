'use strict';
var knuthShuffle = require('knuth-shuffle').knuthShuffle;
var strategy = require('./strategy');

var suits = [
    {emoji: '♥️', name: "HEARTS", shortName: "H"},
    {emoji: '♣️', name: "CLUBS", shortName: "C"},
    {emoji: '♦️', name: "DIAMONDS", shortName: "D"},
    {emoji: '♠️', name: "SPADES", shortName: "S"},
];

var values = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: "ACE",
};

var Card = function (suit, card) {
    return {
        name: card + suit.name,
        shortName: card + suit.shortName,
        emojiName: card + suit.emoji + " ",
        value: values[card],
        card: card,
        suit: suit,
        copy: function () { return new Card(suit, card); },
    };
};

var Deck = function (options) {
    var defaults = {
        shuffled: false,
    };
    var getOption = function (key) {
        return options[key] || defaults[key];
    };

    var cards = new Array();
    for (var i = 0; i < suits.length; ++i) {
        var suit = suits[i];
        for (var j = 0; j < Object.keys(values).length; ++j) {
            var card = Object.keys(values)[j];
            cards.push(new Card(suit, card));
        };
    }

    var shuffle = function () {
        knuthShuffle(cards);
    };

    if (getOption('shuffled')) {
        shuffle();
    };
    return {
        cards: cards,
        shuffle: shuffle,
        deal: function () {
            return cards.pop(0);
        },
    };
};

// single player's hand
var Hand = function (myStrategy, dealer, tricks) {
    var tricks = tricks || [ new myStrategy.Trick(dealer) ]; // default is a single empty trick
    var dealCard = function () {
        var cards = new Array();
        for (var j = 0; j < tricks.length; ++j) {
            var card = dealer.deal();
            tricks[j].addCard(card);
            cards.push(card);
        }
        return cards;
    };
    return {
        getFirstCard: function () { // used to find the dealer's visible card
            return tricks[0].cards[0];
        },
        toString: function () {
            var out = "";
            for (var i = 0; i < tricks.length; ++i) {
                if (out.length > 0) {
                    out += " ";
                }
                out += "(" + tricks[i] + ")";
            }
            return out;
        },
        dealCard: dealCard,
        tricks: tricks,
        process: function () {
            var changes = true;
            while (changes) {
                changes = false;
                for (var i = 0; i < tricks.length; ++i) {
                    var trick = tricks[i];
                    if (trick.state() === trick.states.HIT) {
                        dealCard();
                        changes = true;
                    }
                }
            }
        },
        copy: function () { return new Hand(myStrategy, dealer, tricks); },
    };
};

var Player = function (myStrategy, dealer) {
    var hand = new Hand(myStrategy, dealer);
    return {
        hand: hand,
        tricks: hand.tricks,
        process: hand.process,
        strategy: myStrategy,
        dealCard: hand.dealCard,
    };
};

// dealer is just a player with constraints on the strategy, a deal function and getShownCard function
var Dealer = function (cardDeck, options) {
    // set up the house rules on dealers
    var defaults = {
        standAt: 17, // deals on soft 16
        takeInsurance: false,
        split: false,
        doubleDown: false,
        isDealer: true,
        printEmoji: false,
    };
    for (var i = 0; i < Object.keys(defaults).length; ++i) {
        var key = Object.keys(defaults)[i];
        if (options[key] === null || options[key] === undefined) {
            options[key] = defaults[key];
        }
    }
    var dealerStrategy = strategy.BasicStrategy(options);
    var getFirstCard = function () {
        return dealer.hand.getFirstCard();
    };
    var dealer = new Player(dealerStrategy, {deal: cardDeck.deal, getFirstCard: getFirstCard});
    dealer.deal = cardDeck.deal;
    dealer.getFirstCard = getFirstCard;
    return dealer;
};

module.exports = {
    Dealer: Dealer,
    Player: Player,
    Hand: Hand,
    Deck: Deck,
    Card: Card,
};
