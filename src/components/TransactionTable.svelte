<script>
    import { Table } from "sveltestrap"
    import { formatDate, formatMoney } from "../utils/formatters"
    import { accountLabelById } from "../store/cache"

    export let transactions = []
</script>

<style>
    table.transactions {
        /* border-spacing: 10px; */
    }
    td {
        padding: 2px 10px;
    }
    td:nth-child(3) {
        text-align: right;
    }
    td:nth-child(1) {
        text-align: right;
    }
    tr.exists td {
        color: #888888;
        font-style: italic;
    }
</style>

<Table class="transactions">
    <thead>
        <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Name</th>
        </tr>
    </thead>
    <tbody>
        {#each transactions as transaction}
            <tr class={transaction.exists ? 'exists' : ''}>
                <td>{formatDate(transaction.date)}</td>
                <td>{$accountLabelById[transaction.accountId]}</td>
                <td>{formatMoney(transaction.amount)}</td>
                <td>{transaction.name}</td>
            </tr>
        {/each}
    </tbody>
</Table>
