import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrderContext } from '../context/OrderContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/useToast';
import { Plus, Package } from 'lucide-react';

const OrderForm: React.FC = () => {
  const { user } = useAuth();
  const { createOrder } = useOrderContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    spaName: '',
    address: '',
    productName: '',
    quantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.spaName || !formData.address || !formData.productName || !formData.quantity) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: 'Error',
        description: 'Quantity must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    if (!user) return;

    createOrder({
      spaName: formData.spaName,
      address: formData.address,
      productName: formData.productName,
      quantity,
      salespersonId: user.id,
      distributorId: user.distributorId || null,
    });

    setFormData({
      spaName: '',
      address: '',
      productName: '',
      quantity: '',
    });

    toast({
      title: 'Success',
      description: 'Order created successfully',
    });
  };

  const getDistributorName = () => {
    if (!user?.distributorId) return 'No distributor assigned';
    // This would ideally come from context, but for now we'll use a simple lookup
    const distributors = {
      1: 'Jordan Lee',
      2: 'Sam Chen',
    };
    return distributors[user.distributorId as keyof typeof distributors] || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Order
        </CardTitle>
        <CardDescription>
          Create a new order for your spa/salon client
          {user?.distributorId && (
            <span className="block mt-1 text-blue-600">
              Orders will be assigned to: {getDistributorName()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spaName">Spa/Salon Name *</Label>
              <Input
                id="spaName"
                value={formData.spaName}
                onChange={(e) => setFormData({ ...formData, spaName: e.target.value })}
                placeholder="Enter spa or salon name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter delivery address"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Package className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;