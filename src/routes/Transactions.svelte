
<h1>Transactions!</h1>

<Form>
    <FormGroup>
        <Input plaintext placeholder="Search for transactions / category"
            type="search"
            name="search"
            id="exampleSearch"
            bind:value={searchText}
        />
    </FormGroup>
</Form>
<TransactionTable transactions={transactions}/>

<script>
import TransactionTable from '../components/TransactionTable.svelte'
import { collectionData } from 'rxfire/firestore';
import { db } from '../firebase';
import { formatDate, formatMoney } from '../utils/formatters';
import { onMount } from 'svelte';
import { map, tap } from 'rxjs/operators';
import { User } from '../stores/user';
import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';

let transactions = [];
let searchText = "";
let searchScheduled = false;
let lastSearchInput = null;


function queryTransactions() {
    searchScheduled = false;
    let query = $User.doc.collection('transactions');
    if (searchText) {
        let searchKeywords = searchText.split(" ")
        searchKeywords.map(k => k.toLowerCase())
        // filter out empty
        searchKeywords = searchKeywords.filter(entry => entry.trim() != '')
        searchKeywords.forEach(k => {
            query = query.where(`keywords.${k}`, '==', true)
        })
        console.log(query)
    }
    else {
        // last 30 days by default
        let sinceDate = moment().subtract(3, 'month').toDate();
        query = query.where("date", '>', sinceDate)
        // query = query.orderByChild("date").startAt(new DateTime().getMillis())
    }
    collectionData(query, 'id')
    .pipe(
        // timestamp to Date
        map(transactions => { 
            return transactions.map( t => {return {...t, date: t.date.toDate() }}) 
        })
    )
    .subscribe(transactions_ => { 
        transactions = transactions_
    })
}

$: { 
    if ($User.doc) {
        queryTransactions()
    }
}

function updateTransactions(text) {
    // add a timer, accumulate changes every .5s
    if ($User.doc) {
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
</script>

<style>
</style>