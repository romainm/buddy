import moment from "moment";

export function dateFormatter(cell) {
  let value = cell.getValue();

  if (value) {
    value = moment(value).format("DD/MM/YY");
  }

  return value;
}

export function moneyFormatter(cell) {
  let value = cell.getValue();
  if (value < 0) {
    cell.getElement().style.color = "red";
  } else {
    cell.getElement().style.color = "green";
    cell.getElement().style.fontWeight = "bold";
  }
  return toMoney(value);
}

export function toMoney(amount) {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function accountFormatter(cell, formatterParams) {
  let value = cell.getValue();
  if (value) {
    value = formatterParams.accountNameById[value];
  }

  return value;
}