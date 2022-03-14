<template>
	<div id="app-yeahtzee">
		<header id="header_game">
			<h1><span>Yeah</span>tzee !</h1>
			<template v-if="state === 2">
				<div class="title_pseudo">Au tour de <span>{{players[currentPlayer].name }}</span> de jouer</div>
				<div class="title_step" :class="'step_'+step" v-show="state === 2">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>

			<button id="score_btn" @click="showScore = true" v-if="state > 1 && state < 4"><span>⭐</span> Score</button>
		</header>

		<transition name="fade">
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
			</div>
		</transition>

		<transition name="fade">
			<div id="game" v-if="state === 2">
				<div class="dices_arena">

					<transition-group name="dice" tag="div">
						<div
							v-for="(dice, index) in dices"
							class="dice" :class="{'invisible' : dice.keep}"
							@click="dice.keep = true"
							:key="step+'_'+dice.value"
							:style="dice.css"
							:ref="'dice_'+index">
								<Dice :number="dice.value"></Dice>
						</div>
					</transition-group>

					<button @click="testPlay" id="play_btn" class="primary">{{ labelBtn }}</button>
				</div>

				<div class="dices_keep">
					<transition-group name="dicekeep" tag="div">
					<div class="dice" :class="'d_'+dice.value" v-for="dice in keepDices" @click="dice.keep = false" :key="dice">
						<Dice :number="dice.value"></Dice>
					</div>
					</transition-group>
				</div>
			</div>
		</transition>

		<transition name="fade">
			<div id="scoreboard" v-show="showScore" v-if="state > 1">
				<button class="close_score" @click="showScore = false">×</button>
				<div class="scoreboard_title">Score de <span>{{ players[currentPlayer].name }}</span></div>
				<div class="score_warp" :class="{'bonus_on': players[currentPlayer].score['bonus']}">
					<div class="line head_line">
						<div class="lh_name">Combinaison</div>
						<div class="lh_scoring">Valeur</div>
						<div class="lh_player_score">Score</div>
					</div>
					<div v-for="item in tempScore" :class="[item.id, 'line', {'done': (item.will_do === null)}]">
						<div class="name">{{ item.name }}
							<span v-if="item.desc">{{ item.desc }}</span>
						</div>
						<div class="scoring">{{ item.scoring }}</div>
						<div class="player_score">{{ item.player_score }}</div>
						<div class="choose_this" v-if="state === 2 && step > 0 && (item.will_do != null)" @click="chooseObj(item.id)" :class="item.will_do === 0 ? 'cancel':''">{{ item.will_do }}</div>
					</div>
				</div>
			</div>
		</transition>

		<div id="next" v-if="state === 3">
			<h4>C'est au joueur suivant</h4>
			<h2>{{ players[nextPlayer].name }}</h2>
			<button class="primary" @click="nextRound">Yahtzee !</button>
		</div>

		<div id="end_screen" v-if="state === 4">
			<h3>Fin de la partie !</h3>

			<div class="final_scoreboard">

				<div v-for="(player, idx) in playersByScore" class="final_line">
					<div class="ranked">#{{ idx + 1 }}</div>
					<div class="name">{{ player.name }}</div>
					<button class="score" @click="showScoreEnd(player.id)">{{ player.finalTotal }} points</button>
				</div>

			</div>

			<button @click="reset" class="reset_btn primary">Retour</button>
		</div>
	</div>
</template>

<script>
	// import _ from 'lodash'
	import orderBy from 'lodash/orderBy';

	// Dice custom component
	import Dice from './_inc/Dices.vue'

	// Yahtzee combinaisons & base score for players
		const yahtzeeRules = [
			{
				id: 'aces',
				name: 'Aces',
				scoring: 'Total des 1'
			},
			{
				id: 'twos',
				name: 'Twos',
				scoring: 'Total des 2'
			},
			{
				id: 'threes',
				name: 'Threes',
				scoring: 'Total des 3'
			},
			{
				id: 'fours',
				name: 'Fours',
				scoring: 'Total des 4'
			},
			{
				id: 'fives',
				name: 'Fives',
				scoring: 'Total des 5'
			},
			{
				id: 'sixes',
				name: 'Sixes',
				scoring: 'Total des 6'
			},
			{
				id: 'bonus',
				name: 'Bonus',
				desc: 'If score > 63',
				scoring: '35'
			},
			{
				id: '3kind',
				name: '3 of a Kind',
				scoring: 'Total'
			},
			{
				id: '4kind',
				name: '4 of a Kind',
				scoring: 'Total'
			},
			{
				id: 'fullhouse',
				name: 'Full House',
				desc: '',
				scoring: '25'
			},
			{
				id: 'ss',
				name: 'Small Straight',
				desc: 'sequence of 4',
				scoring: '30'
			},
			{
				id: 'ls',
				name: 'Large Straight',
				desc: 'sequence of 5',
				scoring: '40'
			},
			{
				id: 'yahtzee',
				name: 'Yahtzee',
				desc: '5 of a kind',
				scoring: '50'
			},
			{
				id: 'chance',
				name: 'Chance',
				scoring: 'Total'
			},
			{
				id: 'total',
				name: 'Total',
			}
		]
		const baseScore = {
			'aces': null,
			'twos': null,
			'threes': null,
			'fours': null,
			'fives': null,
			'sixes': null,
			'bonus': false,
			'3kind': null,
			'4kind': null,
			'fullhouse': null,
			'ss': null,
			'ls': null,
			'yahtzee': null,
			'chance': null,
		}

	export default {
		data() {
			return {
				newPlayer: '',
				players: [],
				currentPlayer: null,
				dices: [],
				state: 1,
				step: 0,
				round: 0,
				showScore: false,
				finalRound: false
			}
		},
		computed: {
			labelBtn(){
				if(this.step === 3)
					return "Choisir une combinaison"
				else
					return "Lancer les dés"
			},
			keepDices(){
				let tmpKeep = this.dices.filter((tmp) => tmp.keep);
				return tmpKeep.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0 ))
			},
			dicesValues(){
				return this.dices.map(d => d.value).sort()
			},
			tempScore(){
				let tmpCombinaisons = [...yahtzeeRules]
				let thisPlayer = this.players[this.currentPlayer]

				for(let x in tmpCombinaisons){

					let tmpId = tmpCombinaisons[x].id

					if(thisPlayer.score[tmpId] !== null){
						tmpCombinaisons[x]['player_score'] = thisPlayer.score[tmpId]
						tmpCombinaisons[x]['will_do'] = null
					}else{
						tmpCombinaisons[x]['player_score'] = ''
						tmpCombinaisons[x]['will_do'] = this.calcul_combinaison(tmpId)
					}

					if(tmpId === 'bonus')
						tmpCombinaisons[x]['player_score'] = this.bonusLeft

					if(tmpId === 'total')
						tmpCombinaisons[x]['player_score'] = this.trueTotal
				}

				return tmpCombinaisons
			},
			trueTotal(){
				let tmpTotal = this.players[this.currentPlayer].total
				if(this.players[this.currentPlayer].score['bonus']) tmpTotal += 35
				return tmpTotal
			},
			bonusLeft(){
				let tmpSum = 0
					tmpSum += this.players[this.currentPlayer].score['aces']
					tmpSum += this.players[this.currentPlayer].score['twos']
					tmpSum += this.players[this.currentPlayer].score['threes']
					tmpSum += this.players[this.currentPlayer].score['fours']
					tmpSum += this.players[this.currentPlayer].score['fives']
					tmpSum += this.players[this.currentPlayer].score['sixes']

				return (tmpSum - 63)
			},
			nextPlayer(){
				return ((this.currentPlayer + 1) >= this.players.length ? 0 : (this.currentPlayer+1))
			},
			playersByScore(){
				let tmpPlayers = [...this.players]
				for (let key in tmpPlayers) {
					tmpPlayers[key].id = key
					tmpPlayers[key].finalTotal = tmpPlayers[key].total
					if(tmpPlayers[key].score['bonus']) tmpPlayers[key].finalTotal += 35
				}
				return orderBy(tmpPlayers, ['finalTotal', 'name'], ['desc', 'asc'])
			}
		},
		methods: {
			addPlayer(){
				let tmpPseudo = this.newPlayer.trim()
				if(tmpPseudo.length < 4) return false
				this.players.push({
					name: tmpPseudo,
					score: {...baseScore},
					total: 0
				})
				this.newPlayer = ''
			},
			startGame(){
				if(this.players.length < 2) return false
				this.state = 2
				this.currentPlayer = 0
				this.players = this.shuffleAray(this.players)
				this.round = 1
				this.starRound()
			},
			starRound(){
				this.dices = []
				this.state = 2
				this.step = 0
			},
			initDices(){
				for (var i = 4; i >= 0; i--) {
					this.dices.push({
						value: null,
						css: null,
						keep: false
					})
				}
			},
			getRandomPosition(){
				let transX = (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 10),
					transY = (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 3),
					rot = (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 15)
				return {transform: 'translate3d('+transX+'px, '+transY+'px, 0) rotate('+rot+'deg)'};
			},
			testPlay(){
				if(this.step === 3) this.showScore = true
				else if(this.step > 3) return false
				else this.play()
			},
			play(){
				if(this.step > 3) return false

				if(this.dices.length != 5) this.initDices()

				for (let x in this.dices){
					if(!this.dices[x].keep){
						this.dices[x].value = Math.floor(Math.random() * 6) + 1;
						this.dices[x].css = this.getRandomPosition()
					}
				}
				// Sort
				this.dices.sort((a, b) => (a.keep && !b.keep) ? 1 : ((!a.keep && b.keep) ? -1 : 0 ))

				this.step++
			},
			chooseObj(y){
				if(this.state !== 2) return false
				let resultRules = this.calcul_combinaison(y)

				this.players[this.currentPlayer].score[y] = resultRules
				if(resultRules > 0) this.players[this.currentPlayer].total += resultRules

				// test if get Bonus
				if(!this.players[this.currentPlayer].score['bonus'] && this.bonusLeft >= 0 )
					this.players[this.currentPlayer].score['bonus'] = true

				this.showScore = false

				if(this.finalRound && this.nextPlayer === 0){
					this.state = 4
				}else{
					this.state = 3
				}
			},
			calcul_combinaison(x){
				switch (x) {
					case 'aces':
						return this.CT_getTotalByValue(1)
						break;
					case 'twos':
						return this.CT_getTotalByValue(2)
						break;
					case 'threes':
						return this.CT_getTotalByValue(3)
						break;
					case 'fours':
						return this.CT_getTotalByValue(4)
						break;
					case 'fives':
						return this.CT_getTotalByValue(5)
						break;
					case 'sixes':
						return this.CT_getTotalByValue(6)
						break;
					case '3kind':
							if( this.CT_testKind(3) ) return this.CT_getTotal()
							else return 0
						break;
					case '4kind':
							if( this.CT_testKind(4) ) return this.CT_getTotal()
							else return 0
						break;
					case 'fullhouse':
							if( this.CT_testFull() ) return 25
							else return 0
						break;
					case 'ss':
							if( this.CT_testSmallStraight() ) return 30
							else return 0
						break;
					case 'ls':
							if( this.CT_testLargeStraight() ) return 40
							else return 0
						break;
					case 'yahtzee':
							if(this.CT_testKind(5)) return 50
							else return 0
						break;
					case 'chance':
						return this.CT_getTotal()
						break;
					default:
						return null
						break;
				}
			},
			nextRound(){
				this.showScore = false

				// Set new Player
				this.currentPlayer = this.nextPlayer
				if(this.currentPlayer === 0){
					this.round++
					if(this.round === 13) this.finalRound = true
				}

				if(this.round > 13){
					this.state = 4
					return
				}
				this.starRound()
			},
			showScoreEnd(idPlayer){
				this.currentPlayer = idPlayer
				this.showScore = true
			},
			reset(){
				let tmpOld = [...this.players]

				this.dices = []
				this.state = 1
				this.step = 0
				this.round = 0
				this.showScore = false
				this.finalRound = false
				this.currentPlayer = null
				this.players = []

				for(let prevPlayer of tmpOld) {
					this.players.push({
						name: prevPlayer.name,
						score: {...baseScore},
						total: 0
					})
				}
			},
			// Yahtzee Combinaison Test
				CT_getTotal(){
					return this.dicesValues.reduce((a, b) => a + b, 0)
				},
				CT_getTotalByValue(value){
					let tmp = 0
					for(let x of this.dicesValues){
						if(x === value) tmp += x
					}
					return tmp
				},
				CT_testKind(k){
					let counts = {}
					for(let x of this.dicesValues) {
						counts[x] = counts[x] ? counts[x] + 1 : 1
						if(counts[x] === k) return true
					}
					return false
				},
				CT_testSmallStraight(){
					if(!this.diceExist(3) || !this.diceExist(4)) return false
					if(this.diceExist(1) && this.diceExist(2)) return true
					if(this.diceExist(2) && this.diceExist(5)) return true
					if(this.diceExist(5) && this.diceExist(6)) return true
					return false
				},
				CT_testLargeStraight(){
					for(let x in this.dicesValues) {
						if(x > 0){
							let tmp = this.dicesValues[x] - this.dicesValues[x-1]
							if(tmp !== 1) return false
						}
					}
					return true
				},
				CT_testFull(){
					let counts = {}
					for(let x of this.dicesValues) {
						counts[x] = counts[x] ? counts[x] + 1 : 1
					}
					let tmpCount = Object.values(counts)
					if( (tmpCount[0] === 3 && tmpCount[1] === 2)
					|| (tmpCount[0] === 2 && tmpCount[1] === 3) ) return true

					return false
				},
			// Utility
				diceExist(val){
					return this.dicesValues.indexOf(val) > -1
				},
				shuffleAray(a){
					for (let i = a.length - 1; i > 0; i--){
						const j = Math.floor(Math.random() * (i + 1));
						[a[i], a[j]] = [a[j], a[i]];
					}
					return a;
				}
		},
		head: {
			title: {
				inner: 'Yeahtzee !',
				separator: '🎲'
			},
			meta: [
				{ name: 'theme-color', content: '#26547c' },
			]
		},
		components: { Dice }
	}
</script>

<style lang="less" scoped>
	@import "../assets/less/yeahtzee.less";
</style>