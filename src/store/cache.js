
import { writable } from 'svelte/store';

export const accounts = writable([]);
export const transactions = writable([]);
export const transactionFilter = writable({
    text: "",
    accountId: "",
})