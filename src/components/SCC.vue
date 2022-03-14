<template>
	<div id="app-scc">

		<transition name="fade">
			<div id="loading" v-if="loading">
				<div class="looping-rhombuses-spinner">
					<div class="rhombus"></div>
					<div class="rhombus"></div>
					<div class="rhombus"></div>
				</div>
			</div>
		</transition>

		<header id="header">
			<h1>Ship, Captain and Crew</h1>
		</header>

		<div class="inner_app">

			<transition name="fade">
			<div id="lobby" v-if="state === 1">
				<div class="new_player_form">
					<h3>Ajouter un joueur</h3>
					<input type="text" v-model="newPlayer" @keyup.enter="addPlayer" placeholder="Entrez un pseudo" maxlength="20">
					<button @click="addPlayer" class="out">Valider</button>
				</div>
				<div class="players_list">
					<div v-for="player in players">{{player.name}}</div>
				</div>

				<button @click="startGame" class="start_game_btn"><svgAnchor/>Lancer la partie</button>
			</div></transition>

			<transition name="fade">
			<div id="game" v-if="state === 2">

				<header>
					<div class="round_name">
						<span>{{players[currentPlayer].name }}</span>
					</div>

					<div class="validates_icons">
						<div class="ship" :class="{'on': round.ship}">
							<svgShip/>
						</div>
						<div class="captain" :class="{'on': round.captain}">
							<svgCaptain/>
						</div>
						<div class="crew" :class="{'on': round.crew}">
							<svgCrew/>
						</div>
						<div class="score">
							<span>{{ round.score }}</span>
						</div>
					</div>
				</header>

				<div class="dices_warp">
					<transition-group name="dice" tag="div">
						<div
							v-for="(dice, index) in dices"
							class="dice"
							:key="step+'_'+dice"
							:ref="'dice_'+index">
								<component :is="'Face'+dice"></component>
								<Dice :number="dice"></Dice>
						</div>
					</transition-group>
				</div>

				<div class="steps">
					<div :class="{'on': step > 0}">💀</div>
					<div :class="{'on': step > 1}">💀</div>
					<div :class="{'on': step > 2}">💀</div>
				</div>

				<div class="btns_warp">
					<button
						:class="{'disable': (step > 2)}"
						@click="throwDices"
						class="btn_throw_dices"
					><svgAnchor/>Lancer les dés</button>

					<button
						:class="{'disable': !(step === 3 || round.score > 0)}"
						@click="nextRound"
						class="btn_end_round"
					><svgAnchor/>Finir le tour</button>
				</div>

			</div></transition>

			<transition name="fade">
			<div id="end" v-if="state === 3">
				<h2>Scores</h2>
				<div class="scoreboard">
					<div v-for="(item, index) in scoreboardPlayers" :class="'p_'+index">
						<div class="name">{{ item.name }}</div>
						<div class="score">{{ item.score }}</div>
					</div>
				</div>
				<button @click="newGame" class="reset_btn primary"><svgAnchor/>Refaire un tour</button>
			</div></transition>

		</div>

	</div>
</template>

<script>
	import orderBy from 'lodash/orderBy';

	import Dice from './_inc/Dices.vue'
	import svgAnchor from '../assets/svg/anchor.svg'
	import svgShip from '../assets/svg/ship.svg'
	import svgCaptain from '../assets/svg/captain.svg'
	import svgCrew from '../assets/svg/crew.svg'

	export default {
		data() {
			return {
				loading: true,
				newPlayer: '',
				state: 1,
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
		head: {
			title: {
				inner: 'Ship, Captain and Crew',
				separator: '🌴'
			},
			meta: [
				{ name: 'description', content: 'Ship Captain and Crew is a dice game perfect for party !' },
				{ name: 'theme-color', content: '#242423' },
			],
			link: [
				{ rel: 'icon', href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚓</text></svg>" }
			]
		},
		computed: {
			scoreboardPlayers(){
				return orderBy(this.players, 'score', 'desc');
			},
			isEveryoneLooser(){
				for(let player of this.players) {
					if(player.score > 0) return false
				}
				return true
			}
		},
		methods: {
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
				if(this.players.length < 2) return false
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
				console.log('Cest a Bernard de Jouer !')
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
				setTimeout(() => {
					this.testDices()
				}, 1500)

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

				for (var i = 0; i < tmpArray.length; i++) {
					let y = i + 1
					if(i === (tmpArray.length-1)) y = 0

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
		    setTimeout(() => {
				this.loading = false
			}, 1200)
		},
		components: {
			Dice, svgAnchor, svgShip, svgCaptain, svgCrew
		}
	}
</script>

<style lang="less" scoped>
	@import "../assets/less/SCC.less";
</style>