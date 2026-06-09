"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCheckoutAction } from "@/lib/actions/booking";

export function CheckoutForm({
  eventSlug,
  maxQuantity,
}: {
  eventSlug: string;
  maxQuantity: number;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const quantity = Number(formData.get("quantity"));
    const result = await createCheckoutAction(eventSlug, quantity);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Number of tickets</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={maxQuantity}
          defaultValue={1}
          required
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Redirecting to Stripe..." : "Proceed to Payment"}
      </Button>
    </form>
  );
}
