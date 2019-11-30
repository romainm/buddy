
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
import { formatDate, formatMoney } from '../utils/formatters';

export let transactions = [];

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