import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  BDT: { symbol: "৳", name: "Bangladeshi Taka" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  PKR: { symbol: "₨", name: "Pakistani Rupee" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  TRY: { symbol: "₺", name: "Turkish Lira" },
};

export const useCurrency = () => {
  const { data: currencyCode = "BDT" } = useQuery({
    queryKey: ["store-currency"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("store_settings")
        .select("value")
        .eq("key", "currency")
        .maybeSingle();
      return data?.value || "BDT";
    },
    staleTime: 60_000,
  });

  const info = CURRENCIES[currencyCode] || CURRENCIES.BDT;

  const format = (amount: number) => `${info.symbol}${amount.toFixed(2)}`;

  return { code: currencyCode, symbol: info.symbol, name: info.name, format };
};
