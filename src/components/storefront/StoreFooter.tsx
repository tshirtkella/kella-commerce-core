import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";

const StoreFooter = () => (
  <footer className="bg-foreground text-background mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shirt className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">T-Shirt Kella</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">
            Your go-to destination for premium quality t-shirts and apparel. Style meets comfort.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-60">
            <li><Link to="/shop" className="hover:opacity-100 transition">Shop All</Link></li>
            <li><Link to="/categories" className="hover:opacity-100 transition">Categories</Link></li>
            <li><Link to="/" className="hover:opacity-100 transition">New Arrivals</Link></li>
            <li><Link to="/" className="hover:opacity-100 transition">Sale</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-heading font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm opacity-60">
            <li><Link to="/support" className="hover:opacity-100 transition">Contact Us</Link></li>
            <li><Link to="/support" className="hover:opacity-100 transition">FAQs</Link></li>
            <li><Link to="/about-us" className="hover:opacity-100 transition">About Us</Link></li>
            <li><Link to="/support" className="hover:opacity-100 transition">Shipping & Returns</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-heading font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm opacity-60 mb-3">Get the latest offers and new arrivals.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm placeholder:text-white/40 border border-white/10 focus:outline-none focus:border-primary"
            />
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm opacity-40">
        © {new Date().getFullYear()} T-Shirt Kella. All rights reserved.
      </div>
    </div>
  </footer>
);

export default StoreFooter;
