<template>
	<div id="app-home">

		<header>
			<h1>Dice Game</h1>
		</header>

		<p><button @click="chooseGame(1)">Yeahtzee</button></p>
		<p><button @click="chooseGame(2)">Ship Captain and Crew</button></p>

	</div>
</template>

<script>

	export default {
		data() {
			return {
			}
		},
		methods: {
			chooseGame(view){
				this.$emit('changeView', view);
			},
		},
		mounted(){
			console.log('Home Sweet Home !')
			/*
			document.title = 'Ship, Captain and Crew 🌴'
			*/
		},
		emits: ["changeView"]
	}
</script>

<style lang="less">

	#app-home{
		background: crimson;

		overflow: hidden;
		position: relative;
		width: 100%;
		max-width: 550px;
		height: 100vh;
		margin: 0 auto;

		box-shadow: 0 0 30px fade(#000, 30%);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		// Mobile simulation
		@media screen and (min-height: 880px){
			max-width: 500px;
			border-radius: 8px;
			height: calc(100vh - 40px);
			margin-top: 20px;
		}

	}

</style>