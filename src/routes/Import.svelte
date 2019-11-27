
<input id="import-file" type="file" on:input={readIt} multiple/>
<button on:click={recordTransactions}>Record Transactions</button>
<div id="transactions-table"></div>



<script>
import Tabulator from 'tabulator-tables';
import { onMount } from 'svelte';
import moment from 'moment';
import { db } from '../firebase';

let transactions_import = [];
let accounts = []

onMount(() => {
    const table = new Tabulator("#transactions-table", {
        data: transactions_import,
        reactiveData:true,
        layout:"fitData",
        columns:[
            {title:"Date", field:"date", align:"center", width:110, editable:false},
            {title:"Account", field:"accountId", width:200, editable:false},
            {title:"Amount", field:"amount", width:130, align: "right", editable:false},
            {title:"Name", field:"name", minWidth:300, editable:false},
        ],
    });
});

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
    transactions_import.push(...importData.transactions)

    accounts = [...importData.accountById.values()]
}

const recordTransactions = function() {
    let batch = db.batch()

    accounts.forEach(doc => {
        const safeDoc = {
            type: doc.type,
        }
        batch.set(db.collection('accounts').doc(doc.id), safeDoc, {merge: true})
    })
    transactions_import.forEach((doc) => {
        const safeDoc = {
            name: doc.name,
            date: doc.date,
            amount: doc.amount,
            fitid: doc.fitid,
            accountId: doc.accountId
        }
        batch.set(db.collection('transactions').doc(), safeDoc)
    })
    batch.commit()
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