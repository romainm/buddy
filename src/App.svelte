<script>
	import Transactions from './routes/Transactions.svelte'
	import Budgets from './routes/Budgets.svelte'
	import Reports from './routes/Reports.svelte'
	import Import from './routes/Import.svelte'
	import Router from 'svelte-spa-router'

    import Profile from './components/Profile.svelte';
	import Nav from './components/Nav.svelte'

	import { db, auth, googleProvider } from './firebase';
	import { authState } from 'rxfire/auth';
	import { User } from './stores/user';

	import moment from 'moment';
	window.moment = moment;

	async function setupUser(u, createIfNotExists=true) {
		const doc = db.collection('users').doc(u.uid)
		User.set({...u, doc})

		// if (!doc.exists && createIfNotExists) {
		// 	console.log('Creating user');
		// 	const ref = await db.collection('users').doc(u.uid).set({email: u.email})
		// 	setupUser(u, createIfNotExists=false)
		// } else {
		// 	console.log('User data:', doc.data());
		// 	User.set({...u, doc})
		// }
	}

    const unsubscribe = authState(auth).subscribe(u => {
		// Expand user with doc attribute pointing to its collection
		// so first create it if needed.
		setupUser(u)
	});

    function login() {
        auth.signInWithPopup(googleProvider);
    }

	export let name;
	let segment;

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
{#if $User}
    <Profile User={$User}/>
    <button on:click={ () => auth.signOut() }>Logout</button>
    <hr>
{:else}
	<button on:click={login}>
		Signin with Google
	</button>
{/if}
</section>

<Nav {segment}/>
<Router {routes}/>

</div>
