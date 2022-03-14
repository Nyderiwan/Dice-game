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
			<span>Drop</span><Logo/><span>Dead</span>
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

			<transition name="popup">
				<div id="popup_round" v-if="state === 2" v-show="popUpPlayer">
					<div class="icon"><Logo/></div>
					<h2>C'est au tour de</h2>
					<h3>{{players[currentPlayer].name }}</h3>
					<h2>de jouer !</h2>
				</div>
			</transition>

			<transition name="fade">
			<div id="game" v-if="state === 2">

				<header>
					<div class="score">{{players[currentPlayer].score }}</div>
					<span>{{players[currentPlayer].name }}</span>
				</header>

				<div class="dices_warp">
					<transition-group name="dice" tag="div">
						<div
							v-for="(dice, index) in dices"
							class="dice"
							:key="step+'_'+dice"
							:ref="'dice_'+dicesQty+'_'+dice">
								<Dice :number="dice"></Dice>
						</div>
					</transition-group>
				</div>

				<div class="btns_warp">
					<button
						:class="{'disable': (step > 2)}"
						@click="throwDices"
						class="btn_throw_dices"
					>{{ label_playBtn }}</button>
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
	import orderBy from 'lodash/orderBy'
	import Dice from './_inc/Dices.vue'
	import Logo from '../assets/svg/dd_logo.svg'

	export default {
		data() {
			return {
				loading: true,
				newPlayer: '',
				state: 1,
				players: [],
				currentPlayer: null,
				dices : [],
				dicesQty : 0,
				popUpPlayer : false,
				playable : false
			}
		},
		head: {
			title: {
				inner: 'Drop Dead',
				separator: '💀'
			},
			meta: [
				{ name: 'description', content: 'Drop Dead is a short dice game' },
				{ name: 'theme-color', content: '#000000' },
			],
			link: [
				{ rel: 'icon', href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💀</text></svg>" }
			]
		},
		computed: {
			scoreboardPlayers(){
				return orderBy(this.players, 'score', 'desc');
			},
			label_playBtn(){
				if(this.dicesQty === 0) return "Fin du tour"
				return 'Lancer les dés'
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
				this.popUpPlayer = true
				this.dices = []
				this.dicesQty = 5
				this.playable = true

				setTimeout(() => { this.popUpPlayer = false }, 2200)
			},
			throwDices(){
				if(!this.playable) return false
				if(this.dicesQty > 0){
					this.playable = false

					let setTime = 850
					if(this.dices.length === 0) setTime = 0

					this.dices = []

					setTimeout(() => {
						// Generate Dice Value
						for (var i = 0; i < this.dicesQty; i++) {
							this.dices.push(Math.floor(Math.random()*6)+1)
						}
					}, setTime)

					// Test Dices
					setTimeout(() => {
						this.testDices()
					}, (setTime+1250))

				}else{
					this.nextRound()
				}
			},

			testDices(){
				// Add style to 2 & 5 dices
				let deadDices = []
				if(this.dices.includes(2)) deadDices = [...this.$refs['dice_'+this.dicesQty+'_2']]
				if(this.dices.includes(5)) deadDices = [...this.$refs['dice_'+this.dicesQty+'_5']]
				for (let x of deadDices) x.classList.add('dead')

				// Calcul Score or Dead Dices
				if(this.dices.includes(2) || this.dices.includes(5)){
					let deadDices = 0
					for (let y of this.dices) {
						if(y === 2 || y === 5) deadDices++
					}
					this.dicesQty -= deadDices
				}else{
					let total = this.dices.reduce((x, a) => x + a, 0);
					this.players[this.currentPlayer].score += total
				}

				// Can play again
				this.playable = true
			},

			nextRound(){
				// Next Player
				this.currentPlayer++

				// Test if everyone played & not everyone has 0
				if( this.currentPlayer >= this.players.length )
					return this.state = 3

				this.startRound()
			},

			newGame(){
				let tmpArray = [...this.players]
				this.players = []
				this.currentPlayer = 0

				for (var i = 0; i < tmpArray.length; i++) {
					let y = i + 1
					if(i === (tmpArray.length-1)) y = 0

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
			this.loading = false
		    setTimeout(() => {
			}, 750)
		},
		components: { Dice, Logo }
	}
</script>

<style lang="less" scoped>
	@import "../assets/less/dropdead.less";
</style>