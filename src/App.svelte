<script>
	import Transactions from './routes/Transactions.svelte'
	import Budgets from './routes/Budgets.svelte'
	import Reports from './routes/Reports.svelte'
	import Import from './routes/Import.svelte'
	import Router from 'svelte-spa-router'

    import Profile from './components/Profile.svelte';
	import Nav from './components/Nav.svelte'

	import { auth, googleProvider } from './firebase';
    import { authState } from 'rxfire/auth';

    let user;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login() {
        auth.signInWithPopup(googleProvider);
    }


	export let name;
	export let segment;

	const routes = {
    '/': Transactions,
    '/transactions': Transactions,
	'/budgets': Budgets,
	'/reports': Reports,
	'/import': Import,
	}
</script>

<style type="text/scss">
  $color: blue;

  h1 {
    color: $color;
  }

  div {
    background: rgb(15, 192, 15);

    > p {
      color: #fff;
    }
  }
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

<section>
{#if user}
    <Profile {...user} />
    <button on:click={ () => auth.signOut() }>Logout</button>
    <hr>
    <!-- <Todos uid={user.uid} /> -->
{:else}
	<button on:click={login}>
		Signin with Google
	</button>
{/if}
</section>

<Nav {segment}/>
<Router {routes}/>

</div>
