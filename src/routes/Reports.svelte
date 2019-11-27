
<script>
import { collectionData } from 'rxfire/firestore';
import { db } from '../firebase';
import { tap } from 'rxjs/operators';

const query = db.collection('transactions');

// const query = db.collection('todos').orderBy('created');

// const transactions = collectionData(query, 'id');

let transactions = [];

collectionData(query, 'id')
  .subscribe(transactions_ => { 
      transactions = transactions_
       })

</script>

<h1>Reports!</h1>

{#each transactions as transaction}

    <li>{transaction.name}</li>
    
{/each}
