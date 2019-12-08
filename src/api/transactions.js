
import { transactions, transactionSearch } from '../store/cache';
import { user, db } from '../stitch';
import { get } from 'svelte/store';

let lastSearchInput = null

function queryTransactions() {
    const transactionsCol = db.collection('transactions')
    console.log('query')

    const searchText = get(transactionSearch);
    let p
    if (searchText) {
        p = transactionsCol
            .find({"name": new RegExp(searchText, "i")}, {})
            .toArray()
    }
    else {
        // last 30 days by default
        p = transactionsCol
            .find({}, {})
            .toArray()
        p = transactionsCol
            .find( {
                "date": { 
                    $gte: new Date((new Date().getTime() - (90 * 24 * 60 * 60 * 1000)))
                }
            }, {})
            .toArray()
    }

    p.then(docs => {
        transactions.set(docs)
    })
}
export function updateTransactions(text) {
    console.log('.')
    // add a timer, accumulate changes every .5s
    if (get(user)) {
        // no active search, start timer
        if (lastSearchInput === null) {
            window.setTimeout(checkQueryTransactions, 1000)
        }
        const now = new Date()
        lastSearchInput = now;
    }
}

function checkQueryTransactions() {
    // last keystroke was a second ago, trigger query
    const now = new Date()
    const nbms = 500
    if (now - lastSearchInput > nbms) {
        lastSearchInput = null;
        queryTransactions()
    }
    // otherwise, just add a timer
    else{
        window.setTimeout(checkQueryTransactions, nbms - (now-lastSearchInput))
    }
}
