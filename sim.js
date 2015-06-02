'use strict';
var Deck = require('./deck');

var playerCount = 2;
var stickAt = 17;

var cardDeck = new Deck();
cardDeck.shuffle();

var Trick = function (dealer, cards) {
    var cards = cards || [];
    var value = function () {
        var sum = 0;
        var aces = 0;
        for (var i = 0; i < cards.length; ++i) {
            var value = cards[i].value;
            if (value !== "ACE") {
                sum += value;
            } else {
                ++aces;
            }
        }
        while (aces > 0) {
            if (sum + 1 >= stickAt) {
                sum = sum + 1;
            } else {
                sum = sum + 11;
            }
            --aces;
        }
        return sum;
    };
    var states = {
        BUST: 0,
        STICK: 1,
        TWIST: 2,
    };
    var state = function () {
        var sum = value();
        if (sum > 21) {
            return states.BUST;
        } else if (sum >= stickAt && sum <= 21) {
            return states.STICK;
        } else {
            return states.TWIST;
        }
    };
    var stateAsTxt = function () {
        var stateVal = state();
        for (var i = 0; i < Object.keys(states).length; ++i) {
            var val = states[i];
            if (val === stateVal) {
                return i;
            }
        }
        return "UNKNOWN";
    };
    var result;
    return {
        cards: cards,
        addCard: function (card) {
            cards.push(card);
        },
        states: states,
        value: value,
        stateAsTxt: stateAsTxt,
        state: state,
        setResult: function (newResult) {
            result = newResult;
        },
        getResult: function () { return result; },
        toString: function () {
            var out = "";
            for (var j = 0; j < cards.length; ++j) {
                if (j !== 0) {
                    out += ",";
                }
                out += cards[j].name;
            }
            out += " [" + value() + "]";
            return out;
        },
        copy: function () { return new Trick(dealer, cards); },
    };
};

// single player's hand
var Hand = function (dealer, tricks) {
    var tricks = tricks || [ new Trick(dealer) ]; // default is a single empty trick
    var dealCard = function () {
        for (var j = 0; j < tricks.length; ++j) {
            var card = cardDeck.deal();
            tricks[j].addCard(card);
        }
    };
    return {
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
                    if (trick.state() === trick.states.TWIST) {
                        dealCard();
                        changes = true;
                    }
                }
            }
            var results = [];
            for (var i = 0; i < tricks.length; ++i) {
                var trick = tricks[i];
                trick.setResult("Trick " + i + ", Value: " + trick.value() + " (" + trick.stateAsTxt() + ")");
            }
        },
        copy: function () { return new Hand(dealer, tricks); },
    };
};

// deal cards and make hands from them
var dealHand = function (dealer) {
    var hand = new Hand(dealer);
    hand.dealCard();
    hand.dealCard();
    return hand;
};

// ===

// players play
var playersHands = [];
for (var i = 0; i < playerCount; ++i) {
    var hand = dealHand();
    playersHands.push(hand);
    console.log("Processing player " + (i+1) + ": " + hand);
    hand.process();
    console.log("  now is: " + hand);
}

// dealer plays
var dealer = dealHand(true);
console.log("Processing dealer: " + dealer);
dealer.process();
console.log("  now is: " + dealer);

// compare players hand(s) to dealer
for (var i = 0; i < playersHands.length; ++i) {
    var playerHand = playersHands[i];

    for (var j = 0; j < playerHand.tricks.length; ++j) {
        var trick = playerHand.tricks[j];

        if (dealer.tricks[0].state() === dealer.tricks[0].states.BUST && trick.state() !== trick.states.BUST) {
            console.log("Player " + (i+1) + ", trick " + (j+1) + ", wins.");
        } else if (dealer.tricks[0].state() !== dealer.tricks[0].states.BUST && trick.state() !== trick.states.BUST) {
            if (dealer.tricks[0].value() === trick.value()) {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " pushes.");
            } else if (dealer.tricks[0].value() > trick.value()) {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " loses.");
            } else {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " wins.");
            }
        } else {
            console.log("Player " + (i+1) + ", trick " + (j+1) + " loses.");
        }
    }
}

