# Blackjack-tools

Some JS classes to work with the popular card game Blackjack.

`sim.js` is a simulator (run it, it defaultly simulates 6 players playing basic strategy, and a dealer hitting on 16 and below).

`blackjack.js` contains the classes of the card deck, player, dealer, result, hand, card and log.

`game.js` contains the game class that runs through a game of blackjack.

`strategy.js` contains the implementation of the blackjack Basic Strategy choice matrix.

## Basic Strategy

Implements "Basic Strategy" i.e. the matrix of whether to hit/stand/double/split on any hand, given the dealer's face-up card.

Player will double when the stategy tells them to, leading to larger winnings in the case of a win.

## Customisations

You can change the default bet amount.

You can change the payout (i.e., default is 3/2, whereas some casino tables are 6/5 etc.)

You can change the number of rounds.

You can change the number of players.

You can select what to print using different logging types.

You can choose to print emoji suits or just letters.

## Example Output

If full log output is enabled, the following is an example of a round of play:

    Round 1, Card 1, Player 1: (4♠️  [hard 4])
    Round 1, Card 1, Player 2: (10♠️  [hard 10])
    Round 1, Card 1, Player 3: (Q♣️  [hard 10])
    Round 1, Card 1, Player 4: (5♥️  [hard 5])
    Round 1, Card 1, Player 5: (3♠️  [hard 3])
    Round 1, Card 1, Player 6: (A♦️  [soft 11])
    Round 1, Card 1, Dealer: (7♥️  [hard 7])
    Round 1, Card 2, Player 1: (4♠️ ,6♦️  [hard 10])
    Round 1, Card 2, Player 1 (after strategy): (4♠️ ,6♦️ ,8♦️  [hard 18])
    Round 1, Card 2, Player 2: (10♠️ ,2♠️  [hard 12])
    Round 1, Card 2, Player 2 (after strategy): (10♠️ ,2♠️ ,4♥️ ,9♦️  [hard 25])
    Round 1, Card 2, Player 3: (Q♣️ ,9♥️  [hard 19])
    Round 1, Card 2, Player 3 (after strategy): (Q♣️ ,9♥️  [hard 19])
    Round 1, Card 2, Player 4: (5♥️ ,10♥️  [hard 15])
    Round 1, Card 2, Player 4 (after strategy): (5♥️ ,10♥️ ,10♣️  [hard 25])
    Round 1, Card 2, Player 5: (3♠️ ,J♠️  [hard 13])
    Round 1, Card 2, Player 5 (after strategy): (3♠️ ,J♠️ ,4♣️  [hard 17])
    Round 1, Card 2, Player 6: (A♦️ ,5♦️  [soft 16])
    Round 1, Card 2, Player 6 (after strategy): (A♦️ ,5♦️ ,A♣️ ,6♣️ ,J♣️  [hard 23])
    Round 1, Card 2, Dealer: (7♥️ ,Q♠️  [hard 17])
    Round 1, Card 2, Dealer (after dealer strategy): (7♥️ ,Q♠️  [hard 17])
    Player 1, trick 1 wins.
    Player 2, trick 1 loses.
    Player 3, trick 1 wins.
    Player 4, trick 1 loses.
    Player 5, trick 1 pushes.
    Player 6, trick 1 loses.

At the end of the simulation, a summary of the results are shown:

    Player 1: 
        Played: 5, Won: 4, Pushed: 0, Lost: 1
        Bet: 50, Winnings: 100, Payout: 2
    Player 2: 
        Played: 5, Won: 2, Pushed: 1, Lost: 2
        Bet: 50, Winnings: 60, Payout: 1.2
    Player 3: 
        Played: 5, Won: 3, Pushed: 0, Lost: 2
        Bet: 50, Winnings: 75, Payout: 1.5
    Player 4: 
        Played: 5, Won: 1, Pushed: 1, Lost: 3
        Bet: 50, Winnings: 35, Payout: 0.7
    Player 5: 
        Played: 5, Won: 4, Pushed: 1, Lost: 0
        Bet: 50, Winnings: 110, Payout: 2.2
    Player 6: 
        Played: 5, Won: 2, Pushed: 0, Lost: 3
        Bet: 50, Winnings: 50, Payout: 1

    Average Payout: 1.4333333333333336

## Installation

Run `npm install` to install the dependencies.

Run `node sim` to run the simulation.

## Issues

Does not implement splitting (although there is skeleton support, in that multiple tricks per hand has been coded in).

Does not implement insurance.

