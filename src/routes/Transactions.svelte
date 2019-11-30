
<h1>Transactions!</h1>


<Textfield
  bind:value={searchText}
  label="Search"
  input$aria-controls="super-helper"
  input$aria-describedby="super-helper"
/>
<HelperText id="super-helper">Search categories, name, amount...</HelperText>
<!-- <Button on:click={() => alert('Clicked!')}>Just a Button</Button> -->

<table class="transactions">
    <th>Date</th>
    <th>Account</th>
    <th>Amount</th>
    <th>Name</th>
    {#each transactions as transaction}
        <tr>
            <td>{formatDate(transaction.date)}</td>
            <td>{transaction.accountId}</td>
            <td>{formatMoney(transaction.amount)}</td>
            <td>{transaction.name}</td>
        </tr>
    {/each}
</table>

<script>
import { collectionData } from 'rxfire/firestore';
import { db } from '../firebase';
import { formatDate, formatMoney } from '../utils/formatters';
import { onMount } from 'svelte';
import { map, tap } from 'rxjs/operators';
import { User } from '../stores/user';

import Button from '@smui/button';
import Textfield from '@smui/textfield';
import HelperText from '@smui/textfield/helper-text';

let transactions = [];
let searchText = "";
let searchScheduled = false;


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
        if (! searchScheduled) {
            searchScheduled = true;
            window.setTimeout(queryTransactions, 500)
        }
    }
}

$: updateTransactions(searchText)


</script>

<style>
table.transactions {
    /* border-spacing: 10px; */
}
table.transactions td {
    padding: 2px 10px;
}
table.transactions td:nth-child(3) {
    text-align: right;
}
table.transactions td:nth-child(1) {
    text-align: right;
}
</style>