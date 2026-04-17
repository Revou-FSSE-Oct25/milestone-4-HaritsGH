export type Account = {
  id: number;
  genId: string;
  owner: string;
  name: string;
  balance: number;
};

export type AccountResponse = {
  message: string;
  data: Account[];
};
