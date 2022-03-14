<template>
	<div id="app-home">

		<transition name="fade">
			<div id="loading" v-if="loading">
				<div class="looping-rhombuses-spinner">
					<div class="rhombus"></div>
					<div class="rhombus"></div>
					<div class="rhombus"></div>
				</div>
			</div>
		</transition>

		<header>
			<div class="logo">
				<img src="../assets/img/SQL_logo.png">
			</div>
			<h1>Dice Game</h1>
		</header>

		<div class="menu">
			<router-link to="/yeahtzee">Yeahtzee</router-link>
			<router-link to="/ship-captain-crew">Ship Captain and Crew</router-link>
			<router-link to="/drop-dead">Drop Dead</router-link>
		</div>

		<div class="fullscreen">
			<button @click="goFullscreen()" :class="{'on': isFS}">
				<svg viewBox="0 0 16 16">
				  <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
				</svg>
			</button>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				isFS: false,
			}
		},
		head: {
			title: {
				inner: 'Home',
				separator: '🎲'
			},
			link: [
				{ rel: 'icon', href: "https://squalala.fr/favicon.ico" },
			]
		},
		methods: {
			goFullscreen(){
				// document.body.requestFullscreen();

				var doc = window.document;
				var docEl = doc.documentElement;

				var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
				var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

				if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
					requestFullScreen.call(docEl);
					this.isFS = true
				}else {
					cancelFullScreen.call(doc);
					this.isFS = false
				}
			}
		},
		mounted(){
		    setTimeout(() => {
				this.loading = false
			}, 1200)
		}
	}
</script>

<style lang="less" scoped>
	@import "../assets/less/home.less";
</style>
