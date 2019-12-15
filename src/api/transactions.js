import { transactions } from "../store/cache"
import { db } from "../stitch"

export function updateTransactions(transactionFilter) {
    const transactionsCol = db.collection("transactions")
    console.log("query")
    console.log(transactionFilter)

    const conditions = {}
    if (transactionFilter.text) {
        conditions.name = new RegExp(transactionFilter.text, "i")
    }
    if (transactionFilter.accountId) {
        conditions.accountId = transactionFilter.accountId
    }
    if (Object.keys(conditions).length === 0) {
        // last 30 days by default
        conditions.date = {
            $gte: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
        }
    }

    transactionsCol
        .find(conditions, { sort: { date: -1 } })
        .toArray()
        .then(docs => {
            transactions.set(docs)
        })
}
