import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrderContext } from '../../context/OrderContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrderContext();
  const { toast } = useToast();

  // For demo, show all orders to distributor
  const assignedOrders = orders || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Package className="w-4 h-4" />;
      case 'Dispatched':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Dispatched';
      case 'Dispatched':
        return 'Delivered';
      default:
        return currentStatus;
    }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      await updateOrderStatus(orderId, nextStatus as any);
      toast({
        title: 'Success',
        description: `Order status updated to ${nextStatus}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage order deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedOrders.filter(o => o.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispatched</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedOrders.filter(o => o.status === 'Dispatched').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedOrders.filter(o => o.status === 'Delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders to Deliver</CardTitle>
          <CardDescription>Manage order status updates</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders assigned</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      <p className="font-medium">{order.spa_name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{order.product_name} - {order.quantity} units</p>
                    <p className="text-xs text-gray-500">{order.address}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>
                      {order.status}
                    </Badge>
                    <Badge variant={order.payment_status === 'Paid' ? 'default' : 'secondary'}>
                      {order.payment_status}
                    </Badge>
                    {order.status !== 'Delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                      >
                        Mark {getNextStatus(order.status)}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorDashboard;