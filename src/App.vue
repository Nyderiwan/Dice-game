<template>
	<Home v-if="view === 0" @changeView="setView"/>
		<Yeahtzee v-if="view === 1" />
		<ShipCaptainCrew v-if="view === 2" />
	<!-- <component v-bind:is="diceGame"></component> -->
</template>

<script>
	import Home from './components/Home.vue'
	// 1
	import Yeahtzee from './components/Yeahtzee.vue'
	// 2
	import ShipCaptainCrew from './components/SCC.vue'

	export default {
		data() {
			return {
				view: 0
			}
		},
		computed: {
			diceGame(){
				switch (this.view) {
					case 1:
						console.log('Yeahtzee')
						return 'Yeahtzee'
						break;
					case 2:
						console.log('Ship')
						return 'ShipCaptainCrew'
						break;
					default:
						return 'Home'
						break;
				}
			}
		},
		methods: {
			setView(idV){
				this.view = idV
			}
		},
		mounted(){
			console.log('init Dice Game • Squalala • V 0.1');

			let urlPath = window.location.pathname
			if(urlPath === '/') this.view = 0
			if(urlPath === '/yeahtzee') this.view = 1
			if(urlPath === '/ship-captain-crew') this.view = 2

				console.log('urlPath', urlPath, this.view)
		},
		components: {
			Home, Yeahtzee, ShipCaptainCrew
		}
	}
</script>

<style lang="less">
	*{
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		user-select: none;
	}

	body{
		background-color: #2b3037;
	}

	button{
		cursor: pointer;
	}

</style>