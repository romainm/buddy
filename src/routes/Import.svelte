
<input id="import-file" type="file" on:input={readIt} multiple/>
<button on:click={recordTransactions}>Record Transactions</button>
<TransactionTable transactions={transactions_import}/>


<script>
import TransactionTable from '../components/TransactionTable.svelte'
import moment from 'moment';
import { db } from '../firebase';
import { User } from '../stores/user';

let transactions_import = [];
let accounts = []

const readIt = async function(event) {
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
                    currentStatement = {index, import: true};
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
    importData.transactions.sort((a,b) => b.date - a.date);
    transactions_import = importData.transactions

    accounts = [...importData.accountById.values()]
}

const recordTransactions = function() {
    let batch = db.batch()

    accounts.forEach(doc => {
        const safeDoc = {
            type: doc.type,
        }
        batch.set($User.doc.collection('accounts').doc(doc.id), safeDoc, {merge: true})
    })
    transactions_import.forEach((doc) => {
        const safeDoc = {
            name: doc.name,
            date: doc.date,
            amount: doc.amount,
            fitid: doc.fitid,
            accountId: doc.accountId,
            keywords: buildKeywords(doc),
        }
        batch.set($User.doc.collection('transactions').doc(), safeDoc)
    })
    batch.commit()
}

function buildKeywords(transaction) {
    let keywords = transaction.name.split(' ');
    keywords = keywords.map(name => name.toLowerCase())

    const namesToSkip = ['to']
    namesToSkip.forEach(name => {
        const index = keywords.indexOf(name);
        if (index > -1) {
            keywords.splice(index, 1);
        }
    })
    // return new Map(keywords.map(k => [k, true]));
    keywords = keywords.filter(entry => entry.trim() != '')
    keywords = keywords.reduce((o, key) => ({ ...o, [key]: true}), {})
    return keywords;
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