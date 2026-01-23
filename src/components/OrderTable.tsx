import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrderContext } from '../context/OrderContext';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Eye } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';

interface OrderTableProps {
  orders: any[];
  showActions?: boolean;
  showPaymentActions?: boolean;
  showSalesperson?: boolean;
  onStatusUpdate?: (orderId: string, status: 'Pending' | 'Dispatched' | 'Delivered') => void;
  onPaymentUpdate?: (orderId: string, status: 'Unpaid' | 'Paid') => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  showActions = false, 
  showPaymentActions = false,
  showSalesperson = false,
  onStatusUpdate,
  onPaymentUpdate 
}) => {
  const { users } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Dispatched: 'bg-blue-100 text-blue-800',
      Delivered: 'bg-green-100 text-green-800',
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants = {
      Paid: 'bg-green-100 text-green-800',
      Unpaid: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getSalespersonName = (salespersonId: number) => {
    const salesperson = users?.find(u => u.id === salespersonId);
    return salesperson?.name || 'Unknown';
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            {showSalesperson && <TableHead>Salesperson</TableHead>}
            <TableHead>Spa/Salon</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            {showPaymentActions && <TableHead>Payment</TableHead>}
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">#{order.id.slice(-8)}</TableCell>
              {showSalesperson && (
                <TableCell>{getSalespersonName(order.salespersonId)}</TableCell>
              )}
              <TableCell>{order.spaName}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                {showActions ? (
                  <Select
                    value={order.status}
                    onValueChange={(value: 'Pending' | 'Dispatched' | 'Delivered') =>
                      onStatusUpdate?.(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Dispatched">Dispatched</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(order.status)
                )}
              </TableCell>
              {showPaymentActions && (
                <TableCell>
                  <Select
                    value={order.paymentStatus}
                    onValueChange={(value: 'Unpaid' | 'Paid') =>
                      onPaymentUpdate?.(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default OrderTable;