window.addEventListener('DOMContentLoaded', main);

function main() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);
}

var start_screen = document.getElementById('start-screen');
var game_screen = document.getElementById('game-screen');
var score_screen = document.getElementById('score-screen');
var game_board = document.getElementById('game-board');
var rows_number = 4;
var game_end_timeout = 900;
var turn_timeout = 900;
var audio = {
    card_turn: new Audio('assets/sounds/card-turn.mp3'),
    success: new Audio('assets/sounds/success.mp3'),
    game_end: new Audio('assets/sounds/game-end.mp3')
}

function startGame() {
    var state = {
        turn_count: 0,
        turned_cards: [],
        discarded_cards: [],
        cards_count: rows_number * getDifficultyLevel()
    }
    var cards_array = getCards(state.cards_count);

    visibilityClassSwap(start_screen, game_screen);
    renderGrid(state.cards_count, cards_array, getDifficultyLevel());

    game_board.addEventListener('click', function(e) {
        gameLogic(e, state);
    });
    
    document.getElementById('difficulty-level').reset();
}

function restartGame() {
    game_board.innerHTML = '';
    game_board.className = '';
    visibilityClassSwap(score_screen, start_screen);
}

function getDifficultyLevel() {
    var difficulty_level;
    var easy = document.getElementById('easy');
    var medium = document.getElementById('medium');
    var hard = document.getElementById('hard');

    if (easy.checked) {
        difficulty_level = easy.value;
    } else if (medium.checked) {
        difficulty_level = medium.value;
    } else {
        difficulty_level = hard.value;
    }

    return difficulty_level;
}

function gameLogic(e, state) {
    if (e.target === e.currentTarget) {
        return;
    }

    if (state.turned_cards.length === 0) {
        state.turned_cards.push(e.target);
        turnCard(e);
    }

    if (state.turned_cards.length === 1 && e.target !== state.turned_cards[0]) {
        state.turned_cards.push(e.target);
        turnCard(e);

        var card_one_pair_index = state.turned_cards[0].dataset.pairId;
        var card_two_pair_index = state.turned_cards[1].dataset.pairId;

        if (card_one_pair_index === card_two_pair_index) {
            window.setTimeout(function () {
                cardsMatch(state, audio);
            }, turn_timeout);
        } else {
            window.setTimeout(function () {
                cardsMismatch(state);
            }, turn_timeout);
        }
    }
    e.stopPropagation();
}

function cardsMatch(state) {
    for (var i = 0; i < state.turned_cards.length; i++) {
        state.turned_cards[i].style.visibility = 'hidden';
    }
    audio.success.play();
    state.turn_count += 1;
    state.discarded_cards.push(state.turned_cards);
    state.turned_cards = [];

    if (state.discarded_cards.length === state.cards_count / 2) {
        gameEnd(state);
    }
}

function cardsMismatch(state) {
    for (var i = 0; i < state.turned_cards.length; i++) {
        turnCardBack(state.turned_cards[i]);
    }
    state.turn_count += 1;
    state.turned_cards = [];
}

function getSecondDigitFromRight(number) {
    return Math.floor((number / Math.pow(10, 1)) % 10);
}

function gameEnd(state) {
    window.setTimeout(function () {
        audio.game_end.play();
        visibilityClassSwap(game_screen, score_screen);
    }, game_end_timeout);
     
    if (state.turn_count % 10 === 2 || state.turn_count % 10 === 3 || state.turn_count % 10 === 4 && getSecondDigitFromRight(state.turn_count) !== 1 ) {
        document.getElementById('score').textContent = state.turn_count + ' ruchy'; 
    } else {
        document.getElementById('score').textContent = state.turn_count + ' ruchów';
    }
    
}

function visibilityClassSwap(currentScreen, newScreen) {
    currentScreen.classList.remove('show-slide');
    newScreen.classList.add('show-slide');
}

function turnCard(e) {
    audio.card_turn.play();
    e.target.classList.add('pair-' + e.target.dataset.pairId);
}

function turnCardBack(card_to_turn_back) {
    card_to_turn_back.classList.remove('pair-' + card_to_turn_back.dataset.pairId);
}

function renderGrid(cards_count, cards_array, difficulty_level) {
    for (var j = 0; j < cards_count; j++) {
        var card = drawCard(cards_array);
        var card_div = document.createElement('div');

        card_div.classList.add('card');
        card_div.dataset.pairId = card.pair_id;
        game_board.appendChild(card_div);
    }
    var easy = document.getElementById('easy').value;
    var medium = document.getElementById('medium').value;
    
    if (difficulty_level === easy) {
        game_board.classList.add('small-size');
    } else if (difficulty_level === medium) {
        game_board.classList.add('medium-size');
    } else {
        game_board.classList.add('big-size');
    }
}

function getCards(cards_count) {
    var cards = [];

    for (var pair_id = 1; pair_id <= cards_count / 2; pair_id += 1) {
        for (var i = 0; i < 2; i += 1) {
            cards.push({
                pair_id
            });
        }
    }

    return cards;
}

function drawCard(cards_array) {
    var random_index = getRandomInt(0, cards_array.length - 1);
    var random_card = cards_array.splice(random_index, 1)[0];

    return random_card;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
