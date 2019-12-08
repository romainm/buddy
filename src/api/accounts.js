
import { accounts } from '../store/cache';
import { db } from '../stitch';

export function updateAccounts() {
    const collection = db.collection('accounts')
    console.log('query accounts')

    collection
        .find({}, {})
        .toArray()
        .then(docs => {
            console.log('docs')
            console.log(docs)
            accounts.set(docs)
        })
}