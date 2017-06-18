(function () {
    var start_screen = document.getElementById('start-screen');
    var game_screen = document.getElementById('game-screen');
    var score_screen = document.getElementById('score-screen');
    var difficulty_level = document.getElementById('difficulty-level');
    var game_board = document.getElementById('game-board');
    var cards_per_column = 4;
    var game_end_timeout = 900;
    var turn_timeout = 900;
    var audio = {
        success: new Audio('assets/sounds/success.mp3'),
        game_end: new Audio('assets/sounds/game-end.mp3')
    } 

    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);

    function startGame() {
        var state = {
            turn_count: 0,
            turned_cards: [],
            discarded_cards: [],
            cards_count: cards_per_column * difficulty_level.value,
        }

        var cards_array = getCards(state.cards_count);
        var game_board_rows = game_board.childNodes;

        visibilityClassSwap(start_screen, game_screen);
        renderGrid(difficulty_level.value, cards_array);

        for (var i = 0; i < game_board_rows.length; i++) {
            game_board_rows[i].addEventListener('click', function (e) {
                gameLogic(e, state);
            });
        }
    }

    function restartGame() {
        game_board.innerHTML = '';
        visibilityClassSwap(score_screen, start_screen);
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
                    cardsMatch(state);
                }, turn_timeout);
            } else if (card_one_pair_index !== card_two_pair_index) {
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
        state.turned_cards.splice(0, 2);

        if (state.discarded_cards.length === state.cards_count / 2) {
            gameEnd(state);
        }
    }

    function cardsMismatch(state) {
        for (var i = 0; i < state.turned_cards.length; i++) {
            turnCardBack(state.turned_cards[i]);
        }
        state.turn_count += 1;
        state.turned_cards.splice(0, 2);
    }

    function gameEnd(state) {
        window.setTimeout(function () {
            audio.game_end.play();
            visibilityClassSwap(game_screen, score_screen);
        }, game_end_timeout);
        document.getElementById('score').textContent = state.turn_count + ' ruchów';
    }

    function visibilityClassSwap(currentScreen, newScreen) {
        currentScreen.classList.remove('show-slide');
        newScreen.classList.add('show-slide');
    }

    function turnCard(e) {
        e.target.classList.add('pair-' + e.target.dataset.pairId);
    }

    function turnCardBack(card_to_turn_back) {
        card_to_turn_back.classList.remove('pair-' + card_to_turn_back.dataset.pairId);
    }

    function renderGrid(col_number, cards) {
        for (var i = 0; i < cards_per_column; i++) {
            var row = document.createElement('div');

            row.className = 'card-row';
            for (var j = 0; j < col_number; j++) {
                var card = drawCard(cards);
                var card_div = document.createElement('div');

                card_div.classList.add('card');
                card_div.dataset.pairId = card.pair_id;
                row.appendChild(card_div);
            }
            game_board.appendChild(row);
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

    function drawCard(array) {
        var random_index = getRandomInt(0, array.length - 1);
        var random_card = array.splice(random_index, 1)[0];

        return random_card;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

})();
