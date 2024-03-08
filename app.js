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

                this.data.gameState.players[ indx ].character = name
                this.data.gameState.players[ indx ].moves = pokemonRequest.moves

                if( pokemonRequest.sprites.length){
                
                    this.data.gameState.players[ indx ].player.carousel.updateCharacter(pokemonRequest.sprites)
                    // this.view.characterSelect[ player ].carousel.images.src = this.data.gameState.players[ indx ].player.carousel.data.sprites[0]
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
        updateView( newView ){
            console.log( "updateView", newView )
            switch(newView){
                case "intro":
                    this.enableIntro()
                    //this.disableCharacterSelect.results()
                    break;
                case "characterSelect":   
                    this.disableIntro()
                    this.createCharacterSelect()
                    // this.setUpCharacterSelect()
                    break;
                case "gameView":   
                    this.disableCharacterSelect()
                    this.setCharacterImages()
                    this.createGameView()
                    // this.setUpCharacterSelect()
                    break;
            }
            this.view.updateView( this.view[ this.data.gameState.currentView ].view, this.view[ newView ].view )
            this.data.gameState.currentView = newView

            // console.log("newView", this.view[ this.data.gameState.currentView ].view, this.view[ newView ].view)
        }

        setUpCPU(){
            const name = this.data.getRandomPokemon()
            this.setPokemon( name, "cpu" )
            this.checkSetPlayers()
        }


        setUpPlayers(){
           
        }
        
        /////////////////////////////////////////////////
        //
        //  Intro
        //
        /////////////////////////////////////////////////

        enableIntro(){
            this.view.intro.vsCPUBtn.addEventListener('click', this.vsBtnClickHandler)
            this.view.intro.vsPlayerBtn.addEventListener('click', this.vsBtnClickHandler)
        }
        disableIntro(){
            this.view.intro.vsCPUBtn.removeEventListener('click', this.vsBtnClickHandler)
            this.view.intro.vsPlayerBtn.removeEventListener('click', this.vsBtnClickHandler)
        }
        vsBtnClickHandler = event => {
            if(event.currentTarget.getAttribute('id') === "cpu")
           this.data.gameState.players[1].isCPU = true
           this.updateView(  "characterSelect"  )
        }

        /////////////////////////////////////////////////
        //
        //  Character Select
        //
        /////////////////////////////////////////////////

        checkSetPlayers(){
            if( this.data.gameState.players[0].character && this.data.gameState.players[1].character ){ 
                this.enableStartBtn()
            }
        }
        setAllCharacters(player){
            
            for(let pokemon of this.data.allPokemon){

                let option = document.createElement( 'option' )
                option.value = pokemon
                option.textContent = pokemon.replaceAll( "-", " " )

                this.view.characterSelect[ player ].select.append( option )
            }         
        }

        setCharacterImages(){
            this.data.gameState.players.forEach( (player, i) => {
                if(player.player.carousel.data.sprites.length){
                    this.data.gameState.players[i].sprite = player.player.carousel.data.sprites[ player.player.carousel.data.spriteIndex ]
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
 
            this.data.gameState.players[0].player.enable()
        }

        disableCharacterSelectP1(){
            this.view.characterSelect.player1.player.removeEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player1.player.removeEventListener('select', this.characterSelectHandler)
 
            this.data.gameState.players[0].player.disable()
        }

        enableCharacterSelectP2(){
            this.view.characterSelect.player2.player.addEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player2.player.addEventListener('select', this.characterSelectHandler)

            this.data.gameState.players[1].player.enable()
        }

        disableCharacterSelectP2(){
            this.view.characterSelect.player2.player.removeEventListener('random', this.characterRandomBtnHandler)
            this.view.characterSelect.player2.player.removeEventListener('select', this.characterSelectHandler)

            this.data.gameState.players[1].player.disable()
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
            this.data.gameState.players[0].player = player1;
            this.setAllCharacters( "player1" )
            this.enableCharacterSelectP1()

            let player2 = null
            if( !this.data.gameState.players[1].isCPU){
                this.view.updateView( this.view.characterSelect.cpu.player, this.view.characterSelect.player2.player )
                player2 = new CharacterSelectPlayer( this.view.characterSelect.player2,  "player2")
                this.data.gameState.players[1].player = player2;
                this.setAllCharacters("player2")
                this.enableCharacterSelectP2()
            }else{
                this.view.updateView( this.view.characterSelect.player2.player, this.view.characterSelect.cpu.player )
                player2 = new CharacterSelectCPU( this.view.characterSelect.cpu, "cpu" )
                this.data.gameState.players[1].player = player2;
                this.setUpCPU()
            }
        }   
        
        
        /////////////////////////////////////////////////
        //
        //  Game View
        //
        /////////////////////////////////////////////////

        createGameView(){

            for(let playerData of this.data.gameState.players) {
                console.log( "playerData", playerData.name )
                console.log( "gameView",playerData.isCPU)
                const player = new Player(playerData, this.view.gameView[ playerData.name.toLowerCase() ])
                // if( player.sprite ){
                //     this.view.gameView[ player.name ].character = player.sprite
                //     this.view.gameView[ player.name ].images = player.sprite 
                //     // this.data.gameState.players[i].sprite = player.player.carousel.data.sprites[ player.player.carousel.data.spriteIndex ]
                // }
            }

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
            // this.carousel.enable()
        }

        get carousel(){
            return this._carousel
        }

        enable(){

        }

        disable(){

        }

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
            // console.log("randomButtonClickHandler", event.currentTarget )
            event.currentTarget.dispatchEvent( this.events.random )
        }

        selectChangeHandler = ( event ) => {
            if( event.currentTarget.value != ""){
                this.events.select.detail.value = event.currentTarget.value
                event.currentTarget.dispatchEvent( this.events.select )
            }
            // if( event.currentTarget.value != "")this.setPokemon( event.currentTarget.value )
        }

        enable(){
          //  console.log( "randomButtonClickHandler", this.randomButtonClickHandler )
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
            this._character = player.character
            this.moves = player.moves
            this.sprite = player.sprite

            this._health = 100
            this.defend = 0
            this.currentMove = []

            this.buttons = []

            this.events = {
                playMove: new CustomEvent("playMove", {
                    bubbles: true,
                    detail: {
                        sender: this.currentMove
                    }
                }),
            }

            this.setupView()
            this.enableMoves()
        }
       
        attack(){
            // console.log( this.moves[ Math.floor( Math.random() * this.moves.length ) ] )
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

        setupView(){
            this.view.character.textContent = this._character
            if(this.sprite){
                this.view.image.src = this.sprite
                this.view.image.alt = this._character
            }
        }
        
        hideMoveList(){
            this.view.moveList.classList.remove('active')
        }

        showMoveList(){
            this.view.moveList.classList.add('active')
        }

        enableMoves(){
            // console.log("this.moves",this.moves)
            for(let move of this.moves){
                const btn = document.createElement('button')
                btn.setAttribute('type', 'button')
                btn.dataset.move = move.url
                btn.textContent = move.name
                btn.addEventListener('click', this.moveClickHandler)
                // console.log("this.view", this.view)
                this.view.moves.append(btn)
            }
        }

        disableMoves(){
            for(btn in this.buttons){
                btn.removeEventListener('click', moveClickHandler)
            }
        }

        moveClickHandler = event => {
            this.currentMove = event.currentTarget.dataset.move
            console.log( this.currentMove )
            // this.view
        }

        battle(enemy){
    
            // let currentMove = Object.keys(this._moves)[0]
    
            // console.log( this._moves[ currentMove ] )
    
            // enemy.health -= this._moves.currentMove
    
            // console.log( `${enemy.name} got hit by ${currentMove}! His health is now at ${enemy.health}` )
        }
    }
    window.onload = () => {

        // data object that holds the current pokemon and functions for fetching pokemon
        window.pokedata = {
            // currentPokemon: "",
            // currentPokemonSprites: [],
            // currentPokemonSpriteIndex: 0,

           
            gameState: {
                currentView: "intro",
                vs: null,
                turn: 0,
                players: [
                    {
                        player: null,
                        name: "Player1",
                        character: "",
                        isCPU: false,
                        charactersMoves: [],
                        sprite: null
                    },
                    {
                        player: null,
                        name: "player2",
                        isCPU: false,
                        character: "",
                        charactersMoves: [],
                        sprite: null
                    },
                ],
                playClock: "60",
            },
            allPokemon: [],
            allPokemonMoves: [],
            storedPokemon: [],
            cpuHasPlayedAs: [],
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
                                this.allPokemon.push (species.name )
                            }
                            for (let move of response.data.moves){
                                this.allPokemonMoves.push( move )
                            }

                            this.allPokemon.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )

                            this.setLocalStorage( "all_characters", this.allPokemon )
                            this.setLocalStorage( "all_moves", this.allPokemonMoves )
                            
                            this.setLocalStorage( "stored_pokemon", [] )
                            this.setLocalStorage( "cpu_used_characters", [] )
                        }

                    }else{
                        // console.log('DOES have all characters', allCharacters)

                        this.allPokemon = this.getLocalStorageItem('all_characters')
                        this.allPokemonMoves = this.getLocalStorageItem('all_moves')
                        this.storedPokemon = this.getLocalStorageItem('stored_pokemon')
                        this.cpuHasPlayedAs = this.getLocalStorageItem('cpu_used_characters')

                        return true
                    }
                }else{
                    // console.log('does NOT have all characters or LS')
                    response = await this.getData( "generation/1/" )
                    if(response.sucess){
                        for (let species of response.data.pokemon_species){
                            this.allPokemon.push(species.name)
                        }

                        this.data.allPokemon.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )

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
            async getPokemon(pokemon){
                //fetch pokemon
                let response = null
                let obj = null
                if( this.hasLocalStorage ){
                    
                    console.log("this.stroredCharacters", typeof this.storedPokemon)
                    if( !this.storedPokemon.length ){
                        response = await this.getData( "pokemon/" + pokemon )
                        if( response.sucess ){

                            //need to dry this up
                            const moves = []
                            response.data.moves.forEach( ( move, i ) => {
                                if(i < 4) moves.push( move.move )
                            })
                            // console.log("response.data.sprites",response.data.sprites)
                            const sprites = []
                            for( let sprite in response.data.sprites) {
                                // check if !null & is a string & is a front-shot sprite of the character
                               if( response.data.sprites[sprite] && typeof sprite === 'string' && sprite.includes("front") ) {
                                sprites.push( response.data.sprites[ sprite ] )
                               }
                            }           
                            obj = { name: response.data.name, moves: moves, sprites: sprites }     
                            this.storedPokemon.push( obj )
                            console.log("none stored", this.storedPokemon)
                            this.setLocalStorage( 'stored_pokemon' )
                        }
                    }else{
                        
                        for (let character of this.storedPokemon){
                            if(character.name === pokemon){
                                console.log("IS STORED")
                                this.currentPokemon = character
                                
                                return  this.currentPokemon
                            }
                        }
                        response = await this.getData( "pokemon/" + pokemon )
                        if( response.sucess ){
                            const moves = []
                            response.data.moves.forEach( ( move, i ) => {
                               if(i < 4) moves.push( move.move )
                            })

                            const sprites = []
                            for( let sprite in response.data.sprites) {
                                // check if !null & is a string & is a front-shot sprite of the character
                                if(  response.data.sprites[sprite] && typeof sprite === 'string' && sprite.includes("front") ) {
                                    sprites.push( response.data.sprites[ sprite ] )
                                }
                            }

                            obj = { name: response.data.name, moves: moves, sprites: sprites }

                            this.storedPokemon.push( obj )
                            console.log("not stored")
                            this.setLocalStorage( 'stored_pokemon', this.storedPokemon )
                        }
                    }
                }else{
                    console.log("no nope",response.data)
                    response = await this.getData( "pokemon/" + pokemon )
                    if( response.sucess ){
                        const moves = []
                        response.data.moves.forEach( ( move, i ) => {
                           if(i < 4) moves.push( move.move )
                        })

                        const sprites = []
                        for( let sprite in response.data.sprites) {
                            // check if !null & is a string & is a front-shot sprite of the character
                            if( response.data.sprites[ sprite ] && typeof sprite === 'string' && sprite.includes("front") ) {
                                sprites.push( response.data.sprites[ sprite ] )
                            }
                        }

                        obj = { name: response.data.name, moves: moves, sprites: sprites }
                    }
                }
                // const response = await this.getData( "pokemon/" + pokemon )
                if( response.sucess ){
                    // this.currentPokemon = response.data
                    this.currentPokemon = obj
                    return this.currentPokemon
                }else{
                    return false
                }
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
                const url = encodeURI( this.baseUrl + query )
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
                playClock: document.querySelector('.game-view').querySelector('.game-clock')
            },
            updatePrompt: ( text ) => {
                // console.log("updatePrompt:",text,  views.textPrompt)
                // views.textPrompt.textContent = text
            },
            updateView(oldView, newView){
                oldView.classList.remove('active')
                newView.classList.add('active')
            }
        }

        const poke = new PokeBattle( window.pokedata, views, {} )

    }