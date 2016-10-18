'use strict';
var blackjack = require('./blackjack');
var game = require('./game');

// setup
var gameOptions = {
    printEmoji: true,
    playerCount: 6,
    rounds: 5,
    //showLogs: [], // comment out this line to see full in-game logs
};

var aGame = new game.Game(gameOptions);
var players = aGame.play();
var payoutCumulative = 0;
for (var i = 0; i < players.length; ++i) {
    var player = players[i];
    var totalBet = 0;
    var totalWinnings = 0;
    var won = 0;
    var lost = 0;
    var pushed = 0;
    for (var j = 0; j < player.history.length; ++j) {
        var result = player.history[j];
        totalBet += result.bet;
        totalWinnings += result.winnings;
        if (result.outcome === blackjack.outcomes.WIN) {
            ++won;
        } else if (result.outcome === blackjack.outcomes.LOSE) {
            ++lost;
        } else if (result.outcome === blackjack.outcomes.PUSH) {
            ++pushed;
        } else {
            throw "Unknown result: " + result.outcome;
        }
    }
    var played = won + lost + pushed;
    var payout = totalWinnings / totalBet;
    payoutCumulative += payout;
    console.log("Player " + (i+1) + ": ");
    console.log("\tPlayed: " + played + ", Won: " + won + ", Pushed: " + pushed + ", Lost: " + lost);
    console.log("\tBet: " + totalBet + ", Winnings: " + totalWinnings + ", Payout: " + payout);
}

console.log("\nAverage Payout: " + (payoutCumulative / players.length));
