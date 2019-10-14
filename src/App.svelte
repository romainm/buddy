<script>
	import Transactions from './routes/Transactions.svelte'
	import Budgets from './routes/Budgets.svelte'
	import Reports from './routes/Reports.svelte'
	import Router from 'svelte-spa-router'
	import Nav from './components/Nav.svelte'

	export let name;
	export let segment;

	const routes = {
    '/': Transactions,
    '/transactions': Transactions,
	'/budgets': Budgets,
	'/reports': Reports,
	'*': Transactions
	}
</script>

<style>
	h1 {
		color: purple;
	}
	div#app {
		background-color: white;
        margin-left: auto;
        margin-right: auto;
        width: 1024px;
	}
</style>

<div id="app">

<Nav {segment}/>
<Router {routes}/>

</div>