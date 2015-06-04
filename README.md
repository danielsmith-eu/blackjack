# Blackjack-tools

Some JS classes to work with the popular card game Blackjack.

`sim.js` is a simulator (run it, it simulates 2 players and a dealer playing a basic strategy of sticking at or above 17)

`deck.js` contains the class of the card deck.

## Example Output

    Processing player 1: (2♥️ ,2♦️  [4])
      now is: (2♥️ ,2♦️ ,5♦️ ,7♠️ ,K♥️  [26])
    Processing player 2: (2♠️ ,A♦️  [13])
      now is: (2♠️ ,A♦️ ,4♣️  [17])
    Processing dealer: (5♣️ ,8♦️  [13])
      now is: (5♣️ ,8♦️ ,Q♦️  [23])
    Player 1, trick 1 loses.
    Player 2, trick 1, wins.

## Installation

Run `npm install` to install the dependencies.

Run `node sim` to run the simulation.

## Issues

Does not implement splitting (although there is skeleton support, in that multiple tricks per hand has been coded in).

Does not implement betting.

Does not implement doubling down.

Does not implement insurance.

Strategy is worse than basic strategy.

Dealing order is wrong.
