<script>
	import { Container, Row, Col } from "sveltestrap";
    import {link, location} from 'svelte-spa-router'
	import { auth, user, login } from '../stitch';
	import Profile from './Profile.svelte';
	
	let active;

</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 2px 0px 10px 0px;
	}
	ul {
		margin: 0;
		padding: 0;
	}
	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}
	li {
		display: block;
		float: left;
	}
	.selected {
		position: relative;
		display: inline-block;
	}
	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}
	a {
		text-decoration: none;
		padding: 2px 10px;
		display: block;
        color: rgb(220,62,0);
        font-size: 1.2em;
	}
	Container {
		margin: 0px;
		padding: 0px;
	}
</style>

<nav>
	<Container>
	<Row>
	<Col sm="9">
		<ul>
			<li><a class='{$location === "/" ? "selected" : ""}' href='/' use:link>transactions</a></li>
			<li><a class='{$location === "/budgets" ? "selected" : ""}' href='/budgets' use:link>budgets</a></li>
			<li><a class='{$location === "/reports" ? "selected" : ""}' href='/reports' use:link>reports</a></li>
			<li><a class='{$location === "/import" ? "selected" : ""}' href='/import' use:link>import</a></li>
		</ul>
	</Col>
	<Col sm="3">
	{#if $user}
		<Profile user={$user}/>
		<button on:click={ () => {auth.logout(); user.set(null)} }>Logout</button>
	{:else}
		<button on:click={login}>
			Signin with Google
		</button>
	{/if}
	</Col>
	</Row>
	</Container>
</nav>