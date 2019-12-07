
<h1>Transactions!</h1>

<Form>
    <FormGroup>
        <Input plaintext placeholder="Search for transactions / category"
            type="search"
            name="search"
            id="exampleSearch"
            readonly=0
            bind:value={searchText}
        />
    </FormGroup>
</Form>
<TransactionTable transactions={transactions}/>

<script>
import TransactionTable from '../components/TransactionTable.svelte'
import { formatDate, formatMoney } from '../utils/formatters';
import { onMount } from 'svelte';
import { map, tap } from 'rxjs/operators';
import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
import { user, db } from '../stitch';

let transactions = [];
let searchText = "";
let searchScheduled = false;
let lastSearchInput = null;
let shouldQuery = false;


function queryTransactions() {
    searchScheduled = false

    const transactionsCol = db.collection('transactions')

    let p
    if (searchText) {
        p = transactionsCol
            .find({"name": new RegExp(searchText, "i")}, {})
            .toArray()
    }
    else {
        // last 30 days by default
        p = transactionsCol
            .find({}, {})
            .toArray()
        p = transactionsCol
            .find( {
                "date": { 
                    $gte: new Date((new Date().getTime() - (90 * 24 * 60 * 60 * 1000)))
                }
            }, {})
            .toArray()
    }

    p.then(docs => {
        transactions = docs
    })
}

$: { 
    if ($user) {
        console.log('user ok')
        queryTransactions()
    }
}

function updateTransactions(text) {
    // add a timer, accumulate changes every .5s
    if ($user) {
        // no active search, start timer
        if (lastSearchInput === null) {
            console.log('activating')
            window.setTimeout(checkQueryTransactions, 1000)
        }
        const now = new Date()
        lastSearchInput = now;
    }
}

function checkQueryTransactions() {
    // last keystroke was a second ago, trigger query
    const now = new Date()
    const nbms = 500
    if (now - lastSearchInput > nbms) {
        lastSearchInput = null;
        queryTransactions()
    }
    // otherwise, just add a timer
    else{
        window.setTimeout(checkQueryTransactions, nbms - (now-lastSearchInput))
    }

}

$: updateTransactions(searchText)
// $: {
//     if (shouldQuery) {
//         queryTransactions()
//     }
// }
</script>

<style>
</style>