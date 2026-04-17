export type Transaction = {
  id: number,
  txType: string,
  amount: number,
  account: string,
  transferTo?: string,
  doneAt: Date,
}

export type TransanctionResponse = {
  message: string;
  data: Transaction[];
}