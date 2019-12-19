import { transactions } from "../store/cache"
import { db } from "../stitch"

export function updateTransactions(transactionFilter) {
    const transactionsCol = db.collection("transactions")

    const conditions = {}
    if (transactionFilter.text) {
        conditions.name = new RegExp(transactionFilter.text, "i")
    }
    if (Object.keys(conditions).length === 0) {
        // last 30 days by default
        conditions.date = {
            $gte: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
        }
    }

    if (transactionFilter.accountId) {
        conditions.accountId = transactionFilter.accountId
    }

    transactionsCol
        .find(conditions, { sort: { date: -1 } })
        .toArray()
        .then(docs => {
            console.log(`${docs.length} transactions retrieved`)
            transactions.set(docs)
        })
}
