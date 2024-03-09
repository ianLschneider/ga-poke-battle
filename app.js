    class PokeBattle {

        constructor(data, view, text){

            this.data = data
            this.view = view
            this.text = text

            this.init()
        }
       
        async init(){

            this.data.checkStorage()

            let allPokemonRequest = await this.data.getAllPokemon()
            if( allPokemonRequest ){
                
                this.setFinderText()
                this.enableButtons()
                this.updateView( "intro") 

            }else{
                console.log("no pokemon")
            }
        }
       
        setFinderText(){
            // this.view.characterSelect.randomButton.innerText = this.text.randomButton
            // this.view.characterSelect.updateText( this.text.intro, this.view.characterSelect.prompt )
            // this.view.characterSelect.updateText( this.text.select, this.view.characterSelect.select )
        }
    
       
        async setPokemon( pokemon, player ){ 
            let pokemonRequest = await this.data.getPokemon( pokemon )
            if( pokemonRequest ){

                const name = this.data.reformatPokemonName( pokemon )
                this.view.characterSelect[ player ].stats.name.textContent = name
                
                // console.log("player", pokemonRequest)

                let indx = player != "player1" ? 1 : 0

                this.data.gameState.players[ indx ].characterName = name
                this.data.gameState.players[ indx ].moves = pokemonRequest.moves

                if( pokemonRequest.sprites.length ){
                    this.data.gameState.players[ indx ].character.carousel.updateCharacter(pokemonRequest.sprites)
                }else{
                    this.view.characterSelect[ player ].carousel.images.src = 'assets/images/pokeball.png'
                }

                this.view.characterSelect[ player ].carousel.images.alt = name
                this.view.characterSelect[ player ].carousel.prevBtn.style.opacity = 1
                this.view.characterSelect[ player ].carousel.nextBtn.style.opacity = 1

                this.checkSetPlayers()

            }else{
                console.log("whoopsies something went wrong - try to catch them all later")
            }
        }
        
        enableButtons(){
            // this.view.characterSelect.randomButton.addEventListener( 'click', this.randomButtonClickHandler )
            // this.view.characterSelect.select.addEventListener( 'change', this.selectChangeHandler )
        }

        enableCarousel(){
            // this.view.characterSelect.carousel.nextBtn.addEventListener('click', event => {
            //     if( this.data.currentPokemonSprites.length ){
            //         if( this.data.currentPokemonSpriteIndex < this.data.currentPokemonSprites.length - 1 ){
            //             this.data.currentPokemonSpriteIndex ++ 
            //         }else{
            //             this.data.currentPokemonSpriteIndex = 0
            //         }
            //         this.view.characterSelect.carousel.images.src =  this.data.currentPokemonSprites[this.data.currentPokemonSpriteIndex]
            //     }
            // })

            // this.view.characterSelect.carousel.prevBtn.addEventListener('click', event => {
            //     if( this.data.currentPokemonSprites.length ){
            //         if( this.data.currentPokemonSpriteIndex > 0 ){
            //             this.data.currentPokemonSpriteIndex -- 
            //         }else{
            //             this.data.currentPokemonSpriteIndex = this.data.currentPokemonSprites.length - 1
            //         }
            //         this.view.characterSelect.carousel.images.src =  this.data.currentPokemonSprites[this.data.currentPokemonSpriteIndex]
            //     }
            // })
        }
        updateView( newView , hidePrevious = true){
            console.log( "updateView", newView )
            switch(newView){
                case "intro":
                    this.enableIntro()
                    break;
                case "characterSelect":   
                    this.disableIntro()
                    this.createCharacterSelect()
                    break;
                case "gameView":   
                    this.disableCharacterSelect()
                    this.setCharacterImages()
                    this.createGameView()
                    break;
                case "resultsView":   
                    this.disableGameView()
                    this.view.resultsView.prompt.textContent = this.data.gameResults
                    break;
            }
            this.view.updateView( this.view[ this.data.gameState.currentView ].view, this.view[ newView ].view, hidePrevious )
            this.data.gameState.currentView = newView

            // console.log("newView", this.view[ this.data.gameState.currentView ].view, this.view[ newView ].view)
        }

        setUpCPU(){
            const name = this.data.getRandomPokemon()
            this.setPokemon( name, "cpu" )
            this.checkSetPlayers()
        }

        /////////////////////////////////////////////////
        //
        //  Intro
        //
        /////////////////////////////////////////////////

        enableIntro(){
            this.view.intro.vsCPUBtn.addEventListener('click', this.vsBtnClickHandler)
            this.view.intro.vsPlayerBtn.addEventListener('click', this.vsBtnClickHandler)
            this.view.intro.gameInstructionsBtn.addEventListener('click', this.instructionsBtnClickHandler)
            this.view.intro.gameIntructionsModal.closeBtn.addEventListener('click', this.instructionsCloseBtnClickHandler)
        }
        disableIntro(){
            this.view.intro.vsCPUBtn.removeEventListener('click', this.vsBtnClickHandler)
            this.view.intro.vsPlayerBtn.removeEventListener('click', this.vsBtnClickHandler)
            this.view.intro.gameInstructionsBtn.removeEventListener('click', this.instructionsBtnClickHandler)
            this.view.intro.gameIntructionsModal.closeBtn.removeEventListener('click', this.instructionsCloseBtnClickHandler)
        }
        vsBtnClickHandler = event => {
           if(event.currentTarget.getAttribute('id') === "cpu")this.data.gameState.players[1].isCPU = true
           this.updateView(  "characterSelect"  )
        }

        instructionsBtnClickHandler = event => {
            this.view.intro.gameIntructionsModal.view.classList.add('active')
        }

        instructionsCloseBtnClickHandler = event => {
            this.view.intro.gameIntructionsModal.view.classList.remove('active')
        }

        /////////////////////////////////////////////////
        //
        //  Character Select
        //
        /////////////////////////////////////////////////

        checkSetPlayers(){
            if( this.data.gameState.players[0].characterName != "" && this.data.gameState.players[1].character != "" ){ 
                this.enableStartBtn()
            }
        }
        setAllCharacters(player){
            //console.log("A L L  D A T A:",this.data.allPokemon)
            for(let pokemon of this.data.allPokemon){
               
                let option = document.createElement( 'option' )
                option.value = pokemon
                option.textContent = pokemon.replaceAll( "-", " " )

                this.view.characterSelect[ player ].select.append( option )
            }         
        }

        setCharacterImages(){
            this.data.gameState.players.forEach( (player, i) => {
                if(player.character.carousel.data.sprites.length){
                    this.data.gameState.players[i].sprite = player.character.carousel.data.sprites[ player.character.carousel.data.spriteIndex ]
                }
            })
        }

        enableStartBtn(){
            this.view.characterSelect.startBtn.classList.remove('disabled')
            this.view.characterSelect.startBtn.classList.add('active')
            this.view.characterSelect.startBtn.addEventListener('click', this.startBtnClickHandler)
        }

        disableStartBtn(){
            this.view.characterSelect.startBtn.removeEventListener('click', this.startBtnClickHandler)
        }

        disableCharacterSelect(){
            this.disableCharacterSelectP1()
            this.disableCharacterSelectP2()
            this.disableStartBtn()
        }
 
        enableCharacterSelectP1(){
            this.view.characterSelect.player1.player.addEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player1.player.addEventListener('select', this.characterSelectHandler)
 
            this.data.gameState.players[0].character.enable()
        }

        disableCharacterSelectP1(){
            this.view.characterSelect.player1.player.removeEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player1.player.removeEventListener('select', this.characterSelectHandler)
 
            this.data.gameState.players[0].character.disable()
        }

        enableCharacterSelectP2(){
            this.view.characterSelect.player2.player.addEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player2.player.addEventListener('select', this.characterSelectHandler)

            this.data.gameState.players[1].character.enable()
        }

        disableCharacterSelectP2(){
            this.view.characterSelect.player2.player.removeEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player2.player.removeEventListener('select', this.characterSelectHandler)

            this.data.gameState.players[1].character.disable()
        }

        startBtnClickHandler = event => {
            this.updateView( "gameView" )
        }
        characterRandomBtnHandler = event => {
            console.log("characterRandomBtnHandler", event.detail.sender)

            const name = this.data.getRandomPokemon()
            this.setPokemon( name, event.detail.sender )
        }
        characterSelectHandler = event => {
            console.log("characterRandomBtnHandler", event.detail.sender)
            this.setPokemon( event.detail.value, event.detail.sender )
        }
        createCharacterSelect(){
            
            const player1 = new CharacterSelectPlayer( this.view.characterSelect.player1,  "player1")
            this.data.gameState.players[0].character = player1;
            this.setAllCharacters( "player1" )
            this.enableCharacterSelectP1()

            let player2 = null
            if( !this.data.gameState.players[1].isCPU){
                this.view.updateView( this.view.characterSelect.cpu.player, this.view.characterSelect.player2.player )
                player2 = new CharacterSelectPlayer( this.view.characterSelect.player2,  "player2")
                this.data.gameState.players[1].character = player2;
                this.setAllCharacters("player2")
                this.enableCharacterSelectP2()
            }else{
                this.view.updateView( this.view.characterSelect.player2.player, this.view.characterSelect.cpu.player )
                player2 = new CharacterSelectCPU( this.view.characterSelect.cpu, "cpu" )
                this.data.gameState.players[1].character = player2;
                this.setUpCPU()
            }
        }   
        
        
        /////////////////////////////////////////////////
        //
        //  Game View
        //
        /////////////////////////////////////////////////

        createGameView(){

            this.data.gameState.players.forEach( ( playerData, i ) => {
                console.log( "playerData", playerData.name )
                console.log( "gameView",playerData.isCPU)
                const player = new Player(playerData, this.view.gameView[ playerData.name.toLowerCase() ])
                if(!this.data.gameState.players[i].isCPU){
                    player.enableMoves()
                }else{
                    player.listMoves()
                }
                this.data.gameState.players[i].player = player
            } )
            this.view.gameView.view.addEventListener('playMove', this.playMoveHandler)
            this.checkTurn()
        }

        disableGameView(){
            this.view.gameView.view.removeEventListener('playMove', this.playMoveHandler)
            this.data.gameState.players[ 0 ].player.disableMoveButtons()
            this.data.gameState.players[ 0 ].player.disableMoveButtons()
        }

        checkTurn(){

            this.data.gameState.players[ 0 ].player.disable()
            this.data.gameState.players[ 1 ].player.disable()

            this.stopTimer()

            if( this.data.checkTurn() < 1){
                this.data.gameState.players[ 0 ].player.enable()
                this.view.gameView.playerTurn.textContent = "Player 1 Go!"
            }else{
                if( !this.data.gameState.players[ 1 ].isCPU ){
                    this.data.gameState.players[ 1 ].player.enable()
                    this.view.gameView.playerTurn.textContent = "Player 2 Go!"
                }else{
                   const cpuMove = this.data.gameState.players[ 1 ].player.playRandomMove()
                   this.data.gameState.players[ 1 ].player.enable() 
                   this.view.gameView.playerTurn.textContent = "CPU is picking a move!"
                   setTimeout(()=>{
                    this.playMove("player2", cpuMove )
                   }, 2000)
                }
               
            }

            
            this.view.gameView.playClock.textContent = this.data.gameState.playClock.maxTime
            this.startTimer()
        }
        
        //this could be a lot DRY-er
        playMove(player, move){
           
            if(player != "player2"){

                const p1 = this.data.gameState.players[ 0 ].characterName
                const p2 = this.data.gameState.players[ 1 ].characterName
                
                // this.data.gameResults = `${p2} has beaten ${p1}!`
                // this.updateView( "resultsView", false )

                
                const accuracy = Math.floor( Math.random() * 100 )

                if( accuracy >= 100 - move.move.accuracy ){
                    
                    this.data.gameState.players[ 1 ].player.takeHit( move.move.power )
            
                    console.log("health: ",this.data.gameState.players[ 1 ].player.health)

                    if(this.data.gameState.players[ 1 ].player.health < 1){
                        this.stopTimer()
                        this.data.gameResults = `${p2} has beaten ${p1}!`
                        this.view.gameView.playerTurn.textContent = ""
                        this.updateView( "resultsView", false )
                    }else{
                        this.view.gameView.gamePrompt.textContent = `${p1}'s move (${move.name}) hit ${p2} reducing ${p2}'s health by ${move.move.power}%.`
                    }
                }else{
                    this.view.gameView.gamePrompt.textContent = `${p1}'s move missed ${p2}.`
                }
                    
            }else{

                const p1 = this.data.gameState.players[ 0 ].characterName
                const p2 = this.data.gameState.players[ 1 ].characterName

                const accuracy = Math.floor( Math.random() * 100 )

                if( accuracy >= 100 - move.move.accuracy ){
                    
                    this.data.gameState.players[ 0 ].player.takeHit( move.move.power )
                    
                    if(this.data.gameState.players[ 0 ].player.health < 1){
                        this.stopTimer()
                        this.data.gameResults = `${p2} has beaten ${p1}!`
                        this.view.gameView.playerTurn.textContent = ""
                        this.updateView( "resultsView", false )
                        
                    }else{
                        this.view.gameView.gamePrompt.textContent = `${p2}'s move (${move.name}) hit ${p1} reducing ${p1}'s health by ${move.move.power}%.`
                    }
                }else{
                    this.view.gameView.gamePrompt.textContent = `${p2}'s move missed ${p1}.`
                }
            }

            if( this.data.gameState.players[ 0 ].player.health > 0 && this.data.gameState.players[ 1 ].player.health > 0 ) this.checkTurn()
        }

        playMoveHandler = event => {
            this.playMove(event.detail.sender, event.detail.value)
        }

        startTimer(){
            this.data.gameState.playClock.onMaxTime = setTimeout(
                ()=>{
                    this.view.gameView.gamePrompt.textContent = `Player ${this.data.gameState.turn + 1} took too long.`
                    this.checkTurn()
                }, this.data.gameState.playClock.maxTime * 1000
            )
            this.data.gameState.playClock.onSecond = setInterval(
                ()=>{
                    this.view.gameView.playClock.textContent = Number( this.view.gameView.playClock.textContent ) - 1
                }, 1000
            )
        }

        stopTimer(){
            clearTimeout( this.data.gameState.playClock.onMaxTime )
            clearInterval( this.data.gameState.playClock.onSecond ) 
        }


     
        
    }

    class Carousel {

        constructor( view ){

            this._data = {
                spriteIndex: 0,
                sprites: []
            }
            
            this.view = view           
        }

        get data(){
            return this._data
        }

        updateCharacter( sprites ){
            this.data.spriteIndex = 0
            this.data.sprites = sprites
            this.view.images.src = sprites[0]
        }
        
        enable(){
            this.view.prevBtn.addEventListener('click', this.previousBtnHandler)
            this.view.nextBtn.addEventListener('click', this.nextBtnHandler)

            this.view.prevBtn.classList.add('active') 
            this.view.nextBtn.classList.add('active') 
        }

        disable(){
            this.view.nextBtn.removeEventListener('click', this.nextBtnHandler)
            this.view.prevBtn.removeEventListener('click', this.previousBtnHandler)

            this.view.prevBtn.classList.remove('active') 
            this.view.nextBtn.classList.remove('active')
        }

        nextBtnHandler = event => {
            if( this.data.sprites.length ){
                if( this.data.spriteIndex < this.data.sprites.length - 1 ){
                    this.data.spriteIndex ++ 
                }else{
                    this.data.spriteIndex = 0
                }
                this.view.images.src =  this.data.sprites[this.data.spriteIndex]
            }
            
        }

        previousBtnHandler = event => {
            if( this.data.sprites.length ){
                if( this.data.spriteIndex > 0 ){
                    this.data.spriteIndex -- 
                }else{
                    this.data.spriteIndex = this.data.sprites.length - 1
                }
                this.view.images.src =  this.data.sprites[this.data.spriteIndex]
            }
        }
    }

    class CharacterSelectCPU {
        constructor( view, name ){
            this.view = view
            this.name = name
            this._carousel = new Carousel( view.carousel )
        }

        get carousel(){
            return this._carousel
        }

        //these are overriden by playable characters
        enable(){ }
        disable(){ }

        async updateCharacter( character ){
            this.carousel.updateCharacter( character )
        }
    }

    class CharacterSelectPlayer extends CharacterSelectCPU{
        constructor( view, name ){

            super( view, name )

            this.events = {
                random: new CustomEvent("random", {
                    bubbles: true,
                    detail: {
                        sender: this.name
                    }
                }),
                select: new CustomEvent("select", {
                    bubbles: true,
                    detail: {
                        sender: this.name,
                        value: null
                    }
                }),
            }
            
        }

        randomButtonClickHandler = ( event ) => {
            event.currentTarget.dispatchEvent( this.events.random )
        }

        selectChangeHandler = ( event ) => {
            if( event.currentTarget.value != ""){
                this.events.select.detail.value = event.currentTarget.value
                event.currentTarget.dispatchEvent( this.events.select )
            }
        }

        enable(){
            this.view.randomButton.addEventListener( 'click', this.randomButtonClickHandler )
            this.view.select.addEventListener( 'change', this.selectChangeHandler )
            this._carousel.enable()
        }

        disable(){
            this.view.randomButton.removeEventListener( 'click', this.randomButtonClickHandler )
            this.view.select.removeEventListener( 'change', this.selectChangeHandler )
            this._carousel.enable()
        }

       
    }

    class Player{
        constructor( player, view){

            this.view = view

            this.name = player.name
            this._character = player.characterName
            this.moves = player.moves
            this.sprite = player.sprite

            this._health = 100
            this.defend = 0
            this.currentMove = null

            this.isCPU = player.isCPU

            this.buttons = []

            this.events = {
                playMove: new CustomEvent("playMove", {
                    bubbles: true,
                    detail: {
                        sender: this.name,
                        value: this.currentMove
                    }
                }),
            }

            this.setupView()
        }
                
        get character(){
            return this._character
        }

        get health(){
            return this._health
        }
        set health( value ){
            this._health = value
        }

        disable(){
            this.view.moves.classList.remove('active')
        }

        enable(){
            this.view.moves.classList.add('active')
        }

        setupView(){
            this.view.character.textContent = this._character
            if(this.sprite){
                this.view.image.src = this.sprite
                this.view.image.alt = this._character
            }
        }
        
        takeHit( amount ){
            this._health -= amount
            if( this._health < 0){
                this.view.healthBar.style.width = "0"
            }else{
                this.view.healthBar.style.width = this._health + "%"
            }
            
        }

        playRandomMove(){
            return this.moves[ Math.floor( Math.random() * this.moves.length ) ]
        }

        enableMoves(){
            // console.log("this.moves",this.moves)
            for(let move of this.moves){
                const btn = document.createElement('button')
                btn.setAttribute('type', 'button')
                btn.dataset.move = move.name
                btn.textContent = move.name
                btn.addEventListener('click', this.moveClickHandler)
                // console.log("this.view", this.view)
                this.view.moves.append(btn)
            }
        }

        listMoves(){
            // console.log("this.moves",this.moves)
            for(let move of this.moves){
                const p = document.createElement('p')
                p.textContent = move.name
                this.view.moves.append(p)
            }
        }

        disableMoveButtons(){
            for(btn in this.buttons){
                btn.removeEventListener('click', moveClickHandler)
            }
        }

        moveClickHandler = event => {
            for(let move of this.moves){
                if(move.name === event.currentTarget.dataset.move)this.currentMove = move
            }
            this.events.playMove.detail.value = this.currentMove
            this.view.player.dispatchEvent( this.events.playMove )
        }
    }
    window.onload = () => {

        // data object that holds the current pokemon and functions for fetching pokemon
        window.pokedata = {           
            gameState: {
                currentView: "intro",
                vs: null,
                turn: -1,
                players: [
                    {
                        player: null,
                        character: null,
                        name: "Player1",
                        characterName: "",
                        isCPU: false,
                        charactersMoves: [],
                        sprite: null
                    },
                    {
                        player: null,
                        character: null,
                        name: "player2",
                        isCPU: false,
                        characterName: "",
                        charactersMoves: [],
                        sprite: null
                    },
                ],
                playClock: {
                    maxTime: "60",
                    onSecond: null,
                    onMaxTime: null
                }
            },
            allPokemon: [],
            allPokemonMoves: [],
            storedPokemon: [],
            storedPokemonMoves: [],
            cpuHasPlayedAs: [],
            gameResultsesult: "",
            baseUrl: "https://pokeapi.co/api/v2/",
            hasLocalStorage: false,
            
            async getAllPokemon(){

                if( this.hasLocalStorage ){
                    
                    let allCharacters = this.getLocalStorageItem('all_characters')

                    // console.log("allCharacters", allCharacters)
                   
                    if( !allCharacters ){
    
                        // console.log("does NOT have all characters, but create LS")
    
                        response = await this.getData( "generation/1/" )
    
                        if( response.sucess ){
                            for (let species of response.data.pokemon_species){
                                this.allPokemon.push ( species.name )
                            }
                            for (let move of response.data.moves){
                                this.allPokemonMoves.push( move )
                            }

                            // this.allPokemon.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )

                            this.allPokemon.sort()

                            this.setLocalStorage( "all_characters", this.allPokemon )
                            this.setLocalStorage( "all_moves", this.allPokemonMoves )
                            
                            this.setLocalStorage( "stored_pokemon", [] )
                            this.setLocalStorage( "cpu_used_characters", [] )
                            this.setLocalStorage( "stored_pokemon_moves", [] )
                        }

                    }else{

                        this.allPokemon = this.getLocalStorageItem('all_characters')
                        this.allPokemonMoves = this.getLocalStorageItem('all_moves')
                        this.storedPokemon = this.getLocalStorageItem('stored_pokemon')
                        this.storedPokemonMoves = this.getLocalStorageItem('stored_pokemon_moves') 
                        this.cpuHasPlayedAs = this.getLocalStorageItem('cpu_used_characters')

                        console.log('DOES have all characters')

                        return true
                    }
                }else{
                    // console.log('does NOT have all characters or LS')
                    response = await this.getData( "generation/1/" )
                    if(response.sucess){
                        for (let species of response.data.pokemon_species){
                            this.allPokemon.push( species.name )
                        }

                        // this.allPokemon = this.allPokemon.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )

                        this.allPokemon.sort()

                        for (let move of response.data.moves){
                            this.allPokemonMoves.push(move)
                        }
                    }
                }

                if(response.sucess){
                    return true
                }else{
                    return false
                }                
            },
            async setPokeData( data ){
                // console.log("setPokeData")
                const moves = []
                for (let i = 0; i < data.moves.length; i++) {
                    if(i < 4){
                        if( this.hasLocalStorage ){
                            // console.log("this.storedPokemonMoves: ",this.storedPokemonMoves)
                            if( !this.storedPokemonMoves.length ){
                                const mv = await this.getData( data.moves[i].move.url )
                                if( mv ){
                                    if( mv.data.accuracy > 0 && Math.round( mv.data.power * .25 ) > 0 ){
                                        const moveData = {
                                            name: data.moves[i].move.name,
                                            move: {
                                                accuracy: mv.data.accuracy,
                                                power: Math.round( mv.data.power * .25 )
                                            } 
                                        }
                                        moves.push( moveData )
                                        this.storedPokemonMoves.push( moveData )
                                        // console.log("no moves stored", this.storedPokemonMoves)
                                        this.setLocalStorage( 'stored_pokemon_moves', this.storedPokemonMoves )
                                    }
                                }
                            }else{
                                let isStored = false;
                                for (let move of this.storedPokemonMoves){
                                    if(move.name === data.moves[i].move.name){
                                        // console.log("MOVE IS STORED")
                                        moves.push( move )
                                        isStored = true
                                    }
                                }
                                if(!isStored){
                                    const mv = await this.getData( data.moves[i].move.url )
                                    if( mv ){
                                        if( mv.data.accuracy > 0 && Math.round( mv.data.power * .25 ) > 0 ){
                                            const moveData = {
                                                name: data.moves[i].move.name,
                                                move: {
                                                    accuracy: mv.data.accuracy,
                                                    power: Math.round( mv.data.power * .25 )
                                                } 
                                            }
                                            moves.push( moveData )
                                            this.storedPokemonMoves.push( moveData )
                                            // console.log("others move stored", this.storedPokemonMoves)
                                            this.setLocalStorage( 'stored_pokemon_moves', this.storedPokemonMoves )
                                        }
                                    }
                                }
                            }
                        }else{
                            const mv = await this.getData( data.moves[i].move.url )
                            if( mv ){
                                if( mv.data.accuracy > 0 && Math.round( mv.data.power * .25 ) > 0 ){
                                    const moveData = {
                                        name: data.moves[i].move.name,
                                        move: {
                                            accuracy: mv.data.accuracy,
                                            power: Math.round( mv.data.power * .25 )
                                        } 
                                    }
                                    moves.push( moveData )
                                }
                            }
                        }
                    }
                }

                 const sprites = []
                 for( let sprite in data.sprites) {
                     // check if !null & is a string & is a front-shot sprite of the character
                     if( data.sprites[ sprite ] && typeof sprite === 'string' && sprite.includes("front") ) {
                         sprites.push( data.sprites[ sprite ] )
                     }
                 }

                 return { name: data.name, moves: moves, sprites: sprites }
            },
            async getPokemon(pokemon){
                //fetch pokemon
                let response = null
                let obj = null
                if( this.hasLocalStorage ){

                    if( !this.storedPokemon.length ){
                        response = await this.getData( "pokemon/" + pokemon )
                        if( response.sucess ){
                            obj = this.setPokeData(response.data)

                            this.storedPokemon.push( obj )
                            // console.log("none stored", this.storedPokemon)
                            this.setLocalStorage( 'stored_pokemon', this.storedPokemon )
                        }
                    }else{                        
                        for (let character of this.storedPokemon){
                            if(character.name === pokemon){
                                // console.log("IS STORED")
                                this.currentPokemon = character
                                
                                return  this.currentPokemon
                            }
                        }
                        response = await this.getData( "pokemon/" + pokemon )
                        if( response.sucess ){
                            obj = this.setPokeData(response.data)

                            this.storedPokemon.push( obj )
                            // console.log("others stored")
                            this.setLocalStorage( 'stored_pokemon', this.storedPokemon )
                        }
                    }
                }else{
                    // console.log("no ls",response.data)
                    response = await this.getData( "pokemon/" + pokemon )
                    if( response.sucess ){
                        obj = this.setPokeData(response.data)
                    }
                }
                if( response.sucess ){
                    this.currentPokemon = obj
                    return this.currentPokemon
                }else{
                    return false
                }
            },
            checkTurn(){
                 this.gameState.turn = this.gameState.turn > 0 || this.gameState.turn < 0 ? 0 : 1
                 return this.gameState.turn
            },
            formatPokemonName(pokemon){
                return pokemon.replaceAll( " ", "-" )
            },
            reformatPokemonName(pokemon){
                pokemon = pokemon.replaceAll( "-", " " )
                const name = this.toTitleCase( pokemon )
                return name
            },
            getRandomPokemon(){
                return this.allPokemon [ Math.floor( Math.random() * this.allPokemon.length ) ]
            },
            getData(query){ 
                let url = !query.includes('http') ? encodeURI( this.baseUrl + query ) : encodeURI( query )
                let r = fetch(url).then(
                    response => response.json()
                ).then( 
                    json => {
                        return { sucess: true, data: json }
                    },
                    error => {
                        return { sucess: false, error: error }
                    }
                )
                return r
            },
             //https://www.w3docs.com/snippets/javascript/how-to-convert-string-to-title-case-with-javascript.html
             toTitleCase(str) {
                return str.toLowerCase().split(' ').map(function (word) {
                  return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');
            },
            //https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
            storageAvailable () {
                let storage;
                try {
                    storage = window['localStorage'];
                    const x = '__storage_test__';
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    return true;
                }
                catch (e) {
                    return e instanceof DOMException && (
                        // everything except Firefox
                        e.code === 22 ||
                        // Firefox
                        e.code === 1014 ||
                        // test name field too, because code might not be present
                        // everything except Firefox
                        e.name === 'QuotaExceededError' ||
                        // Firefox
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ) &&
                        // acknowledge QuotaExceededError only if there's something already stored
                        (storage && storage.length !== 0);
                }
            },
            checkStorage(){
                // console.log("checkStorage")
                if( this.storageAvailable() ){ 
                   this.hasLocalStorage = true
                }
            },
            getLocalStorageItem(item){
            //    console.log( "item",JSON.parse( localStorage.getItem( `__ils_poke_battle__${item}` ) ),  `__ils_poke_battle__${item}` )
               return JSON.parse( localStorage.getItem( `__ils_poke_battle__${item}` ) )
            },
            setLocalStorage(item, value){
                localStorage.setItem(`__ils_poke_battle__${item}`, JSON.stringify( value ) )
            }
            
        }

        // view object for storing dom elements
        const views = {
            main: document.querySelector('.main-view'),
            intro:{
                view: document.querySelector('.intro-view'),
                vsCPUBtn: document.querySelector('#cpu'),
                vsPlayerBtn: document.querySelector('#player2'),
                gameInstructionsBtn: document.querySelector('#gameInstructionsBtn'),
                gameIntructionsModal: {
                    view: document.querySelector('.game-instructions-modal'),
                    closeBtn: document.querySelector('.game-instructions-modal').querySelector('.pkebtl-close-btn'),
                }
            },
            characterSelect:{
                view: document.querySelector('.character-select-view'),
                startBtn: document.querySelector('.character-select-view').querySelector('#start-btn'),
                player1:{
                    player: document.querySelector('.character-select-view').querySelector('.player-1'),
                    select: document.querySelector('.character-select-view').querySelector('.player-1').querySelector('.pokemon-select'),
                    randomButton: document.querySelector('.character-select-view').querySelector('.player-1').querySelector('.random-pokemon-button'),
                    carousel: {
                        prevBtn: document.querySelector('.character-select-view').querySelector('.player-1').querySelector('#prev-btn'),
                        nextBtn: document.querySelector('.character-select-view').querySelector('.player-1').querySelector('#next-btn'),
                        images:  document.querySelector('.character-select-view').querySelector('.player-1').querySelector('.images img'),
                    },
                    stats: {
                        name: document.querySelector('.character-select-view').querySelector('.player-1').querySelector('.name'),
                    },
                },
                player2:{
                    player: document.querySelector('.character-select-view').querySelector('.player-2'),
                    select: document.querySelector('.character-select-view').querySelector('.player-2').querySelector('.pokemon-select'),
                    randomButton: document.querySelector('.character-select-view').querySelector('.player-2').querySelector('.random-pokemon-button'),
                    carousel: {
                        prevBtn: document.querySelector('.character-select-view').querySelector('.player-2').querySelector('#prev-btn'),
                        nextBtn: document.querySelector('.character-select-view').querySelector('.player-2').querySelector('#next-btn'),
                        images:  document.querySelector('.character-select-view').querySelector('.player-2').querySelector('.images img'),
                    },
                    stats: {
                        name: document.querySelector('.character-select-view').querySelector('.player-2').querySelector('.name'),
                    },
                },
                cpu:{
                    player: document.querySelector('.character-select-view').querySelector('.cpu'),
                    carousel: {
                        prevBtn: document.querySelector('.character-select-view').querySelector('.cpu').querySelector('#prev-btn'),
                        nextBtn: document.querySelector('.character-select-view').querySelector('.cpu').querySelector('#next-btn'),
                        images:  document.querySelector('.character-select-view').querySelector('.cpu').querySelector('.images img'),
                    },
                    stats: {
                        name: document.querySelector('.character-select-view').querySelector('.cpu').querySelector('.name'),
                    },
                }
            },
            gameView:{
                view: document.querySelector('.game-view'),
                player1:{
                    player: document.querySelector('.game-view').querySelector('.player-1'),
                    character: document.querySelector('.game-view').querySelector('.player-1').querySelector('h4'),
                    image: document.querySelector('.game-view').querySelector('.player-1').querySelector('img'),
                    healthBar: document.querySelector('.game-view').querySelector('.player-1').querySelector('.health-bar'),
                    moves: document.querySelector('.game-view').querySelector('.player-1').querySelector('.moves')
                },
                player2:{
                    player: document.querySelector('.game-view').querySelector('.player-2'),
                    character: document.querySelector('.game-view').querySelector('.player-2').querySelector('h4'),
                    image: document.querySelector('.game-view').querySelector('.player-2').querySelector('img'),
                    healthBar: document.querySelector('.game-view').querySelector('.player-2').querySelector('.health-bar'),
                    moves: document.querySelector('.game-view').querySelector('.player-2').querySelector('.moves')
                },
                playClock: document.querySelector('.game-view').querySelector('.play-clock').querySelector('p'),
                playerTurn: document.querySelector('.game-view').querySelector('.player-turn'),
                gamePrompt: document.querySelector('.game-view').querySelector('.game-prompt').querySelector('p'),
            },
            resultsView: {
                view: document.querySelector('.results-view'),
                prompt: document.querySelector('.results-view').querySelector('p')
            },
            updateView(oldView, newView, hidePrevious){
                if( hidePrevious )oldView.classList.remove('active')
                newView.classList.add('active')
            }
        }

        const poke = new PokeBattle( window.pokedata, views, {} )

    }