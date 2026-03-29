import { Link } from "react-router-dom";
import type { Offer } from "@/hooks/useOffers";

export const TopBanner = ({ offer }: { offer: Offer }) => (
  <div
    className="py-2.5 px-4 flex items-center justify-center gap-3 text-sm"
    style={{ backgroundColor: offer.bg_color || "#3B82F6", color: offer.text_color || "#FFF" }}
  >
    {offer.badge_label && (
      <span className="text-[10px] font-bold bg-white/20 rounded px-2 py-0.5 tracking-wider">
        {offer.badge_label}
      </span>
    )}
    <span className="font-bold">{offer.discount_text}</span>
    <span className="opacity-60 hidden sm:inline">—</span>
    <span className="hidden sm:inline">{offer.title}</span>
    {offer.cta_text && offer.cta_link && (
      <Link to={offer.cta_link} className="underline font-medium ml-1 hover:opacity-80 transition">
        {offer.cta_text} →
      </Link>
    )}
  </div>
);

export const HeroBanner = ({ offer }: { offer: Offer }) => (
  <div
    className="relative rounded-2xl overflow-hidden"
    style={{ backgroundColor: offer.bg_color || "#3B82F6", color: offer.text_color || "#FFF" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
    {/* Decorative circles */}
    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
    <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-left max-w-lg">
        {offer.badge_label && (
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            {offer.badge_label}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-bold leading-tight font-heading">
          {offer.discount_text}
        </h2>
        <p className="text-xl md:text-2xl font-medium mt-2 opacity-90">{offer.title}</p>
        {offer.subtitle && <p className="text-base mt-2 opacity-70">{offer.subtitle}</p>}
        {offer.cta_text && offer.cta_link && (
          <Link
            to={offer.cta_link}
            className="inline-block mt-6 px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm font-semibold hover:bg-white/30 transition-all hover:scale-105"
          >
            {offer.cta_text}
          </Link>
        )}
      </div>
      <div className="text-7xl md:text-8xl font-bold opacity-10 font-heading select-none hidden md:block">
        {offer.discount_text.split(" ").pop()}
      </div>
    </div>
  </div>
);

export const SidebarCard = ({ offer }: { offer: Offer }) => (
  <div
    className="rounded-xl p-5 relative overflow-hidden"
    style={{ backgroundColor: offer.bg_color || "#3B82F6", color: offer.text_color || "#FFF" }}
  >
    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
    <div className="relative z-10">
      {offer.badge_label && (
        <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 rounded px-2 py-0.5">
          {offer.badge_label}
        </span>
      )}
      <p className="text-xl font-bold mt-2 leading-tight">{offer.discount_text}</p>
      <p className="text-sm font-medium mt-1">{offer.title}</p>
      {offer.subtitle && <p className="text-xs opacity-75 mt-1">{offer.subtitle}</p>}
      {offer.cta_text && offer.cta_link && (
        <Link to={offer.cta_link} className="inline-block mt-3 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition">
          {offer.cta_text} →
        </Link>
      )}
    </div>
  </div>
);

export const InlinePromo = ({ offer }: { offer: Offer }) => (
  <div
    className="rounded-xl p-6 flex items-center justify-between gap-4"
    style={{ backgroundColor: offer.bg_color || "#3B82F6", color: offer.text_color || "#FFF" }}
  >
    <div className="flex items-center gap-4">
      {offer.badge_label && (
        <span className="text-xs font-bold bg-white/20 rounded-full px-3 py-1 shrink-0">
          {offer.badge_label}
        </span>
      )}
      <div>
        <span className="font-bold text-lg">{offer.discount_text}</span>
        <span className="ml-2 opacity-80">{offer.title}</span>
      </div>
    </div>
    {offer.cta_text && offer.cta_link && (
      <Link
        to={offer.cta_link}
        className="shrink-0 px-5 py-2 rounded-full bg-white/20 text-sm font-semibold hover:bg-white/30 transition"
      >
        {offer.cta_text}
      </Link>
    )}
  </div>
);
