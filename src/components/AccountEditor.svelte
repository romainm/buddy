<script>
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Form,
    Input,
    Label,
    InputGroup
  } from "sveltestrap";
  import { db } from '../stitch';
  import { updateAccounts } from '../api/accounts';

  export let account = null;

  let accountLabel
  let accountBalance
  let accountBalanceDate

  $: if (account != null) {
    initValues()
  }

  function initValues(){
    accountLabel = account.label? account.label: ""
    accountBalance = account.balance? account.balance: 0
    accountBalanceDate = moment().format("YYYY-MM-DD")

    if (account.balanceDate) {
      accountBalanceDate = moment(account.balanceDate).format("YYYY-MM-DD")
    }
  }

  function saveChanges() {
    const values = {
      label: accountLabel
    };
    if (isValidBalance(accountBalance)) {
      values.balance = accountBalance;
      values.balanceDate = convertToDate(accountBalanceDate);
    }
    const collection = db.collection('accounts')
    collection
        .updateOne(
            {'_id': account._id},
            { $set: values})
        .then(() => updateAccounts())
        .catch(err => console.log(`failed to update account: ${err}`));

    account = null;
  }

  function discardChanges() {
    account = null;
  }

  function isValidBalance(balance) {
    const test = +balance;
    return !isNaN(test)
  }

  function convertToDate(date) {
    const d = moment(date, 'DD/MM/YYYY');
    if (!d.isValid()) {
      return new Date()
    }
    return d.toDate()
  }

</script>

<style>
  .input-group-addon {
    background-color: #ccc;
    padding: 5px 10px;
    border-radius: 10px 0px 0px 10px;
  }
</style>

<Modal isOpen={account != null}>
  <ModalHeader>Account {account.id}</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label for="label">Label</Label>
        <Input type="text" bind:value={accountLabel} readonly={false} />
      </FormGroup>
      <FormGroup>
        <Label for="balance">Balance</Label>
        <InputGroup>
          <span class="input-group-addon">$</span>
          <Input type="text" bind:value={accountBalance} />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label for="balanceDate">Balance Date</Label>
        <Input type="date" bind:value={accountBalanceDate} />
      </FormGroup>
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={saveChanges}>Save</Button>
    <Button color="secondary" on:click={discardChanges}>Cancel</Button>
  </ModalFooter>
</Modal>
