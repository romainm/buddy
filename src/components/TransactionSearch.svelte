
<Form>
    <FormGroup>
        <Input plaintext placeholder="Search for transactions / category"
            type="search"
            name="search"
            id="exampleSearch"
            bind:value={searchText}
            readonly={false}
        />
    </FormGroup>
</Form>

<script>
import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
import { transactionFilter } from '../store/cache';
import { get } from 'svelte/store';
import { user } from '../stitch';

let searchText = ""
let lastSearchInput = null

function updateTransactionFilter(text) {
    console.log(`filter changed to ${text}`)
    // add a timer, accumulate changes every .5s
    if (get(user)) {
        // no active search, start timer
        if (lastSearchInput === null) {
            window.setTimeout(_onUpdateTransactionFilter, 1000)
        }
        const now = new Date()
        lastSearchInput = now;
    }
}

function _onUpdateTransactionFilter() {
    // last keystroke was a second ago, trigger query
    const now = new Date()
    const nbms = 500
    if (now - lastSearchInput > nbms) {
        lastSearchInput = null;
        transactionFilter.update(f => {
            f.text = searchText
            return f
        })
    }
    // otherwise, just add a timer
    else{
        window.setTimeout(_onUpdateTransactionFilter, nbms - (now-lastSearchInput))
    }
}

$: updateTransactionFilter(searchText)

</script>