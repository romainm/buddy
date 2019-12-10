
<h1>Transactions!</h1>

<ul id="account-list">
    {#each $accounts as account}
        <li>
            <Button 
                class={$transactionFilter.accountId === account.id ? 'selected' : 'unselected'} 
                on:click={ () => onSelectAccount(account) }>
                {account.id} {account.name}
            </Button>
        </li>
    {/each}
</ul>

<TransactionSearch/>
<TransactionTable transactions={$transactions}/>

<script>
import TransactionSearch from '../components/TransactionSearch.svelte'
import TransactionTable from '../components/TransactionTable.svelte'
import { Button } from 'sveltestrap';
import { formatDate, formatMoney } from '../utils/formatters';
import { transactions, accounts, transactionFilter } from '../store/cache';

function onSelectAccount(account) {
    const accountId = $transactionFilter.accountId === account.id ? null: account.id
    console.log(`selected acount ${accountId}`)
    transactionFilter.update(f => {
        f.accountId = accountId
        return f
    })
}
</script>

<style>
ul#account-list {
  text-align: left;
  padding: 1px;
}
ul#account-list li {
  display: inline;
  margin-left: 10px;
}
Button.selected {
    border: 4px;
}
</style>