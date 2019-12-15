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

  let accountLabel= ''
  let accountBalance=0
  let accountBalanceDate=''

  $: if (account != null) {
    accountLabel = account.label? account.label: accountLabel;
    accountBalance = account.balance? account.balance: account.balance;
    accountBalanceDate = account.balanceDate? account.balanceDate: accountBalanceDate;
  }

  function saveChanges() {
    const values = {
      label: accountLabel
    };
    if (isValidBalance(accountBalance) && isValidDate(accountBalanceDate)) {
      values.balance = accountBalance;
      values.balanceDate = accountBalanceDate;
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
    return false
  }

  function isValidDate(date) {
    return false
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
