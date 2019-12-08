
<h1>Transactions!</h1>

<TransactionSearch/>
<TransactionTable transactions={$transactions}/>

<script>
import TransactionSearch from '../components/TransactionSearch.svelte'
import TransactionTable from '../components/TransactionTable.svelte'
import { formatDate, formatMoney } from '../utils/formatters';
import { transactions } from '../store/cache';
</script>

<style>
</style>