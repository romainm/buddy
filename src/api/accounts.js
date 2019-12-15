
import { accounts } from '../store/cache';
import { db } from '../stitch';

export function updateAccounts() {
    const collection = db.collection('accounts')

    collection
        .find({}, {})
        .toArray()
        .then(docs => {
            accounts.set(docs)
        })
}