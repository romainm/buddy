
<h1>import</h1>
<input id="import-file" type="file" on:input={readIt} multiple/>
<button 
    disabled={recordButtonDisabled}
    on:click={recordTransactions}>
    Record Transactions
</button>
<TransactionTable transactions={transactionsToImport}/>


<script>
import TransactionTable from '../components/TransactionTable.svelte'
import { updateTransactions } from '../api/transactions';
import { updateAccounts } from '../api/accounts';
import moment from 'moment';
import { user, db } from '../stitch';
import { accounts, transactionFilter } from '../store/cache';

let transactionsToImport = []
let accountsToImport = []
let nbTransactionsToCheck = 0

$: recordButtonDisabled = (
    transactionsToImport.length === 0 
 || nbTransactionsToCheck > 0
)

$: console.log(`${nbTransactionsToCheck} transactions to check`)

const readIt = async function(event) {
    console.log($user)
    let importData = {
        transactions: [],
        accountById: new Map(),
        balance: {
            amount: 0,
            date: null,
        }

    };
    let index = 0;
    for(let i=0; i < event.target.files.length; i++) {
        let data = await readFile(event.target.files[i]);
        const ofx = data.split('<OFX>', 2);
        const content = ofx[1].split(/\r?\n/);
        const key_value_re = /<([^>]+)>(.*)/;
        let currentStatement;
        let bankId, accountId, accountType;
        let fullAccountId = null;
        for (const element of content) {
            let reObj = key_value_re.exec(element);
            if (reObj != null) {
            const key = reObj[1];
            const val = reObj[2];
            switch (key) {
                case "BANKID":
                    bankId = val;
                    break;
                case "ACCTID":
                    accountId = val;
                    break;
                case "ACCTTYPE":
                    accountType = val;
                    break;
                case "/BANKACCTFROM":
                    fullAccountId = `${bankId}-${accountId}`;
                    if (! importData.accountById.has(fullAccountId)) {
                    importData.accountById.set(fullAccountId, {
                        id: fullAccountId,
                        type: accountType
                    });
                    }
                    break;
                case "STMTTRN":
                    currentStatement = {index, exists: false};
                    if (fullAccountId) {
                    currentStatement.accountId = fullAccountId;
                    }
                    index += 1;
                    break;
                case "/STMTTRN":
                importData.transactions.push(currentStatement);
                currentStatement = {};
                break;
                case "TRNAMT":
                currentStatement['amount'] = parseFloat(val);
                break;
                case "DTPOSTED":
                currentStatement['date'] = moment(val, "YYYYMMDD").toDate();
                break;
                case "MEMO":
                currentStatement['name'] = val;
                break;
                case "FITID":
                currentStatement['fitid'] = val;
                break;
                }
            }
        };

    }
    // sort by date desc
    importData.transactions.sort((a,b) => b.date - a.date)
    transactionsToImport = importData.transactions

    accountsToImport = [...importData.accountById.values()]

    // check transactions to see if they have already been recorded
    nbTransactionsToCheck = transactionsToImport.length
    checkAlreadyRecordedTransactions()
}

async function checkAlreadyRecordedTransactions() {
    const transactionsCol = db.collection('transactions')
    for (let i=0; i < transactionsToImport.length; i++) {
        const t = transactionsToImport[i]
        const dbt = {
            owner_id: $user.id,
            name: t.name,
            date: t.date,
            amount: t.amount,
            fitId: t.fitid,
            accountId: t.accountId
        }
        
        transactionsCol
            .find(dbt, {"limit": 1})
            .first()
            .then(doc => {
                if (doc) {
                    console.log(`found existing one (${i}): ${doc.name}`)
                    transactionsToImport[i].exists = true
                }
                nbTransactionsToCheck -= 1
            })
    }
}

const recordTransactions = function() {
    const accountsCol = db.collection('accounts')
    const transactionsCol = db.collection('transactions')

    const existingAccountIds = $accounts.map(
        account => account.id
    )

    // only record accounts that we don't have already
    let safeAccounts = [];
    accountsToImport.forEach( account => {
        if (existingAccountIds.indexOf(account.id) === -1) {
            safeAccounts.push({
                owner_id: $user.id,
                id: account.id,
                type: account.type,
            })
        }
    })

    console.log(`${transactionsToImport.length} original transactions`)
    transactionsToImport = transactionsToImport.filter(t => ! t.exists)
    console.log(`${transactionsToImport.length} to import`)
    if (transactionsToImport.length === 0) {
        console.log("nothing to import.")
        return
    }

    const safeTransactions = transactionsToImport.map(doc => {
        return {
            owner_id: $user.id,
            name: doc.name,
            date: doc.date,
            amount: doc.amount,
            fitId: doc.fitid,
            accountId: doc.accountId
        }
    })

    if (safeAccounts.length > 0) {
        accountsCol.insertMany(safeAccounts)
            .then( () => updateAccounts())
            .catch(
                err => console.log(`failed to insert accounts: ${err}`)
            )
    }
    transactionsCol.insertMany(safeTransactions)
        .then( () => updateTransactions($transactionFilter))
        .catch(
        err => console.error(`Failed to insert documents: ${err}`)
    )

    transactionsToImport = []
    accountsToImport = []

}

const readFile = function(f) {
    return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function(e) {resolve(e.target.result)};
    reader.onerror = function(e) {reject(new Error(e.target.result))};
    reader.readAsText(f);
    })
}

</script>