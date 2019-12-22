<script>
    import { db } from "../stitch"
    import { updateTransactions } from "../api/transactions"
    import { transactionFilter } from "../store/cache"

    export let transactions = []

    let category

    $: if (transactions.length) {
        initValues()
    }

    function initValues() {
        category = transactions.length ? transactions[0].category : ""
    }
    function saveChanges() {
        const values = {
            category,
        }
        const collection = db.collection("transactions")
        collection
            .updateMany(
                { _id: { $in: transactions.map(t => t._id) } },
                { $set: values }
            )
            .then(() => updateTransactions($transactionFilter))
            .catch(err => console.log(`failed to update transactions: ${err}`))
    }
</script>

<style>

</style>

<form class="ui form">
    <div>{transactions.length} transactions selected</div>
    <div class="field">
        <label>Category</label>
        <div class="ui action input">
            <input type="text" bind:value={category} />
            <div class="ui button" on:click={saveChanges}>Save</div>
        </div>
    </div>
</form>
