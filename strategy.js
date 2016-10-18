'use strict';
var blackjack = require('./blackjack');
var bjstrategy = require('blackjack-strategy');

module.exports = {
    BasicStrategy: function (options) {
        var defaults = {
            standAt: 17,
            takeInsurance: false, // set to false for dealer play
            split: true, // set to false for dealer play
            doubleDown: true, // set to false for dealer play
            isDealer: false, // set to true for dealer play
            printEmoji: true, // set to false for non-emoji terminal output
        };
        var getOption = function (key) {
            var option = options[key];
            if (option === null || option === undefined) {
                return defaults[key];
            }
            return options[key];
        };

        var Trick = function (dealer, cards) {
            var cards = cards || new Array();
            var value = function () {
                var sum = 0;
                var aces = 0;
                // a hard hand is one with no aces or where aces are forced to be equal to 1.
                // a soft hand is one with at least one ace which may still count as 11 or 1.
                var hard = true;
                for (var i = 0; i < cards.length; ++i) {
                    var value = cards[i].value;
                    if (value !== "ACE") {
                        sum += value;
                    } else {
                        ++aces;
                    }
                }
                while (aces > 0) {
                    if (sum + 11 <= 21) {
                        hard = false;
                        sum = sum + 11;
                    } else {
                        sum = sum + 1;
                    }
                    --aces;
                }
                var hardness = hard ? "hard" : "soft";
                return {hard: hard, sum: sum, toString: function() { return hardness + " " + sum;} };
            };
            var states = {
                BUST: 0,
                STAND: 1,
                HIT: 2,
                DOUBLE: 3,
            };
            var state = function () {
                var dealerCard = dealer.getFirstCard();
                var sum = value();
                if (sum.sum > 21) {
                    return states.BUST;
                }

                if (getOption("isDealer")) {
                    if (sum.sum >= getOption("standAt") && sum.sum <= 21) {
                        return states.STAND;
                    } else {
                        return states.HIT;
                    }
                }

                // Look up basic strategy
                // Based on 1-deck, dealer stands on soft 17, no split, no surrender, double any cards
                var options = {numberOfDecks: 1, hitSoft17: false, maxSplitHands: 1, surrender: "none", doubleRange: [0, 21], strategyComplexity: "advanced"};
                var playerCards = cards.map(card => (card.value == "ACE" ? 1 : card.value));
                var dealerCardValue = (dealerCard.value == "ACE") ? 1 : dealerCard.value;
                var suggest = bjstrategy.GetRecommendedPlayerAction(playerCards, dealerCardValue, 1, true, options);

                if (suggest == "stand") {
                    return states.STAND;
                }
                if (suggest == "hit") {
                    return states.HIT;
                }
                if (suggest == "double") {
                    return states.DOUBLE;
                }

                console.log("GOT UNEXPECTED " + suggest);
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
            var doubled = false;
            var doubleDown = function () {
                doubled = true;
            };
            return {
                cards: cards,
                addCard: function (card) {
                    cards.push(card);
                },
                states: states,
                value: value,
                stateAsTxt: stateAsTxt,
                state: state,
                doubleDown: doubleDown,
                doubled: doubled,
                toString: function () {
                    var out = "";
                    for (var j = 0; j < cards.length; ++j) {
                        if (j !== 0) {
                            out += ",";
                        }
                        out += (getOption('printEmoji') ? cards[j].emojiName : cards[j].shortName);
                    }
                    out += " [" + value() + "]";
                    return out;
                },
                copy: function () { return new Trick(dealer, cards); },
            };
        };

        return {
            Trick: Trick, 
        };
    },
};
