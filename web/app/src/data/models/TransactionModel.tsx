import { ClientModel } from "./Clients.tsx";

export interface CollectionDetails {
  amount: number;
  name: string;
  GLCode?: string;
  objectCode?: string;
  accountCode?: string;
  responsibilityCode?: string;
  objectDescription?: string;
  mfoPap?: string;
}

export interface TransactionDetails {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cashierId: string;
  clientId?: string;
  studentRefNumber?: string;
  refNumber?: string;
  collections: CollectionDetails[];
  clientDetails?: ClientModel;
  history: TransactionDetails[];
  paymentMethod: string;
}
