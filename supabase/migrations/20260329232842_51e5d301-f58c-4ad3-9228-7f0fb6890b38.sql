
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  discount_text text NOT NULL,
  badge_label text DEFAULT 'SALE',
  bg_color text DEFAULT '#3B82F6',
  text_color text DEFAULT '#FFFFFF',
  placement text NOT NULL DEFAULT 'hero',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/products',
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  starts_at timestamp with time zone DEFAULT now(),
  ends_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage offers" ON public.offers
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Offers publicly readable" ON public.offers
FOR SELECT TO public
USING (true);

-- Seed sample offers
INSERT INTO public.offers (title, subtitle, discount_text, badge_label, bg_color, placement, priority) VALUES
('Summer Collection', 'Limited time only', 'UP TO 50% OFF', 'HOT DEAL', '#EF4444', 'hero', 10),
('Free Shipping', 'On orders above ৳2000', 'FREE DELIVERY', 'OFFER', '#8B5CF6', 'top_banner', 20),
('New Arrivals', 'Check out the latest designs', 'FLAT 20% OFF', 'NEW', '#F59E0B', 'sidebar', 5),
('Bundle & Save', 'Buy 3 T-shirts get 1 free', 'BUY 3 GET 1', 'COMBO', '#10B981', 'product_page', 8);
