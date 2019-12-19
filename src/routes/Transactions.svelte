<script>
    import TransactionSearch from "../components/TransactionSearch.svelte"
    import TransactionTable from "../components/TransactionTable.svelte"
    import AccountEditor from "../components/AccountEditor.svelte"
    import { formatDate, formatMoney } from "../utils/formatters"
    import { transactions, accounts, transactionFilter } from "../store/cache"
    import Icon from "svelte-awesome"
    import { beer } from "svelte-awesome/icons"
    import { faEdit } from "@fortawesome/free-regular-svg-icons"

    let editedAccount = null
    let selectedAccount = null
    const openAccountWindow = account => (editedAccount = account)

    function onSelectAccount(account) {
        const accountId =
            $transactionFilter.accountId === account.id ? null : account.id
        selectedAccount =
            $transactionFilter.accountId === account.id ? null : account
        transactionFilter.update(f => {
            f.accountId = accountId
            return f
        })
    }
</script>

<style>
    button.selected {
        border: 4px;
    }
    .account-button {
        background-color: #d1d1d1;
        border-radius: 5px;
        padding: 5px 10px;
    }
    .selected-account {
        background-color: #999999;
        border-style: solid;
        border-width: 2px;
        border-color: #555555;
    }
</style>

<div class="ui container grid">
    <div class="row">
        {#each $accounts as account}
            <div
                class="three wide column account-button"
                class:selected-account={selectedAccount === account}>
                <span on:click={() => onSelectAccount(account)}>
                    {account.label ? account.label : account.id}
                </span>
                <span on:click={() => openAccountWindow(account)}>
                    <Icon data={faEdit} />
                </span>
            </div>
        {/each}
    </div>
    <div class=" sixteen wide column">
        <TransactionSearch />
    </div>
    <div class="row">
        <TransactionTable transactions={$transactions} />
    </div>
</div>

<AccountEditor account={editedAccount} />
