
<h1>Transactions!</h1>

<div id="transactionstable"/>

<script>

import Tabulator from 'tabulator-tables';

import { collectionData } from 'rxfire/firestore';
import { db } from '../firebase';
import { onMount } from 'svelte';

const query = db.collection('transactions');

let transactions = [];

collectionData(query, 'id')
  .subscribe(transactions_ => { 
      console.log('hey')
      transactions.push(...transactions_)
       })

onMount(() => {
    console.log('the component has mounted');
    const table = new Tabulator("#transactionstable", {
        data: transactions,
        reactiveData:true, //enable reactive data
        columns:[
            {title:"Name", field:"name", sorter:"string", width:200, editor:true},
        ],
    });
});

// db.collection('transactions').add({ 'name': "optus", date: Date.now() });

</script>
