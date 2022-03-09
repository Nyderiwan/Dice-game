<template>

	<div id="loading" v-if="state===0">
		Chargement...
	</div>

	<header id="header_game">
		<h1>Ship, <span>Captain</span> and Crew</h1>
	</header>

	<div id="lobby" v-if="state === 1">
		<div class="new_player_form">
			<h3>Ajouter un joueur</h3>
			<input type="text" v-model="newPlayer" @keyup.enter="addPlayer" placeholder="Entrez un pseudo" maxlength="20">
			<button @click="addPlayer">Valider</button>
		</div>
		<div class="players_list">
			<div v-for="player in players">{{player.name}}</div>
		</div>
		<button @click="startGame" class="primary start_game_btn">Lancer la partie</button>
		<button @click="startGameTest" class="primary start_game_btn">Start BETA game</button>
	</div>

	<div id="game" v-if="state === 2">
		<header>
			<div class="title_pseudo">Au tour de <span>{{players[currentPlayer].name }}</span> de jouer</div>

			<div>
				<div class="ship">
					<span v-show="round.ship">⚡</span>
				</div>
				<div class="captain">
					<span v-show="round.captain">⚡</span>
				</div>
				<div class="crew">
					<span v-show="round.crew">⚡</span>
				</div>
				<div class="score">
					<span>{{ round.score }}</span>
				</div>
			</div>
		</header>

		<div class="game_inner">
			<div class="dices_warp">
				<transition-group name="dice" tag="div">
				<div>
					<div
						v-for="(dice, index) in dices"
						class="dice"
						:key="step+'_'+dice.value"
						:ref="'dice_'+index">
							<component :is="'Face'+dice"></component>
					</div>
				</div>
				</transition-group>
			</div>

			<button v-show="step < 3" @click="throwDices" class="btn_throw_dices primary">{{ jetBtnLabel }}</button>
			<button v-show="step === 3 || round.score > 0" @click="nextRound" class="btn_end_round primary">Finir le tour</button>
		</div>
	</div>

	<div id="end" v-if="state === 3">
		<h2>Scores</h2>
		<div class="scoreboard">
			<div v-for="(item, index) in scoreboardPlayers" :class="'p_'+index">
				<div class="name">{{ item.name }}</div>
				<div class="score">{{ item.score }}</div>
			</div>
		</div>
		<button @click="newGame" class="reset_btn primary">Refaire un tour</button>
	</div>

</template>

<script>
	/*
		<transition name="fade">

		rolling paper animation
		- https://www.youtube.com/watch?v=hcV7AcNuXjM

		STATE
		-
		0 - Loading...
		1 - Lobby
		2 - Game
		3 - End Score

	*/

	import _ from 'lodash'

	// Dice Faces
	import Face1 from '../assets/dice/face_1.svg'
	import Face2 from '../assets/dice/face_2.svg'
	import Face3 from '../assets/dice/face_3.svg'
	import Face4 from '../assets/dice/face_4.svg'
	import Face5 from '../assets/dice/face_5.svg'
	import Face6 from '../assets/dice/face_6.svg'

	export default {
		data() {
			return {
				newPlayer: '',
				state: 0,
				players: [],
				currentPlayer: null,
				dices : [],
				step: 0,
				round: {
					ship: false,
					captain: false,
					crew: false,
					score: 0
				}
			}
		},
		computed: {
			jetBtnLabel(){
				switch (this.step) {
					case 0:
						return 'Premier lancé'
						break;
					case 1:
						return 'Deuxième lancé'
						break;
					case 2:
						return 'Dernier lancé'
						break;
					case 3:
						return 'Error'
						break;
				}
			},
			scoreboardPlayers(){
				return _.orderBy(this.players, 'score', 'desc');
			},
			isEveryoneLooser(){
				for(let player of this.players) {
					if(player.score > 0) return false
				}
				return true
			}
		},
		methods: {
			startGameTest(){
				this.players = [
					{
						name: 'Alpha',
						score: 0
					},
					{
						name: 'Bravo',
						score: 0
					},
				]
				this.startGame()
			},
			addPlayer(){
				let tmpPseudo = this.newPlayer.trim()
				if(tmpPseudo.length < 4) return false
				this.players.push({
					name: tmpPseudo,
					score: 0
				})
				this.newPlayer = ''
			},
			startGame(){
				this.currentPlayer = 0
				this.players = this.shuffle(this.players)

				this.startRound()
				this.state = 2
			},
			startRound(){
				// reset
				this.round.ship = false
				this.round.captain = false
				this.round.crew = false
				this.round.score = 0
				//
				this.dices = []
				this.step = 0
			},
			throwDices(){
				this.dices = []
				let dicesQty = 5
				if(this.round.ship) dicesQty--
				if(this.round.captain) dicesQty--
				if(this.round.crew) dicesQty--

				// Wait ----
				// Generate Dice Value
				for (var i = 0; i < dicesQty; i++) {
					this.dices.push(Math.floor(Math.random()*6)+1)
				}

				// wait 2s ----
				// Test Dices
				this.testDices()

				this.step++
			},
			testDices(){
				// Ship
				if(this.dices.includes(6) && !this.round.ship){
					this.round.ship = true
					// this.dices = this.dices.filter((d) => d !== 6)
				}

				// Captain
				if(this.dices.includes(5) && this.round.ship && !this.round.captain){
					this.round.captain = true
					// this.dices = this.dices.filter((d) => d !== 5)
				}

				// Crew
				if(this.dices.includes(4) && this.round.ship && this.round.captain && !this.round.crew){
					this.round.crew = true
					// this.dices = this.dices.filter((d) => d !== 4)
				}

				// Cargo
				this.round.score = this.calculScore()
			},
			calculScore(){
				if(this.round.ship && this.round.captain && this.round.crew){
					let tmpDices = [...this.dices]

					if(this.dices.length > 2){
						let idxCrew = tmpDices.indexOf(4);
						tmpDices.splice(idxCrew, 1);

						if(this.dices.length > 3){
							let idxCapt = tmpDices.indexOf(5);
							tmpDices.splice(idxCapt, 1);

							if(this.dices.length > 4){
								let idxShip = tmpDices.indexOf(6);
								tmpDices.splice(idxShip, 1);
							}
						}
					}
					return tmpDices.reduce((x, a) => x + a, 0);
				}else{
					return 0
				}
			},
			nextRound(){
				// Entry Score
				this.players[this.currentPlayer].score = this.round.score

				// Next Player
				this.currentPlayer++

				// Test if everyone played & not everyone has 0
				if( this.currentPlayer >= this.players.length ){
					if( this.isEveryoneLooser ){
						this.currentPlayer = 0
					}else{
						return this.state = 3
					}
				}
				this.startRound()
			},
			newGame(){
				let tmpArray = [...this.players]
				this.players = []
				this.currentPlayer = 0

				for (var i = 0; i < this.players.length; i++) {
					let y = i + 1
					if(i === (this.players.length-1)) y = 0

					console.log('>', tmpArray[i])

					this.players[y] = {
						name: tmpArray[i].name,
						score: 0
					}
				}

				this.startRound()
				this.state = 2
			},
			shuffle(a){
				for (let i = a.length - 1; i > 0; i--){
					const j = Math.floor(Math.random() * (i + 1));
					[a[i], a[j]] = [a[j], a[i]];
				}
				return a;
			}
		},
		mounted(){
			/*
			console.log('Hello you, welcome on Ship, Captain and Crew !')
			document.title = 'Ship, Captain and Crew 🌴';

			const favicon = document.getElementById("favicon");
			let newFavicon = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚓</text></svg>"
			favicon.href = newFavicon;
			*/
			this.state = 1
		},
		components: {
			Face1, Face2, Face3, Face4, Face5, Face6
		}
	}
</script>

<style lang="less">
	@import "../assets/less/SCC.less";
</style>