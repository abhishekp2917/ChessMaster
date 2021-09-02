window.onload = ()=>{

    var singlePlayer = true;
    var isBlackSelected = true;
    var timeValue = "10:00";
    var turn = true;

    
    const settings = document.getElementsByClassName("setting-container")[0];

    const modes = document.getElementsByClassName("game-mode");
    const colors = document.getElementsByClassName("piece-color");
    const timers = document.getElementsByClassName("time-box");
    const playBtn = document.getElementsByTagName("button")[0];
    const name = document.getElementById("playerb-name");

    const square = document.getElementsByClassName("square");

    const whiteTimer = document.getElementById("whiteTimer");
    const blackTimer = document.getElementById("blackTimer");

    const whiteDeadSquare = document.querySelectorAll("#whiteDead div div div");
    const blackDeadSquare = document.querySelectorAll("#blackDead div div div");
    
    const playeraName = document.querySelector(".playera .username");
    const playerbName = document.querySelector(".playerb .username");

    const PlayeraScore = document.querySelector(".playera .score");
    const PlayerbScore = document.querySelector(".playerb .score");

    var sqNum;
    var whiteTimerMinutes, whiteTimerSeconds;
    var blackTimerMinutes, blackTimerSeconds;
    var whiteCounter, blackCounter;

    /*--------------------------------------------define variables-----------------------------------------------------*/    
   
    //object for chess pieces    
    var chessPieces ={
        'p':'&#9817;',
        'r':'&#9820;',
        'b':'&#9821;',
        'n':'&#9822;',
        'q':'&#9819;',
        'k':'&#9818;',
        's':'&#9817;',
        'h':'&#9820;',
        'm':'&#9821;',
        'g':'&#9822;',
        'i':'&#9819;',
        'l':'&#9818;' 
    }     
    // pushing chess pieces into array 
    var piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h'];
    var tempPiecesPos = [];

    var movablePiece;

    var scoreA = scoreB = 0;

    var nameA, nameB;

    //var for getting scopes and storing it temporarily
    var scopes = [], scopesString, tempScopesString, tempScopes = [], returnScopes = [];

    //var for check on kings
    var saveWhiteKing = false, saveBlackKing = false;

    //var for initializing forloop and assigning different values
    var i,j,k,x,y,z;

    //var for black castle
    var blackKingMoved = false;
    var blackCastle = false;
    var blackLeftCastleAvailable = true;
    var blackRightCastleAvailable = true;

    //var for white castle
    var whiteKingMoved = false;
    var whiteCastle = false;
    var whiteLeftCastleAvailable = true;
    var whiteRightCastleAvailable = true;

    //array for storing values of dead pieces
    var whiteDeadPieces = [];
    var blackDeadPieces = [];

    //variable for AI
    var moveValue;
    var retaliationValue=0;
    var possibleMoves = [];
    var retaliationsArray = [];
    var actionsArray = [];

    /*--------------------------------define functions-------------------------------------------*/

    //selection of chess game modes
    function selectMode(){

        for(var m=0; m<modes.length; m++){

            modes[m].style.backgroundColor = "rgba(70, 214, 38, 0.4)";
        }
        this.style.backgroundColor = "rgba(70, 214, 38, 1)"; 
        if(this==modes[0]){
            singlePlayer=false;
        }
        else{
            singlePlayer=true;
        }     
    }

    //selection of chess piece color
    function selectColor(){

        for(var m=0; m<colors.length; m++){

            colors[m].style.border ="5px solid rgba(70, 214, 38, 0.4)";
        }
        this.style.border ="5px solid rgba(70, 214, 38, 1)"; 
        if(this==colors[0]){
            isBlackSelected = true;
        }
        else{
            isBlackSelected = false;
        }    
    }

    //selection of chess game duration
    function selectTime(){

        for(var m=0; m<timers.length; m++){

            // timers[m].children[0].style.backgroundColor = "rgba(70, 214, 38, 0.4)";
            timers[m].children[0].style.borderColor = "rgba(70, 214, 38, 0.4)";
        }
        this.children[0].style.borderColor ="rgba(70, 214, 38, 1)";
        // this.children[0].style.backgroundColor = "rgba(70, 214, 38, 1)";
        timeValue = this.children[0].innerHTML;
    }

    //function updating chessPieces on chessboard  
    function updatePieces(){
        for(i=0; i<64; i++){  
            if(piecesPos[i]!=0){
                square[i].innerHTML= chessPieces[piecesPos[i]];
            }
            else{
                square[i].innerHTML=""; 
            }  
        }  
    }  

    //function updating color of chesssquares 
    function updateSquareColor(){
        //for even number of rows
        for(i=0; i<64; ++i){

            if(Math.floor(i/8)%2!=0){

                //for even number of column
                if(i%2==0){
                        square[i].style.backgroundColor = "rgb(36, 127, 16)";  
                        square[i].style.boxShadow ="none";        
                        square[i].style.borderColor = "rgb(36, 127, 16)";
                    }    
                    //for odd number of column             
                    else{
                        square[i].style.backgroundColor = "rgb(207, 245, 151)";         
                        square[i].style.boxShadow ="none";
                        square[i].style.borderColor = "rgb(207, 245, 151)";
                    }
            }
            //for odd number of rows        
            else{
                //for odd number of column
                if(i%2!=0){
                    square[i].style.backgroundColor = "rgb(36, 127, 16)";          
                    square[i].style.boxShadow ="none";
                    square[i].style.borderColor = "rgb(36, 127, 16)";
                }
                //for even number of column
                else{
                    square[i].style.backgroundColor = "rgb(207, 245, 151)";             
                    square[i].style.boxShadow ="none";                                  
                    square[i].style.borderColor = "rgb(207, 245, 151)";
                }
            }                                                               
        }
    }

    //update pieces color
    function updatePiecesColor(){
        for(i=0; i<64; ++i){

            if(isBlackSelected){

                if("prnbqk".indexOf(piecesPos[i])>=0){
                    square[i].style.color ="#fff"; 
                    square[i].style.textShadow = "1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000";
                }
                else if("shgmil".indexOf(piecesPos[i])>=0){
                    square[i].style.color ="#000"; 
                    square[i].style.textShadow = "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff";
                }      
            }
            else{

                if("shgmil".indexOf(piecesPos[i])>=0){
                    square[i].style.color ="#fff"; 
                    square[i].style.textShadow = "1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000";
                }
                else if("prnbqk".indexOf(piecesPos[i])>=0){
                    square[i].style.color ="#000"; 
                    square[i].style.textShadow = "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff";
                }      
            }
        }
    }

    //update opponent moves square color
    function updateMovesColor(prev,next){
        square[prev].style.backgroundColor = "#fff";
        square[next].style.backgroundColor = "#fff";
        square[prev].style.boxShadow = "inset 0px 0px 40px 10px #f0f, inset 0px 0px 70px 30px #f0f, inset 0px 0px 80px 20px #fff";
        square[next].style.boxShadow = "inset 0px 0px 40px 10px #f0f, inset 0px 0px 70px 30px #f0f, inset 0px 0px 80px 20px #fff";   
        square[prev].style.borderColor = "#fff" ; 
        square[next].style.borderColor = "#fff" ; 
    }
  
    //update scopes color of pieces
    function updateScopesColor(){
        for(i=0; i<scopes.length; i++){
            square[scopes[i]].style.backgroundColor = "#fff";
            square[scopes[i]].style.boxShadow = "inset 0px 0px 50px 20px rgb(20, 219, 255), inset 0px 0px 100px 30px #90d9f3";    
            square[scopes[i]].style.borderColor = "#fff" ;  
        }      
    } 

    //initialize user name
    function initializeUserName(){

        nameA = "AI BotX10";
        nameB = name.value;
        playeraName.innerHTML = nameA;
        playerbName.innerHTML = nameB;
    }

    //update player score
    function updatePlayerScore(){

        PlayeraScore.innerHTML = "(" + scoreA + ")";
        PlayerbScore.innerHTML = "(" + scoreB + ")";
    }

    //initialize both timers
    function initializeTimers(){
        whiteTimer.innerHTML = blackTimer.innerHTML = timeValue;
    }

    //start white timer
    function startWhiteTimer(){
        whiteCounter = setInterval(()=>{
            
            if(whiteTimerSeconds<0){
                whiteTimerSeconds = 59;
                if(whiteTimerMinutes>0){
                    whiteTimerMinutes--;
                }
            }
            if(whiteTimerSeconds>=10){

                if(whiteTimerMinutes>=10){
                    whiteTimer.innerHTML = whiteTimerMinutes + ":" + whiteTimerSeconds;
                }
                else{
                    whiteTimer.innerHTML = "0" + whiteTimerMinutes + ":" + whiteTimerSeconds;
                }
            }
            else{

                if(whiteTimerMinutes>=10){
                    whiteTimer.innerHTML = whiteTimerMinutes + ":" + "0" + whiteTimerSeconds;
                }
                else{
                    whiteTimer.innerHTML = "0" + whiteTimerMinutes + ":" + "0" + whiteTimerSeconds;
                }
            }
            whiteTimerSeconds--;
            if(whiteTimerMinutes <=0 && whiteTimerSeconds <0){
                alert("Black wins");
                piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                setTimeout(function(){             
                    updatePieces();
                    updateSquareColor();
                    updatePiecesColor();
                    blackDeadPieces = [];
                    whiteDeadPieces = [];
                    scopesString = "";
                    tempScopesString = "";
                    initializeTimers();
                    clearInterval(whiteCounter);
                },1000);
            }
        },1000);
    }

    //stop white timer
    function stopWhiteTimer(){
        clearInterval(whiteCounter);
    }

    //start black timer
    function startBlackTimer(){
        blackCounter = setInterval(()=>{
            console.log(blackTimerMinutes + ":" + blackTimerSeconds)
            if(blackTimerSeconds<0){
                blackTimerSeconds = 59;
                if(blackTimerMinutes>0){
                    blackTimerMinutes--;
                }
            }
            if(blackTimerSeconds>=10){

                if(blackTimerMinutes>=10){
                   blackTimer.innerHTML = blackTimerMinutes + ":" + blackTimerSeconds;
                }
                else{
                    blackTimer.innerHTML = "0" + blackTimerMinutes + ":" + blackTimerSeconds;
                }
            }
            else{

                if(blackTimerMinutes>=10){
                    blackTimer.innerHTML = blackTimerMinutes + ":" + "0" + blackTimerSeconds;
                }
                else{
                    blackTimer.innerHTML = "0" + blackTimerMinutes + ":" + "0" + blackTimerSeconds;
                }
            }
            blackTimerSeconds--;
            if(blackTimerMinutes <=0 && blackTimerSeconds<0){
                alert("White wins");
                piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                setTimeout(function(){             
                    updatePieces();
                    updateSquareColor();
                    updatePiecesColor();
                    blackDeadPieces = [];
                    whiteDeadPieces = [];
                    scopesString = "";
                    tempScopesString = "";
                    initializeTimers();
                    clearInterval(blackCounter);
                },1000);
            }
        },1000);
    }

    //stop black timer
    function stopBlackTimer(){
        clearInterval(blackCounter);
    }
   
    //update dead pieces square color
    function initializeDeadSquareColor(){
        if(isBlackSelected){

            for(i=0; i<whiteDeadSquare.length; i++){
                whiteDeadSquare[i].style.color = "#fff";
                whiteDeadSquare[i].style.textShadow = "1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000";
                blackDeadSquare[i].style.color = "#000";
                blackDeadSquare[i].style.textShadow = "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff";
            }
        }
        else{

            for(i=0; i<whiteDeadSquare.length; i++){
                whiteDeadSquare[i].style.color = "#000";
                whiteDeadSquare[i].style.textShadow = "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff";
                blackDeadSquare[i].style.color = "#fff";
                blackDeadSquare[i].style.textShadow = "1px 1px #000, -1px 1px #000, 1px -1px #000, -1px -1px #000";
            }
        }
    }

    // update white dead pieces
    function updateWhiteDead(){
        for(i=0; i<whiteDeadPieces.length; i++){
            whiteDeadSquare[i].innerHTML = whiteDeadPieces[i];
        }
    }

    // update black dead pieces
    function updateBlackDead(){
        for(i=0; i<blackDeadPieces.length; i++){
            blackDeadSquare[i].innerHTML = blackDeadPieces[i];
        }
    }

    //function for checking scopes of black pieces
    function checkBlackScopes(n,piecesPos){
        x = n;
        var piece = piecesPos[n];
        returnScopes = [];
        
        //-----scopes for black pawn-----
        if(piece=="s"){
        x -=8;
            //for diagonally left move 
            if("prnbqk".indexOf(piecesPos[x-1])>=0 && x>=0 && x<64 && (x-1)%8!=7){
                returnScopes.push(x-1);
            }
            //for diagonally right move            
            if("prnbqk".indexOf(piecesPos[x+1])>=0 && x>=0 && x<64 && (x+1)%8!=0){
                returnScopes.push(x+1);
            }
            //for one forward move      
            if(piecesPos[x]==0 && x>=0 && x<64){
                returnScopes.push(x);  
            }
            //for two forward moves     
            if(piecesPos[x-8]==0 && piecesPos[x]==0 && x>=40){
                returnScopes.push(x-8);  
            }     
        }
        
        //------scopes for black rook-----
        else if(piece=="h"){
            //for forward moves
            x=n;
            x-=8;
            while(x>=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=8;   
            }
            //for backward moves
            x=n;
            x+=8;
            while(x<64){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x+=8;   
            }
            //for left way moves
            x=n;
            x--;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x--;   
            }
            //for right way moves
            x=n;
            x++;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x++;    
            }
        }

        //-----scopes for black knight------
        else if(piece=="g"){
            x=n;
            //for all direction movement
            if(x%8<6 && x%8>1){ 
                //for 2forward and right
                x-=15;      
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2forward and left
                x=n;
                x-=17;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward and 2left
                x=n;
                x-=6;     
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward and 2right
                x=n;
                x-=10;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2backward and left
                x=n;
                x+=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for 2backward and right
                x=n;
                x+=17;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward and 2right
                x=n; 
                x+=6;      
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward and 2left
                x=n;
                x+=10;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
            }
            else if(x%8==1){
                //for 2forward right
                x=n
                x-=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2forward left
                x=n
                x-=17;       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward 2right  
                x=n
                x-=6;                                       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2backward left
                x=n
                x+=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for 2backward right
                x=n
                x+=17;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward 2right
                x=n
                x+=10;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }          
            }
            else if(x%8==0){
                //for 2forward right
                x=n
                x-=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward 2right  
                x=n
                x-=6;                                       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2backward right
                x=n
                x+=17;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward 2right
                x=n
                x+=10;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }     
            }
            else if(x%8==6){
                //for 2forward right
                x=n
                x-=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2forward left
                x=n
                x-=17;       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward 2left 
                x=n
                x-=10;                                       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2backward left
                x=n
                x+=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for 2backward right
                x=n
                x+=17;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward 2left
                x=n
                x+=6;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }                    
            }
            else if(x%8==7){
                //for 2forward left
                x=n
                x-=17;       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for forward 2left 
                x=n
                x-=10;                                       
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                returnScopes.push(x); 
                }
                //for 2backward left
                x=n
                x+=15;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }
                //for backward 2left
                x=n
                x+=6;        
                if(("prnbqk".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                returnScopes.push(x); 
                }             
            }   
        }
        
        //----scopes for black bishop------
        else if(piece=="m"){
            //for forward right moves
            x=n;
            x-=7;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=7;  
            }
            //for forward left moves
            x=n;
            x-=9;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x-=9;   
            }
            //for backward right moves
            x=n;
            x+=9;
            while(x<64 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }  
                x+=9;   
            }
            //for backward left moves
            x=n;
            x+=7;
            while(x<64 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x+=7;     
            }       
        }   
        
        //-----scopes for black queen-------
        else if(piece=="i"){      
            //for forward right moves
            x=n;
            x-=7;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=7;  
            }
            //for forward left moves
            x=n;
            x-=9;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x-=9;   
            }
            //for backward right moves
            x=n;
            x+=9;
            while(x<64 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }  
                x+=9;   
            }
            //for backward left moves
            x=n;
            x+=7;
            while(x<64 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x+=7;     
            }       
            //for forward moves
            x=n;
            x-=8;
            while(x>=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=8;   
            }
            //for backward moves
            x=n;
            x+=8;
            while(x<64){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x+=8;   
            }
            //for left way moves
            x=n;
            x--;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x--;   
            }
            //for right way moves
            x=n;
            x++;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("prnbqk".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x++;    
            }            
        }
        
        //-------for black king---------
        else if(piece=="l"){
            x=n;
            //left move                  
            if(("prnbqk".indexOf(piecesPos[x-1])>=0 || piecesPos[x-1]==0) && x-1>=0 && (x-1)%8!=7){
                returnScopes.push(x-1);
            }
            //right move
            if(("prnbqk".indexOf(piecesPos[x+1])>=0 || piecesPos[x+1]==0) && x+1<64 && (x+1)%8!=0){
                returnScopes.push(x+1);
                        }
            //forward move
            if(("prnbqk".indexOf(piecesPos[x-8])>=0 || piecesPos[x-8]==0) && x-8>=0){
                returnScopes.push(x-8);
            }
            //backward move
            if(("prnbqk".indexOf(piecesPos[x+8])>=0 || piecesPos[x+8]==0) && x+8<64){
                returnScopes.push(x+8);
            } 
            //forward left
            if(("prnbqk".indexOf(piecesPos[x-7])>=0 || piecesPos[x-7]==0) && x-7>=0 && (x-7)%8!=0){
                returnScopes.push(x-7);
            }
            //forward right
            if(("prnbqk".indexOf(piecesPos[x-9])>=0 || piecesPos[x-9]==0) && x-9>=0 && (x-9)%8!=7){
                returnScopes.push(x-9);
            }
            //backward left
            if(("prnbqk".indexOf(piecesPos[x+7])>=0 || piecesPos[x+7]==0) && x+7<64 && (x+7)%8!=7){
                returnScopes.push(x+7);
            } 
            //backward right   
            if(("prnbqk".indexOf(piecesPos[x+9])>=0 || piecesPos[x+9]==0) && x+9<64 && (x+9)%8!=0){
                returnScopes.push(x+9);
            }
            if(!blackKingMoved && piecesPos[60]=="l"){
                if(blackLeftCastleAvailable){
                    if(piecesPos[x-1]==0 && piecesPos[x-2]==0 && piecesPos[x-3]==0  && piecesPos[x-4]=="h"){
                        returnScopes.push(x-2);
                        blackCastle = true;
                    }  
                }
                if(blackRightCastleAvailable){
                    if(piecesPos[x+1]==0 && piecesPos[x+2]==0 && piecesPos[x+3]=="h"){
                        returnScopes.push(x+2);
                        blackCastle = true; 
                    }   
                }
            }
            
        }
        return returnScopes;    
    } 

    //function for checking scopes of white pieces
    function checkWhiteScopes(n,piecesPos){
        x = n;
        var piece = piecesPos[n];
        returnScopes = [];
        
        //-----scopes for white pawn-----
        if(piece=="p"){
            x +=8;
            //for diagonally left move 
            if("shgmil".indexOf(piecesPos[x+1])>=0 && x<64 && (x+1)%8!=0){
                returnScopes.push(x+1);
            }
            //for diagonally right move            
            if("shgmil".indexOf(piecesPos[x-1])>=0 && x>=0 && (x-1)%8!=7){
                returnScopes.push(x-1);
            }
            //for one forward move      
            if(piecesPos[x]==0 && x<64){
                returnScopes.push(x);  
            }
            //for two forward moves     
            if(piecesPos[x+8]==0 && piecesPos[x]==0 && x<24){
                returnScopes.push(x+8);  
            }     
        }
        
        //-----scopes for white rook-----
        else if(piece=="r"){
            //for backward moves
            x=n;
            x-=8;
            while(x>=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=8;   
            }
            //for forward moves
            x=n;
            x+=8;
            while(x<64){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x+=8;   
            }
            //for right way moves
            x=n;
            x--;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x--;   
            }
            //for left way moves
            x=n;
            x++;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x++;    
            }
        }
        
        //-----scopes for white knight------
        else if(piece=="n"){
            x=n;
            //for all direction movement
            if(x%8<6 && x%8>1){ 
                //for 2backward and left
                x-=15;      
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2backward and right
                x=n;
                x-=17;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward and 2left
                x=n;
                x-=6;     
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward and 2right
                x=n;
                x-=10;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2forward and right
                x=n;
                x+=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for 2forward and left
                x=n;
                x+=17;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward and 2right
                x=n; 
                x+=6;      
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward and 2left
                x=n;
                x+=10;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
            }
            else if(x%8==1){
                //for 2backward left
                x=n
                x-=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2backward right
                x=n
                x-=17;       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward 2left  
                x=n
                x-=6;                                       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2forward right
                x=n
                x+=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for 2forward left
                x=n
                x+=17;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward 2left
                x=n
                x+=10;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }          
            }
            else if(x%8==0){
                //for 2backward left
                x=n
                x-=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward 2left  
                x=n
                x-=6;                                       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2forward left
                x=n
                x+=17;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward 2left
                x=n
                x+=10;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }     
            }
            else if(x%8==6){
                //for 2backward left
                x=n
                x-=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2backward right
                x=n
                x-=17;       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward 2right 
                x=n
                x-=10;                                       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2forward right
                x=n
                x+=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for 2forward left
                x=n
                x+=17;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward 2right
                x=n
                x+=6;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }                    
            }
            else if(x%8==7){
                //for 2backward right
                x=n
                x-=17;       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for backward 2right 
                x=n
                x-=10;                                       
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x>=0){
                    returnScopes.push(x); 
                }
                //for 2forward right
                x=n
                x+=15;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }
                //for forward 2right
                x=n
                x+=6;        
                if(("shgmil".indexOf(piecesPos[x])>=0 || piecesPos[x]==0) && x<64){
                    returnScopes.push(x); 
                }             
            }   
        }
            
        //----scopes for white bishop------
        else if(piece=="b"){
            //for backward left moves
            x=n;
            x-=7;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=7;  
            }
            //for backward right moves
            x=n;
            x-=9;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x-=9;   
            }
            //for forward left moves
            x=n;
            x+=9;
            while(x<64 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }  
                x+=9;   
            }
            //for forward right moves
            x=n;
            x+=7;
            while(x<64 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x+=7;     
            }       
        }   
        
        //-----scopes for white queen-------
        else if(piece=="q"){      
            //for backward left moves
            x=n;
            x-=7;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=7;  
            }
            //for backward right moves
            x=n;
            x-=9;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x-=9;   
            }
            //for forward left moves
            x=n;
            x+=9;
            while(x<64 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }  
                x+=9;   
            }
            //for forward right moves
            x=n;
            x+=7;
            while(x<64 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x+=7;     
            }       
            //for backward moves
            x=n;
            x-=8;
            while(x>=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                }
                x-=8;   
            }
            //for forward moves
            x=n;
            x+=8;
            while(x<64){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x+=8;   
            }
            //for right way moves
            x=n;
            x--;
            while(x>=0 && x%8!=7){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x--;   
            }
            //for left way moves
            x=n;
            x++;
            while(x>=0 && x%8!=0){
                if(piecesPos[x]==0){
                    returnScopes.push(x);  
                }
                else if("shgmil".indexOf(piecesPos[x])>=0){
                    returnScopes.push(x);
                    break; 
                }
                else{
                    break;
                } 
                x++;    
            }            
        }
            
        //-------scopes for white king---------
        else if(piece=="k"){
            x=n;
            //right move                  
            if(("shgmil".indexOf(piecesPos[x-1])>=0 || piecesPos[x-1]==0) && x-1>=0 && (x-1)%8!=7){
                returnScopes.push(x-1);
            }
            //left move
            if(("shgmil".indexOf(piecesPos[x+1])>=0 || piecesPos[x+1]==0) && x+1<64 && (x+1)%8!=0){
                returnScopes.push(x+1);
            }
            //backward move
            if(("shgmil".indexOf(piecesPos[x-8])>=0 || piecesPos[x-8]==0) && x-8>=0 && (x-8)%8!=7){
                returnScopes.push(x-8);
            }
            //forward move
            if(("shgmil".indexOf(piecesPos[x+8])>=0 || piecesPos[x+8]==0) && x+8<64 && (x+8)%8!=0){
                returnScopes.push(x+8);
            } 
            //backward left
            if(("shgmil".indexOf(piecesPos[x-7])>=0 || piecesPos[x-7]==0) && x-7>=0 && (x-7)%8!=0){
                returnScopes.push(x-7);
            }
            //backward right
            if(("shgmil".indexOf(piecesPos[x-9])>=0 || piecesPos[x-9]==0) && x-9>=0 && (x-9)%8!=7){
                returnScopes.push(x-9);
            }
            //forward right
            if(("shgmil".indexOf(piecesPos[x+7])>=0 || piecesPos[x+7]==0) && x+7<64 && (x+7)%8!=0){
                returnScopes.push(x+7);
            } 
            //forward left   
            if(("shgmil".indexOf(piecesPos[x+9])>=0 || piecesPos[x+9]==0) && x+9<64 && (x+9)%8!=0){
                returnScopes.push(x+9);
            }
            if(!whiteKingMoved && piecesPos[4]=="k"){
                if(whiteLeftCastleAvailable){
                    if(piecesPos[x-1]==0 && piecesPos[x-2]==0 && piecesPos[x-3]==0  && piecesPos[x-4]=="r"){
                        returnScopes.push(x-2);
                    }  
                    whiteCastle = true;
                }
                if(whiteRightCastleAvailable){
                    if(piecesPos[x+1]==0 && piecesPos[x+2]==0 && piecesPos[x+3]=="r"){
                        returnScopes.push(x+2);
                    }  
                    whiteCastle = true;  
                }
            }       
        }
        return returnScopes;    
    } 

    //execute check function on every square click
    function check(){
        //if its my turn
        if(turn){
            //get square Number of clicked square
            sqNum = Number(this.classList[2].slice(1));
          
            //get the scopes of clicked piece   
            scopes = checkBlackScopes(sqNum,piecesPos) || [];
            saveBlackKing = false;
                
            if("shgmil".indexOf(piecesPos[sqNum])>=0){
                //if clicked piece has any scope
                if(scopes.length){
                    movablePiece = sqNum;
                    //convert scopes array into string          
                    scopesString = scopes.join(",").split(",");
                    tempScopesString = scopesString;
                }    
            }        
            //if clicked piece is movable         
            else{
                //if selected target pos is in scopes      
                if(scopesString.indexOf (String (sqNum))>=0){
                    //assign piece pos value to temp array and change value in it          
                    for(i=0; i<64; i++){
                        tempPiecesPos[i]= piecesPos[i];
                    }
                    tempPiecesPos[sqNum] = piecesPos[movablePiece];
                    tempPiecesPos[movablePiece] = 0;
                    
                    //check if piece is king and target pos is in scope of opponent pieces              
                    for(j=0; j<64; ++j){

                        if("prnbqk".indexOf (piecesPos[j])>=0){
                            tempScopes = checkWhiteScopes(j,tempPiecesPos) || [];
                            for(k=0; k<tempScopes.length; ++k){

                                //if king is in scope of opponent pieces
                                if(tempPiecesPos [tempScopes[k]] =="l"){
                                    saveBlackKing = true;
                                    alert("Save King");
                                    tempScopes = []; 
                                    scopes =[];
                                    scopesString = "";
                                    tempScopesString = "";
                                    break;
                                }
                            }
                            if(saveBlackKing==true){
                                break;
                            }
                        } 
                    }
                    //if king move is safe           
                    if(!saveBlackKing){           
                        //pawn promotion condition
                        if(tempPiecesPos[sqNum]=="s" && sqNum<8){
                            tempPiecesPos[sqNum]="i";  
                        }
                        //king castle condition
                        if(blackCastle && tempPiecesPos[sqNum]=="l"){
                            blackCastle = false;
                            if(sqNum==62 && piecesPos[63]=="h" && blackRightCastleAvailable){
                                tempPiecesPos [61]="h";
                                tempPiecesPos [63]=0;
                            }
                            if(sqNum==58 && piecesPos[56]=="h" && blackLeftCastleAvailable){
                                tempPiecesPos [59]="h"; 
                                tempPiecesPos [56]=0;
                            } 
                        }
                        //if king has moved from its initial position
                        if(sqNum==60){
                            blackKingMoved=true;
                        }
                        //if right black rook has moved from its initial position
                        if(sqNum==63){
                            blackRightCastleAvailable = false;
                        }
                        //if left black rook has moved from its initial position
                        if(sqNum==56){
                            blackLeftCastleAvailable = false;
                        }
                        //push dead white pieces in array
                        if("pnrbqk".indexOf(piecesPos[sqNum])>=0){
                            whiteDeadPieces.push(chessPieces[piecesPos[sqNum]]);
                        }
                        //assign value of temporary position value to original one 
                        for(i=0; i<64; i++){
                            piecesPos[i]= tempPiecesPos[i];
                        }
                        updatePieces();
                        updatePiecesColor();
                        stopBlackTimer();
                        startWhiteTimer();
                        scopes = [];  
                        //check if white king is checkmated or not
                        var whiteCheckMate = checkWhiteKing(piecesPos);
                        if(whiteCheckMate){
                            alert("Black wins");
                            scoreB += 1000;
                            updatePlayerScore();
                            piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                            setTimeout(function(){
                                
                                updatePieces();
                                updateSquareColor();
                                updatePiecesColor();
                                blackDeadPieces = [];
                                whiteDeadPieces = [];
                            },5000);
                        }  
                        turn = false;
                        //execute this only if game is in single player mode
                        if(singlePlayer){
                            setTimeout(chooseWhitePiece,Math.random()*500 + 2000);
                        }
                    }
                }
                else{
                    tempScopesString = "";
                }
                scopesString ="";
            }
            // update each square color after each click
            updateSquareColor();    
            //change color of square which are in scope if there is any scope      
            for(i=0; i<scopes.length; i++){
                updateScopesColor();
            }
            if(tempScopesString.indexOf (String (sqNum))>=0){
                updateMovesColor(movablePiece,sqNum);
                tempScopesString = "";
            } 
        
        } 
        
        //-------if its not my turn---------
        else{
            //get sqr Num of clicked sqr
            sqNum = Number(this.classList[2].slice(1));
            //get the scopes of clicked piece   
            scopes = checkWhiteScopes(sqNum,piecesPos) ||[];
            saveWhiteKing = false;
        
            if("prnbqk".indexOf(piecesPos[sqNum])>=0){
                //if clicked piece has any scope
                if(scopes.length){
                    movablePiece = sqNum;
                    //convert scopes array into string          
                    scopesString = scopes.join(",").split(",");
                    tempScopesString = scopesString;
                }    
            }        
            //if clicked piece is movable         
            else{
                //if selected target pos is in scopes      
                if(scopesString.indexOf (String (sqNum))>=0){
                
                    //assign piece pos value to temp array and change value in it          
                    for(i=0; i<64; i++){
                        tempPiecesPos[i]= piecesPos[i];
                    }
                    tempPiecesPos[sqNum] = piecesPos[movablePiece];
                    tempPiecesPos[movablePiece] = 0;
                    //check if piece is king and  target pos is in scope of opponent pieces              
                    for(j=0; j<64; ++j){
                        
                        if("shgmil".indexOf (piecesPos[j])>=0){
                            tempScopes = checkBlackScopes(j,tempPiecesPos) || [];
                            for(k=0; k<tempScopes.length; ++k){

                                //if king is in scope of opponent pieces
                                if(tempPiecesPos [tempScopes[k]] =="k"){
                                    saveWhiteKing = true;
                                    alert("Save King");
                                    tempScopes = []; 
                                    scopes =[];
                                    scopesString = "";
                                    tempScopesString = "";
                                    break;
                                }
                            }
                            if(saveWhiteKing==true){
                                break;
                            }
                        } 
                    }
                    //if king move is safe           
                    if(!saveWhiteKing){           
                        //pawn promotion
                        if(tempPiecesPos[sqNum]=="p" && sqNum>=56){
                            tempPiecesPos[sqNum]="q";  
                        }
                        //condition for white king castle
                        if(whiteCastle && piecesPos[4]=="k"){
                            whiteCastle = false;
                            if(sqNum==6 && tempPiecesPos[7]=="r" && whiteLeftCastleAvailable){
                                tempPiecesPos [5]="r";
                                tempPiecesPos [7]=0;
                            }
                            if(sqNum==2 && tempPiecesPos[0]=="r" && whiteRightCastleAvailable){
                                tempPiecesPos[3]="r"; 
                                tempPiecesPos[0]=0;
                            } 
                        }
                        //if white king has moved from its initial position
                        if(sqNum==4){
                            whiteKingMoved=true;
                        }
                        //if right white rook has moved from its initial position
                        if(sqNum==0){
                            whiteRightCastleAvailable = false;
                        }
                        //if left white rook has moved from its initial position
                        if(sqNum==7){
                            whiteLeftCastleAvailable = false;
                        }
                        //push dead black pieces in an array 
                        if("shgmil".indexOf(piecesPos[sqNum])>=0){
                            blackDeadPieces.push(chessPieces[piecesPos[sqNum]]);
                        }
                        //transfer value of temporary pieces position in original one        
                        for(i=0; i<64; i++){
                            piecesPos[i]= tempPiecesPos[i];
                        }
                        updatePieces();
                        updatePiecesColor();
                        stopWhiteTimer();
                        startBlackTimer();
                        scopes = [];  
                        //check if black king is checkmated or not
                        var blackCheckMate = checkBlackKing(piecesPos);
                        if(blackCheckMate){
                            alert("White wins");
                            scoreA += 1000;
                            updatePlayerScore();
                            piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                            setTimeout(function(){
                                
                                updatePieces();
                                updateSquareColor();
                                updatePiecesColor();
                                blackDeadPieces = [];
                                whiteDeadPieces = [];
                            },5000);
                        }   
                        turn = true;
                    }
                }
                scopesString ="";
            }
            // update each square color after each click
            updateSquareColor();    
            //change color of square which are in scope if there is any scope      
            for(i=0; i<scopes.length; i++){
                updateScopesColor();
            }
            //change color of square to show movement of pieces
            if(tempScopesString.indexOf (String (sqNum))>=0){
                updateMovesColor(movablePiece,sqNum);
            }      
        }  
        updateWhiteDead();
        updateBlackDead();
    }      

    //AI chooses white piece function
    function chooseWhitePiece(){
        tempPiecesPos = [];
        tempScopes = [];
        possibleMoves = [];
        retaliationsArray = [];
        actionsArray = [];
        for(i=0; i<64; i++){
        
            //getting all white pieces
            if("prnbqk".indexOf (piecesPos[i])>=0){
                //getting scopes of particular piece   
                scopes = checkWhiteScopes(i,piecesPos) || [];
                for(j=0; j<scopes.length; j++){
            
                    retaliationValue = 0;  
                    //if target is black pawn
                    if(piecesPos[scopes[j]]=="s"){
                        moveValue = Math.random()*5+15;
                    }
                    //if target is black rook
                    if(piecesPos[scopes[j]]=="h"){
                        moveValue = Math.random()*5+70;
                    }
                    //if target is black bishop
                    if(piecesPos[scopes[j]]=="m"){
                        moveValue = Math.random()*5+50;
                    }
                    //if target is black knight
                    if(piecesPos[scopes[j]]=="g"){
                        moveValue = Math.random()*5+60;
                    }
                    //if target is black queen
                    if(piecesPos[scopes[j]]=="i"){
                        moveValue = Math.random()*5+80;
                    }
                    //if target is black king
                    if(piecesPos[scopes[j]]=="l"){
                        moveValue = Math.random()*5+100;
                    }
                    //if no target
                    if(piecesPos[scopes[j]]==0){
                        moveValue = Math.random()*5;
                    }
                    //transfering piecesPos value to tempPiecesPos array
                    for(k=0; k<64; k++){
                        tempPiecesPos[k] = piecesPos[k];
                    }
                    //switching piece pos temporarily             
                    tempPiecesPos [scopes[j]] = piecesPos[i];
                    tempPiecesPos[i]=0;
                    for(k=0; k<64; k++){

                        if("shgmil".indexOf(tempPiecesPos[k])>=0){
                                tempScopes = checkBlackScopes(k,tempPiecesPos) || [];
                                for(var z=0; z<tempScopes.length; z++){

                                    //check for king
                                    if(tempPiecesPos[tempScopes[z]] =="k"){
                                        if(retaliationValue<100){
                                                retaliationValue =100;
                                        }
                                    }
                                    //check for queen
                                    if(tempPiecesPos[tempScopes[z]] =="q"){
                                        if(retaliationValue<80){
                                            retaliationValue =80;
                                        }
                                    }
                                    //check for rook
                                    if(tempPiecesPos[tempScopes[z]] =="r"){
                                        if(retaliationValue<70){
                                            retaliationValue =70;
                                        }
                                    }
                                    //check for bishop
                                    if(tempPiecesPos[tempScopes[z]] =="b"){
                                        if(retaliationValue<40){
                                            retaliationValue =40;
                                        }
                                    }
                                    //check for knight
                                    if(tempPiecesPos[tempScopes[z]] =="n"){
                                        if(retaliationValue<50){
                                            retaliationValue =50;
                                        }
                                    }
                                    //check for pawn
                                    if(tempPiecesPos[tempScopes[z]] =="p"){
                                        if(retaliationValue<20){
                                            retaliationValue =20;
                                        }
                                    }
                                    //check for none
                                    if(tempPiecesPos[tempScopes[z]] ==0){
                                        if(retaliationValue<=0){
                                            retaliationValue =0;
                                        }
                                    }
                                }
                        }
                    }
                    actionsArray.push(moveValue);
                    retaliationsArray.push(retaliationValue);
                    possibleMoves.push(i+"_"+scopes[j]);   
                
                }
            }
        }  
        scopes =[];
        tempScopes =[];
        tempPiecesPos =[];
        
        var tempAction = [];
        var tempMove = [];
        var bestMove;
        var minRetaliation = Math.min.apply(null,retaliationsArray);
        for(i=0; i<retaliationsArray.length; i++){
            
            if(retaliationsArray[i]==minRetaliation){
                tempAction.push(actionsArray[i]);
                tempMove.push(possibleMoves[i]); 
            }
        }
        bestMove = tempMove[tempAction.indexOf(Math.max.apply(null,tempAction))];   
        if(bestMove){
            var checkMate;  
            if(minRetaliation>=100){
                alert("you Win");
                // setTimeout(function(){
                piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                setTimeout(function(){
                    updatePieces();
                    updateSquareColor();
                    turn = true;
                },500);
            }
            else{
                var x,y;
                x= bestMove.split("_")[0];
                y = bestMove.split("_")[1];
                
                if("shgmil".indexOf(piecesPos[y])>=0){
                    blackDeadPieces.push(chessPieces[piecesPos[y]]);
                }
                //white pawn promotion
                if(piecesPos[x]==='p' && y>=56){
                    piecesPos[y]='q';
                    piecesPos[x] = 0;
                }
                else{
                    piecesPos[y] = piecesPos[x];
                    piecesPos[x] = 0;              
                }
                //condition for white castle
                if(whiteCastle && piecesPos[y]=="k"){
                    whiteCastle = false;
                    if(y==6 && piecesPos[7]=="r" && whiteLeftCastleAvailable){
                        piecesPos [5]="r";
                        piecesPos [7]=0;
                    }
                if(y==2 && piecesPos[0]=="r" && whiteRightCastleAvailable){
                        piecesPos [3]="r"; 
                        piecesPos [0]=0;
                    } 
                }
                if(y==4){
                    whiteKingMoved=true;
                }
                if(y==0){
                    whiteRightCastleAvailable = false;
                }
                if(y==7){
                    whiteLeftCastleAvailable = false;
                }           
                updatePieces();
                updatePiecesColor();
                updateSquareColor();
                updateMovesColor(x,y);
                stopWhiteTimer();
                startBlackTimer();
                checkMate = checkBlackKing(piecesPos);
                if(checkMate){
                    alert("White wins");
                    scoreA += 1000;
                    updatePlayerScore();
                    piecesPos = ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'s','s','s','s','s','s','s','s','h','g','m','i','l','m','g','h']; 
                    setTimeout(function(){ 
                        updatePieces();
                        updateSquareColor();
                        updatePiecesColor();
                    },5000);
                }   
                turn = true;  
            }
        }
        updateWhiteDead();
        updateBlackDead();     
    }

    //check black king for checkMate
    function checkBlackKing(piecesPos){
        var whiteScopes = [];
        var blackScopes = [];
        var ischeckMated = false;
        var damageArray = [];
        for(i=0; i<64; ++i){
            tempPiecesPos[i] = piecesPos[i];
        }
        for(i=0; i<64; i++){

            if("shgmil".indexOf(tempPiecesPos[i])>=0){
                blackScopes = checkBlackScopes(i,tempPiecesPos) || [];  
                for(j=0; j<blackScopes.length; ++j){
                    var damage=0;
                    for(var z=0; z<64; ++z){
                        tempPiecesPos[z] = piecesPos[z];
                    } 
                    tempPiecesPos[blackScopes[j]] = tempPiecesPos[i];
                    tempPiecesPos[i] = 0;
                
                    for(k=0; k<64; ++k){
                        if("prnbqk".indexOf(tempPiecesPos[k])>=0){
                            whiteScopes = checkWhiteScopes(k,tempPiecesPos) || [];
                            for(var y=0; y<whiteScopes.length; y++){
                                if(tempPiecesPos[whiteScopes[y]]=="l"){
                                    damage =100;
                                }
                            }    
                        } 
                    }
                    //pushing damage value for each black moves
                    damageArray.push(damage);
                }
            }
        }
        tempPiecesPos = [];
        if(Math.min.apply(null,damageArray)>=100){
            isCheckMated = true;
        }
        else{
            isCheckMated = false;
        }
        return isCheckMated;    
    }

    //check white king for checkMate
    function checkWhiteKing(piecesPos){
        var whiteScopes = [];
        var blackScopes = [];
        var ischeckMated = false;
        var damageArray = [];
        for(i=0; i<64; ++i){
            tempPiecesPos[i] = piecesPos[i];
        }
        for(i=0; i<64; i++){

            if("prnbqk".indexOf(tempPiecesPos[i])>=0){
                whiteScopes = checkWhiteScopes(i,tempPiecesPos) || [];  
                for(j=0; j<whiteScopes.length; ++j){
                
                    var damage=0;
                    for(var z=0; z<64; ++z){
                        tempPiecesPos[z] = piecesPos[z];
                    } 
                    tempPiecesPos[whiteScopes[j]] = tempPiecesPos[i];
                    tempPiecesPos[i] = 0;
                
                    for(k=0; k<64; ++k){

                        if("shgmil".indexOf(tempPiecesPos[k])>=0){
                            blackScopes = checkBlackScopes(k,tempPiecesPos) || [];
                            for(var y=0; y<blackScopes.length; y++){
                                if(tempPiecesPos[blackScopes[y]]=="k"){
                                    damage =100;
                                }
                            }
                        } 
                    }
                    //pushing damage value for each black moves
                    damageArray.push(damage);
                }
            }
        }
        tempPiecesPos = [];
        if(Math.min.apply(null,damageArray)>=100){
            isCheckMated = true;
        }
        else{
            isCheckMated = false;
        }
        return isCheckMated;   
    }

    /*-------------------------------------------executing functions----------------------------------------*/
  
    
    //add event listener to select mode 
    for(i=0; i<modes.length; i++){
        modes[i].addEventListener("click",selectMode);
    }
    //add event listener to select piece color 
    for(i=0; i<colors.length; i++){
        colors[i].addEventListener("click",selectColor);
    }
    //add event listener to select game duration 
    for(i=0; i<timers.length; i++){
        timers[i].addEventListener("click",selectTime);
    }
    playBtn.addEventListener("click",startGame);


    function startGame(){
        if(name.value){
            settings.style.display = "none";

            // add eventlistener and class to each square
            for(i=0; i<64; i++){  
                square[i].addEventListener("click",check);
                square[i].classList.add("s"+i); 
            }
            
            //initializing timers
            whiteTimerMinutes = Number(timeValue.split(":")[0]);
            whiteTimerSeconds = Number(timeValue.split(":")[1]);
            blackTimerMinutes = Number(timeValue.split(":")[0]);
            blackTimerSeconds = Number(timeValue.split(":")[1]);

            //updating square color
            updateSquareColor();
            //initializinging dead square color
            initializeDeadSquareColor();
            //updating pieces color
            updatePiecesColor();
            //updating chessPieces
            updatePieces();  
            //initializing userName
            initializeUserName();
            //updating player score
            if(singlePlayer){
                scoreA = 1000;
            }
            updatePlayerScore();
            //initializing both timers
            initializeTimers();
            //starting black timer
            startBlackTimer();
        }
        else{
            alert("Enter User Name");
        }
    }
     
}