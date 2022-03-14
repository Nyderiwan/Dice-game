<template>
	<router-view v-slot="{ Component }">
		<transition name="fade" mode="out-in">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script>
	export default {
		mounted(){
			console.log('init Dice Game • Squalala • V 0.1');
		},
		head: {
			title: {
				inner: '',
				separator: '🎲',
				complement : 'Squalala Dice Games',
			},
			link: [
				{ rel: 'icon', href: "https://squalala.fr/favicon.ico" },
				{ rel: 'manifest', href: "./manifest.webmanifest" }
			]
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
		overflow: hidden;
		height: 100vh;
		width: 100vw;
	}
	button{
		cursor: pointer;
	}

	// Fade

		.fade-enter-active,
		.fade-leave-active{
			transition: opacity .5s ease;
		}

		.fade-enter-from,
		.fade-leave-to{
			opacity: 0;
		}

		.fade-enter-to,
		.fade-leave-from{
			opacity: 1;
		}


</style>