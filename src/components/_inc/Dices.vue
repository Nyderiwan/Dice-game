<template>
	<component :is="'Face'+number"></component>
</template>

<script>
	import Face1 from '../../assets/dice/face_1.svg'
	import Face2 from '../../assets/dice/face_2.svg'
	import Face3 from '../../assets/dice/face_3.svg'
	import Face4 from '../../assets/dice/face_4.svg'
	import Face5 from '../../assets/dice/face_5.svg'
	import Face6 from '../../assets/dice/face_6.svg'

	export default {
		props: ['number'],
		components: {
			Face1, Face2, Face3, Face4, Face5, Face6
		}
	}
</script>