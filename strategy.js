'use strict';
var blackjack = require('./blackjack');

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

                if (sum.hard && sum.sum >= 17) {
                    return states.STAND;
                }
                if (!sum.hard && sum.sum >= 20) {
                    return states.STAND;
                }
                if (!sum.hard && sum.sum <= 12) {
                    return states.HIT; // TODO double check this
                }
                if (sum.sum <= 7) {
                    return states.HIT;
                }

                // encoding of basic strategy
                var matrix = {
                    hard: {
                        8: [states.HIT, states.HIT, states.HIT, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        9: [states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        10: [states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT],
                        11: [states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE],
                        12: [states.HIT, states.HIT, states.STAND, states.STAND, states.STAND, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        13: [states.STAND, states.STAND, states.STAND, states.STAND, states.STAND, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        14: [states.STAND, states.STAND, states.STAND, states.STAND, states.STAND, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        15: [states.STAND, states.STAND, states.STAND, states.STAND, states.STAND, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        16: [states.STAND, states.STAND, states.STAND, states.STAND, states.STAND, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                    },
                    soft: {
                        13: [states.HIT, states.HIT, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        14: [states.HIT, states.HIT, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        15: [states.HIT, states.HIT, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        16: [states.HIT, states.HIT, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        17: [states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.HIT, states.HIT, states.HIT, states.HIT, states.HIT],
                        18: [states.STAND, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.DOUBLE, states.STAND, states.STAND, states.HIT, states.HIT, states.STAND],
                        19: [states.STAND, states.STAND, states.STAND, states.STAND, states.DOUBLE, states.STAND, states.STAND, states.STAND, states.STAND, states.STAND],
                    },
                };
               
                var dealerIndex = dealerCard.value;
                if (value === "ACE") {
                    dealerIndex = 11;
                }
                dealerIndex -= 2;
                return matrix[sum.hard ? "hard" : "soft"][sum.sum][dealerIndex];
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
