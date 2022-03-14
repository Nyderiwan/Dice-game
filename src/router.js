import { createWebHistory, createRouter } from "vue-router"



// Components
import Home from './components/Home.vue'
import Yeahtzee from './components/Yeahtzee.vue'
import ShipCaptainCrew from './components/SCC.vue'
import DropDead from './components/DropDead.vue'

// Routes
const routes = [
	{
		path: '/',
		name: "home",
		component: Home
	},
	{
		path: '/yeahtzee',
		component: Yeahtzee
	},
	{
		path: '/ship-captain-crew',
		component: ShipCaptainCrew
	},
	{
		path: '/drop-dead',
		component: DropDead
	},
]

// https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
const history = createWebHistory()
const router = createRouter({ history, routes });

export default router;