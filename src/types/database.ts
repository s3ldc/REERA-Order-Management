export interface DatabaseUser {
  id: string;
  email: string;
  role: 'salesperson' | 'distributor' | 'admin';
  name: string;
  distributor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: string;
  spa_name: string;
  address: string;
  product_name: string;
  quantity: number;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  payment_status: 'Unpaid' | 'Paid';
  salesperson_id: string;
  distributor_id?: string;
  created_at: string;
  updated_at: string;
}

export type User = DatabaseUser;
export type Order = DatabaseOrder;