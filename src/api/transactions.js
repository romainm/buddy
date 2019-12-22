import { transactions, transactionFilter } from "../store/cache"
import { db } from "../stitch"

export function updateTransactions(filter_) {
    console.log(`filter is ${filter_}`)
    filter_ = filter_ === undefined ? transactionFilter : filter_
    console.log(filter_)
    const transactionsCol = db.collection("transactions")

    const conditions = {}
    if (filter_.text) {
        conditions.name = new RegExp(filter_.text, "i")
    }
    if (Object.keys(conditions).length === 0) {
        // last 30 days by default
        conditions.date = {
            $gte: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
        }
    }

    if (filter_.accountId) {
        conditions.accountId = filter_.accountId
    }

    transactionsCol
        .find(conditions, { sort: { date: -1 } })
        .toArray()
        .then(docs => {
            console.log(`${docs.length} transactions retrieved`)
            transactions.set(docs)
        })
}
