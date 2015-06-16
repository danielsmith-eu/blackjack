'use strict';
var blackjack = require('./blackjack');
var strategy = require('./strategy');

var Game = function (options) {
    var defaults = {
        playerCount: 6,
        printEmoji: true,
        rounds: 1,
        showLogs: [blackjack.log.DEAL, blackjack.log.PLAYER, blackjack.log.TRICK_RESULT, blackjack.log.DEALER],
        logFunc: console.log,
        payout: 3/2, // e.g. change to 6/5 etc to simulate a worse payout
        bet: 10, // size of each bet
    };
    for (var i = 0; i < Object.keys(defaults).length; ++i) {
        var key = Object.keys(defaults)[i];
        if (options[key] === null || options[key] === undefined) {
            options[key] = defaults[key];
        }
    }
    var logging = {};
    for (var i = 0; i < options.showLogs.length; ++i) {
        var logFlag = options.showLogs[i];
        logging[logFlag] = true;
    }
    var log = function (level, msg) {
        if (logging[level] !== null && logging[level] !== undefined) {
            options.logFunc(msg);
        }
    };
    
    var play = function () {
        // simulator setup
        var playerStrategy = strategy.BasicStrategy({
            standAt: 17, // hits on soft 16   
            printEmoji: options.printEmoji,
        });
        var cardDeck = new blackjack.Deck({
            shuffled: true,
        }); 
        var dealer = new blackjack.Dealer(cardDeck, {
            printEmoji: options.printEmoji,
        });
        var players = new Array(options.playerCount);
        for (var i = 0; i < players.length; ++i) {
            players[i] = new blackjack.Player(playerStrategy, dealer);
        }

        for (var round = 0; round < options.rounds; ++round) {
            // TODO don't reshuffle deck every round
            // TODO support more than one deck
            cardDeck.shuffle();

            // card 1
            for (var i = 0; i < players.length; ++i) {
                players[i].newRound();
                players[i].dealCard();
                log(blackjack.log.PLAYER, "Round " + (round+1) + ", Card 1, Player " + (i+1) + ": " + players[i].getHand());
            }
            dealer.newRound();
            dealer.dealCard();
            log(blackjack.log.DEALER, "Round " + (round+1) + ", Card 1, Dealer: " + dealer.getHand());

            // card 2(+)
            for (var i = 0; i < players.length; ++i) {
                players[i].dealCard();
                log(blackjack.log.PLAYER, "Round " + (round+1) + ", Card 2, Player " + (i+1) + ": " + players[i].getHand());
                players[i].process();
                log(blackjack.log.PLAYER, "Round " + (round+1) + ", Card 2, Player " + (i+1) + " (after strategy): " + players[i].getHand());
            }
            dealer.dealCard();
            log(blackjack.log.DEALER, "Round " + (round+1) + ", Card 2, Dealer: " + dealer.getHand());
            dealer.process();
            log(blackjack.log.DEALER, "Round " + (round+1) + ", Card 2, Dealer (after dealer strategy): " + dealer.getHand());

            // compare players trick(s) to dealer
            for (var i = 0; i < players.length; ++i) {
                var player = players[i];

                for (var j = 0; j < player.getTricks().length; ++j) {
                    var trick = player.getTricks()[j];
                    var bet = options.bet;
                    if (trick.doubled) {
                        bet *= 2;
                    }

                    if (dealer.getTricks()[0].state() === dealer.getTricks()[0].states.BUST && trick.state() !== trick.states.BUST) {
                        log(blackjack.log.TRICK_RESULT, "Player " + (i+1) + ", trick " + (j+1) + ", wins.");
                        player.addResult(new blackjack.Result(blackjack.outcomes.WIN, bet, bet + (bet * options.payout)));
                    } else if (dealer.getTricks()[0].state() !== dealer.getTricks()[0].states.BUST && trick.state() !== trick.states.BUST) {
                        if (dealer.getTricks()[0].value().sum === trick.value().sum) {
                            log(blackjack.log.TRICK_RESULT, "Player " + (i+1) + ", trick " + (j+1) + " pushes.");
                            player.addResult(new blackjack.Result(blackjack.outcomes.PUSH, bet, bet)); // TODO check payout is correct
                        } else if (dealer.getTricks()[0].value().sum > trick.value().sum) {
                            log(blackjack.log.TRICK_RESULT, "Player " + (i+1) + ", trick " + (j+1) + " loses.");
                            player.addResult(new blackjack.Result(blackjack.outcomes.LOSE, bet, 0));
                        } else {
                            log(blackjack.log.TRICK_RESULT, "Player " + (i+1) + ", trick " + (j+1) + " wins.");
                            player.addResult(new blackjack.Result(blackjack.outcomes.WIN, bet, bet + (bet * options.payout)));
                        }
                    } else {
                        log(blackjack.log.TRICK_RESULT, "Player " + (i+1) + ", trick " + (j+1) + " loses.");
                        player.addResult(new blackjack.Result(blackjack.outcomes.LOSE, bet, 0));
                    }
                }
            }
        }
        return players;
    };

    return {
        play: play, 
    };
};

module.exports = {
    Game: Game,
};
