
<h1>Transactions!</h1>

{#each $accounts as account}
    <div>
        {account.id} {account.name}
    </div>
{/each}

<TransactionSearch/>
<TransactionTable transactions={$transactions}/>

<script>
import TransactionSearch from '../components/TransactionSearch.svelte'
import TransactionTable from '../components/TransactionTable.svelte'
import { formatDate, formatMoney } from '../utils/formatters';
import { transactions, accounts } from '../store/cache';
</script>

<style>
</style>