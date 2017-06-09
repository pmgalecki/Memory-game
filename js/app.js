var game = (function(){
    var start_screen = document.getElementById('start-screen');
    var game_screen = document.getElementById('game-screen');   
    var score_screen = document.getElementById('score-screen');
    var difficulty_level = document.getElementById('difficulty-level');
    var game_board = document.getElementById('game-board');
//    var game_moves = document.getElementById('game-moves');
    var cards_per_column = 4;
  
    document.getElementById('start-game').addEventListener('click', function(){
        var cards_count = cards_per_column * difficulty_level.value;
        var cards_array = getCards(cards_count);
        
        visibilityClassSwap(start_screen, game_screen);
        renderGrid(difficulty_level.value, cards_array);
        
        var game_board_rows = game_board.childNodes;
        var turn_count = 0;
        var turned_cards = [];
        var discarded_cards = [];
        
        for (var i = 0; i < game_board_rows.length; i++) {
            game_board_rows[i].addEventListener('click', function(e){ 
                
                if (e.target !== e.currentTarget) {
                    
                    if (turned_cards.length === 0) {
                    turned_cards.push(e.target);    
                    turnCard(e);         
                    }
                    else if (turned_cards.length === 1 && e.target !== turned_cards[0]) {
                        turned_cards.push(e.target);   
                        turnCard(e);
                        if (turned_cards[0].attributes.pairIndex.value === turned_cards[1].attributes.pairIndex.value) {
                            window.setTimeout(function(){
                                for (var i = 0; i < turned_cards.length; i++) {
                                    turned_cards[i].style.visibility = 'hidden';
                                }
                                turn_count += 1;
//                                game_moves.textContent = turn_count;
                                discarded_cards.push(turned_cards);
                                turned_cards = [];
                                
                                if (discarded_cards.length === cards_count/2) {
                                    window.setTimeout(visibilityClassSwap(game_screen, score_screen), 300);
                                    document.getElementById('score').textContent = turn_count + ' ruchow';
                                }
                                
                            }, 500);
                        }                    
                        else if (turned_cards[0].attributes.pairIndex.value !== turned_cards[1].attributes.pairIndex.value) {
                            window.setTimeout(function(){                                
                                for (var i = 0; i < turned_cards.length; i++) {
                                    turned_cards[i].classList.remove('pair-' + turned_cards[i].attributes.pairIndex.value);                                    
                                }
                                turn_count += 1;
//                                game_moves.textContent = turn_count;
                                turned_cards = [];
                            }, 500);                            
                        }                                                                         
                    }      
                }                
                e.stopPropagation;               
            }) 
        }          
    });
    
    document.getElementById('restart-game').addEventListener('click', function(){
        game_board.innerHTML = ''; // czyszczenie planszy
        visibilityClassSwap(score_screen, start_screen);
    });
              
    function visibilityClassSwap(currentScreen, newScreen) {
        currentScreen.classList.remove('show-slide');
        newScreen.classList.add('show-slide');
    }
            
    function turnCard(e) {   
        e.target.classList.add('pair-' + e.target.attributes.pairIndex.value);   
    }
    
    function renderGrid(col_number, cards) {
        for (var i = 0; i < cards_per_column; i++) {  
            var row = document.createElement('div');
            row.className = 'row';
            for (var j = 0; j < col_number; j++) {
                var card = drawCard(cards);
                var card_div = document.createElement('div');            
                card_div.classList.add('card');
                card_div.setAttribute('pairIndex', card.pairId);
                row.appendChild(card_div);               
            }    
            game_board.appendChild(row);     
        }     
    }
    
    function getCards(cards_count) {
        var array = [];
        var card_index = 0;
        for (var pairId = 1; pairId <= cards_count / 2; pairId += 1) {
            for (var i = 0; i < 2; i += 1) {
                card_index += 1;
                array.push(getCard(pairId, card_index));
            }
        }       
        return array;
    }

    function getCard(pairId, cardId) {
        var card_obj = {
            pairId: pairId,
            cardId: cardId
        }    
        return card_obj;
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