
<Container>
<Row>
    {#each $accounts as account}
        <Col xs="auto">
            <Button 
                class={$transactionFilter.accountId === account.id ? 'selected' : 'unselected'} 
                on:click={ () => onSelectAccount(account) }>
                {account.id} {account.name}
            </Button>
        </Col>
    {/each}

</Row>
</Container>

<TransactionSearch/>
<TransactionTable transactions={$transactions}/>

<script>
import { Col, Container, Row } from "sveltestrap";
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
Button.selected {
    border: 4px;
}
Container {
    background-color: red
}
</style>