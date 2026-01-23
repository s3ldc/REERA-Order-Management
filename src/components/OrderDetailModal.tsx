import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrderContext } from '../context/OrderContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { users } = useAuth();
  const { updateOrderStatus } = useOrderContext();

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
    const user = users?.find(u => u.id === salespersonId);
    return user?.name || 'Unknown';
  };

  const getDistributorName = (distributorId: number | null) => {
    if (!distributorId) return 'Not Assigned';
    const distributor = users?.find(u => u.id === distributorId && u.role === 'distributor');
    return distributor?.name || 'Unknown';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader onClose={onClose}>
          <div>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{order.id.slice(-8)}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-slate-700">Spa/Salon</h4>
              <p className="text-slate-900">{order.spaName}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Address</h4>
              <p className="text-slate-900">{order.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Product</h4>
              <p className="text-slate-900">{order.productName}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Quantity</h4>
              <p className="text-slate-900">{order.quantity}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Salesperson</h4>
              <p className="text-slate-900">{getSalespersonName(order.salespersonId)}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Distributor</h4>
              <p className="text-slate-900">{getDistributorName(order.distributorId)}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Created Date</h4>
              <p className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Status</h4>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
            <div>
              <h4 className="font-medium text-slate-700">Payment Status</h4>
              <div className="mt-1">{getPaymentBadge(order.paymentStatus)}</div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;