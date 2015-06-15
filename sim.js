'use strict';
var blackjack = require('./blackjack');
var strategy = require('./strategy');

// environment setup
var printEmoji = true;

// simulator setup
var playerStrategy = strategy.BasicStrategy({
    standAt: 17, // hits on soft 16   
    printEmoji: printEmoji,
});
var playerCount = 2;
var cardDeck = new blackjack.Deck({
    shuffled: true,   
});
var dealer = new blackjack.Dealer(cardDeck, {
    printEmoji: printEmoji,   
});
var players = new Array(playerCount);

// round 1
for (var i = 0; i < players.length; ++i) {
    players[i] = new blackjack.Player(playerStrategy, dealer);
    players[i].dealCard();
    console.log("Round 1, Player " + (i+1) + ": " + players[i].hand);
}
dealer.dealCard();
console.log("Round 1, Dealer: " + dealer.hand);

// round 2
for (var i = 0; i < players.length; ++i) {
    players[i].dealCard();
    console.log("Round 2, Player " + (i+1) + ": " + players[i].hand);
    players[i].process();
    console.log("Round 2, Player " + (i+1) + " (after strategy): " + players[i].hand);
}
dealer.dealCard();
console.log("Round 2, Dealer: " + dealer.hand);
dealer.process();
console.log("Round 2, Dealer (after dealer strategy): " + dealer.hand);

// compare players trick(s) to dealer
for (var i = 0; i < players.length; ++i) {
    var player = players[i];

    for (var j = 0; j < player.tricks.length; ++j) {
        var trick = player.tricks[j];

        if (dealer.tricks[0].state() === dealer.tricks[0].states.BUST && trick.state() !== trick.states.BUST) {
            console.log("Player " + (i+1) + ", trick " + (j+1) + ", wins.");
        } else if (dealer.tricks[0].state() !== dealer.tricks[0].states.BUST && trick.state() !== trick.states.BUST) {
            if (dealer.tricks[0].value().sum === trick.value().sum) {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " pushes.");
            } else if (dealer.tricks[0].value().sum > trick.value().sum) {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " loses.");
            } else {
                console.log("Player " + (i+1) + ", trick " + (j+1) + " wins.");
            }
        } else {
            console.log("Player " + (i+1) + ", trick " + (j+1) + " loses.");
        }
    }
}

