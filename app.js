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
                this.createCharacterSelect()
                this.setFinderText()
                this.enableButtons()
                this.setAllPokemon()
                this.enableCarousel()
            }else{
                console.log("no pokemon")
            }
        }
       
        setFinderText(){
            // this.view.characterSelect.randomButton.innerText = this.text.randomButton
            // this.view.characterSelect.updateText( this.text.intro, this.view.characterSelect.prompt )
            // this.view.characterSelect.updateText( this.text.select, this.view.characterSelect.select )
        }
        
        setAllPokemon(){

            this.data.allPokemon.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )
            
            // for(let pokemon of this.data.allPokemon){

            //     let option = document.createElement( 'option' )
            //     option.value = pokemon.name
            //     option.textContent = pokemon.name.replaceAll( "-", " " )

            //     this.view.characterSelect.select.append( option )
            // }
         

        }
       
        async setPokemon( pokemon, player ){ 
            let pokemonRequest = await this.data.getPokemon( pokemon )
            if( pokemonRequest ){

                const name = this.data.reformatPokemonName( pokemon )
                player.stats.name.textContent = name

                for(let sprite in data.sprites){
                    const s = data.sprites[sprite]
                    if( s && typeof s === 'string' )this.data.currentPokemonSprites.push( data.sprites[sprite] )
                }

                if(this.data.currentPokemonSprites.length){
                    this.view.characterSelect.carousel.images.src = this.data.currentPokemonSprites[0]
                }
                this.view.characterSelect.carousel.images.alt = name
                this.view.characterSelect.carousel.prevBtn.style.opacity = 1
                this.view.characterSelect.carousel.nextBtn.style.opacity = 1

                // data.abilities.forEach( (ability, i ) => {
                //     let a = document.createElement('li')
                //     const affix = i < data.abilities.length - 1 ? ", " : "" 
                //     a.textContent = ability.ability.name + affix
                //     this.view.characterSelect.stats.abilities.append(a)
                // })

                // data.moves.forEach( (move, i ) => {
                //     let m = document.createElement('li')
                //     const affix = i < data.moves.length - 1 ? ", " : "" 
                //     m.textContent = move.move.name + affix
                //     this.view.characterSelect.stats.moves.append(m)
                // })
                // this.view.characterSelect.abilities. = pokemon.replaceAll("-"," ")
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

        createCharacterSelect(){
            for(let playerView in this.view.characterSelect){
                if( playerView != "view" ){
                    let player  = null
                    if(playerView != "cpu"){
                        player = new CharacterSelectPlayer( this.view.characterSelect[ playerView ] )
                        player.enable()
                    }else{
                        player = new CharacterSelectCPU( this.view.characterSelect[ playerView ] )
                    }
                    this.data.views.characterSelect.players.push( player )
                }
            }
        }        
    }

    class Carousel {

        constructor( view ){

            this.data = {
                spriteIndex: 0,
                sprites: []
            }
            
            this.view = view           
        }

        updateCharacter( sprites ){
            this.data.spriteIndex = 0
            this.data.sprites = sprites
        }
        
        enable(){
            this.view.nextBtn.addEventListener('click', nextBtnHandler)
            this.view.prevBtn.addEventListener('click', previousBtnHandler)
        }

        disable(){
            this.view.nextBtn.removeEventListener('click', nextBtnHandler)
            this.view.prevBtn.removeEventListener('click', previousBtnHandler)
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
        constructor( view ){
            this.view = view
            this.carousel = new Carousel( view.carousel )
           // carousel.updateCharacter(  )
            //carousel.enable() 

        }

        enable(){

        }

        async updateCharacter( character ){
            // this.carousel.updateCharacter( character )
        }
    }

    class CharacterSelectPlayer extends CharacterSelectCPU{
        constructor( view ){
            // console.log( "view", view )

            super( view )

            
        }

        randomButtonClickHandler = ( event ) => {
            console.log("randomButtonClickHandler")
            // const name = this.data.getRandomPokemon().name
            // this.setPokemon( name )
        }

        selectChangeHandler = ( event ) => {
            if( event.currentTarget.value != "")console.log("selectChangeHandler")
            // if( event.currentTarget.value != "")this.setPokemon( event.currentTarget.value )
        }

        enable(){
            console.log( "randomButtonClickHandler", this.randomButtonClickHandler )
            this.view.randomButton.addEventListener( 'click', this.randomButtonClickHandler )
            this.view.select.addEventListener( 'change', this.selectChangeHandler )
        }

        disable(){
            this.view.randomButton.removeEventListener( 'click', this.randomButtonClickHandler )
            this.view.select.removeEventListener( 'change', this.selectChangeHandler )
        }

       
    }

    window.onload = () => {

        // data object that holds the current pokemon and functions for fetching pokemon
        window.pokedata = {
            // currentPokemon: "",
            // currentPokemonSprites: [],
            // currentPokemonSpriteIndex: 0,

            views: {
                characterSelect: {
                    players: []
                }
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
                            this.setLocalStorage( "all_characters", response.data.pokemon_species)
                            this.setLocalStorage( "all_moves", response.data.moves)
                            
                            this.setLocalStorage( "stored_pokemon", JSON.stringify([]) )
                            this.setLocalStorage( "cpu_used_characters", JSON.stringify([]) )
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
                }

                if(response.sucess){
                    this.allPokemon = response.data.pokemon_species
                    // console.log(response.data.pokemon_species)
                    this.allPokemonMoves = response.data.moves
                    return true
                }else{
                    return false
                }                
            },
            async getPokemon(pokemon){
                //fetch pokemon
                if( this.data.hasLocalStorage ){
                    const stroredCharacters = this.data.getLocalStorageItem('stored_pokemon')
                    let response = null
                    if( !stroredCharacters.length ){
                        response = await this.getData( "pokemon/" + pokemon )
                        if( response.sucess ){
                            this.storedPokemon.push( response.data )
                            this.data.setLocalStorageItem('stored_pokemon',response.data )
                        }
                    }else{
                        for (let character in this.storedPokemon){
                            if(character.name === pokemon){

                                this.currentPokemon = character
                                
                                return  this.currentPokemon
                            }
                        }
                    }
                }else{
                    response = await this.getData( "pokemon/" + pokemon )
                }
                // const response = await this.getData( "pokemon/" + pokemon )
                if( response.sucess ){
                    this.currentPokemon = response.data
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
                vsCPUBtn: document.querySelector('#vsCPUBtn'),
                vsPlayerBtn: document.querySelector('#vsPlayerBtn'),
                gameInstructionsBtn: document.querySelector('#gameInstructionsBtn'),
                gameIntructionsModal: {
                    view: document.querySelector('.game-instructions-modal'),
                    closeBtn: document.querySelector('.game-instructions-modal').querySelector('.pkebtl-close-btn'),
                }
            },
            characterSelect:{
                view: document.querySelector('.character-select-view'),
                player1:{
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
            updatePrompt: ( text ) => {
                // console.log("updatePrompt:",text,  views.textPrompt)
                // views.textPrompt.textContent = text
            },
             //https://www.w3docs.com/snippets/javascript/how-to-convert-string-to-title-case-with-javascript.html
             toTitleCase(str) {
                return str.toLowerCase().split(' ').map(function (word) {
                  return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');
            }
        }

        const poke = new PokeBattle( window.pokedata, views, {} )

    }