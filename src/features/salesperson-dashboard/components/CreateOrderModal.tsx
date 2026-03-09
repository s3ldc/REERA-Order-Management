import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { X } from "lucide-react";

import type { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  distributors: any[];
  formData: {
    spa_name: string;
    address: string;
    product_name: string;
    quantity: number;
    distributor_id: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const CreateOrderModal: React.FC<Props> = ({
  distributors,
  formData,
  setFormData,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl">

        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6 px-8">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              New Order Entry
            </CardTitle>

            <CardDescription>
              Fill in the client and product requirements
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label>Spa/Salon Name</Label>

                <Input
                  value={formData.spa_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      spa_name: e.target.value,
                    })
                  }
                  placeholder="Zen Retreat"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>

                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Street, City"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Product</Label>

                <Input
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_name: e.target.value,
                    })
                  }
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>

                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Assign Distributor</Label>

                <select
                  value={formData.distributor_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      distributor_id: e.target.value,
                    })
                  }
                  className="w-full border border-border rounded-xl px-4 h-11 bg-background text-sm"
                  required
                >
                  <option value="">Choose a distributor</option>

                  {distributors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-bold"
              >
                Confirm Order
              </Button>
            </div>

          </form>
        </CardContent>

      </Card>
    </div>
  );
};

export default CreateOrderModal;