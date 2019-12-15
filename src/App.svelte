<script>
    import Transactions from "./routes/Transactions.svelte"
    import Budgets from "./routes/Budgets.svelte"
    import Reports from "./routes/Reports.svelte"
    import Import from "./routes/Import.svelte"
    import Router from "svelte-spa-router"

    import Nav from "./components/Nav.svelte"
    import { transactionFilter } from "./store/cache"
    import { updateTransactions } from "./api/transactions"
    import { updateAccounts } from "./api/accounts"
    import { transactions } from "./store/cache"
    import { user, db } from "./stitch"

    import moment from "moment"

    window.moment = moment

    export let name
    let segment

    const routes = {
        "/": Transactions,
        "/transactions": Transactions,
        "/budgets": Budgets,
        "/reports": Reports,
        "/import": Import,
    }

    // first time we load the app, we want latest transactions (last 30 days)
    // then we want to refresh transactions on every update of
    // 		- user
    //		- search text
    //		-
    // update list of transactions every time the search keyword is updated
    $: if ($user) {
        updateTransactions($transactionFilter)
    } else {
        transactions.set([])
    }

    // list of accounts on user change
    $: if ($user) {
        updateAccounts()
    }
</script>

<style type="text/scss">
    $color: blue;

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

    <Nav {segment} />
    <Router {routes} />

</div>
