<template>
	<components :is="diceGame"/>
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
						return ShipCaptainCrew
						break;
					case 2:
						return ShipCaptainCrew
						break;
					default:
						return Home
						break;
				}
			}
		},
		mounted(){
			console.log('init Dice Game • Squalala • V 0.1');

			let urlPath = window.location.pathname
			if(urlPath === '/') this.view = 0
			if(urlPath === '/yeahtzee') this.view = 1
			if(urlPath === '/ship-captain-crew') this.view = 2
		},
		components: {
			Home, Yeahtzee, ShipCaptainCrew
		}
	}
</script>

<style lang="less"></style>