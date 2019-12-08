
<Form>
    <FormGroup>
        <Input plaintext placeholder="Search for transactions / category"
            type="search"
            name="search"
            id="exampleSearch"
            bind:value={$transactionSearch}
            readonly={false}
        />
    </FormGroup>
</Form>

<script>
import { Form, FormGroup, FormText, Input, Label } from 'sveltestrap';
import { transactionSearch } from '../store/cache';
</script>