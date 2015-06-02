'use strict';
var shuffle = require('knuth-shuffle').knuthShuffle;

var suits = {
    '♥️ ': "HEARTS",
    '♣️ ': "CLUBS",
    '♦️ ': "DIAMONDS",
    '♠️ ': "SPADES",
};

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
        name: card + suit,
        value: values[card],
        card: card,
        suitname: suits[suit],
        suitcode: suit,
        copy: function () { return new Card(suit, card); },
    };
};

var Deck = function () {
    var cards = [];
    for (var i = 0; i < Object.keys(suits).length; ++i) {
        var suit = Object.keys(suits)[i];
        for (var j = 0; j < Object.keys(values).length; ++j) {
            var card = Object.keys(values)[j];
            cards.push(new Card(suit, card));
        };
    }
    return {
        cards: cards,
        shuffle: function () {
            shuffle(cards);
        },
        deal: function () {
            return cards.pop(0);
        },
    };
}

module.exports = Deck;
