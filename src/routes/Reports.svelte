
<script>
import { tap } from 'rxjs/operators';


let transactions = [];


</script>

<h1>Reports!</h1>

{#each transactions as transaction}

    <li>{transaction.name}</li>
    
{/each}
