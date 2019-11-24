
<h1>Transactions!</h1>

<div id="transactions-table"/>

<script>

import Tabulator from 'tabulator-tables';

import { collectionData } from 'rxfire/firestore';
import { db } from '../firebase';
import { dateFormatter } from '../utils/formatters';
import { onMount } from 'svelte';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

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
        transactions.push(...transactions_)
    })

onMount(() => {
    const table = new Tabulator("#transactions-table", {
        data: transactions,
        reactiveData:true,
        layout:"fitData",
        columns:[
            {
                title:"Date", 
                field:"date", 
                width:110, 
                align:"center", 
                editable:false, 
                formatter: dateFormatter, 
                sorter:"date", 
                sorterParams:{
                    format:"DD/MM/YY",
                    alignEmptyValues:"top",
                }
            },
            {title:"Account", field:"accountId", width:200, editable:false},
            {title:"Amount", field:"amount", width:130, align: "right", editable:false},
            {title:"Name", field:"name", minWidth:300, editable:false},
        ],
    });
});

</script>
