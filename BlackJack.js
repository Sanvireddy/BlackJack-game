//alert('Hey');

let blackjackgame = {
    'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['2', '3', '4','5','6','7','8','9','10','K','Q','J','A'],
    'cardsmap':{'2':2, '3':3, '4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
    'wins':0,'losses':0,'draws':0, 'isStand':false, 'turnsOver':false,
};


//Hit button should only work when we havent used stand yet
//Deal button should only work when the game completes i.e if any of their
//score are greater than 15 or close to 21 then deal button works
const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];

const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const lostsound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',DealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackdeal);


function randomcard()
{
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['cards'][randomIndex];
}

function blackjackHit() {
    if(!blackjackgame['isStand']) {
    let card = randomcard();   
    showCard(YOU,card);
    updatescore(card,YOU);
    showScore(YOU);
    } 
}

function showCard(activePlayer,card) {
    if(activePlayer['score'] <= 21) {
    let cardimage = document.createElement('img');
    cardimage.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardimage);
    hitsound.play();
    } 
}

function blackjackdeal() {
    if(blackjackgame['turnsOver']) {
        blackjackgame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let DealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for(let i=0;i<yourImages.length;i++) {
            yourImages[i].remove();
            
        }
        for(let i=0;i<DealerImages.length;i++) {
            DealerImages[i].remove();
        }
        YOU['score']=0;
        DEALER['score']=0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent = "Let's play!";
        document.querySelector('#blackjack-result').style.color = 'black';
        
        
        blackjackgame['turnsOver'] = false;
    }
}

function updatescore(card,activePlayer) {

    // if adding 11 keeps me below 21, add 11 other
    if(card === 'A') {
    if(activePlayer['score'] + blackjackgame['cardsmap'][card][1] <= 21) {
        activePlayer['score']+=11;
    } else {
        activePlayer['score'] += 1;
    }
    } else {
    activePlayer['score'] += blackjackgame['cardsmap'][card];   
    } 
}

function showScore(activePlayer) {
    if ( activePlayer['score']<=21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function DealerLogic() {
    blackjackgame['isStand'] = true;
    while(DEALER['score']<16 && blackjackgame['isStand']===true) {
    
        let card = randomcard();
        showCard(DEALER,card);
        updatescore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    
        blackjackgame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);   
}

    

//compute winner and return who won
//update the wins, draws and losses
function computeWinner() {
    let winner;

    if(YOU['score'] <=21) {
        // conditon: higher score than dealer 
        //or
        //when dealer busts but you're 21 or under
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackgame['wins'] ++;
            winner = YOU;
        } else if(YOU['score'] < DEALER['score']) { 
            blackjackgame['losses']++;
            winner = DEALER;
        } else if(YOU['score'] === DEALER['score']) {
            blackjackgame['draws']++;
        }
    }

     //condition: when user busts but dealer doesn't
    else if(YOU['score'] > 21 && DEALER['score'] <=21) {
        blackjackgame['losses']++;
        winner = DEALER;
    }

    //when both bust
    else if(YOU['score'] >21 && DEALER['score']>21) {
        blackjackgame['draws']++;
    }

    console.log(blackjackgame);
    return winner;
}

function showResult(winner) {
    let message,messageColor;
    if(blackjackgame['turnsOver']) {
        if(winner === YOU) {
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winsound.play();
        } else if(winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackgame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lostsound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackgame['draws'];
            message = 'You drew!';
            messageColor = 'Black';
            
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
    
