
-- Allow anonymous users to insert customers during checkout
CREATE POLICY "Allow anonymous insert on customers" ON public.customers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert orders during checkout
CREATE POLICY "Allow anonymous insert on orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert order items during checkout
CREATE POLICY "Allow anonymous insert on order_items" ON public.order_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
