
<h1>Transactions!</h1>

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

const query = db.collection('transactions');

let transactions = [];

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