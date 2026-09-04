import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Plus, X, Check, Camera, ChevronDown, Share2, Locate,
  ZoomIn, ZoomOut, Clock, ShieldCheck, ThumbsUp, ThumbsDown,
  Milk, Wheat, Egg, Fuel, Droplet, LayoutGrid, Percent, Layers,
  Wallet, Tag, Minus, Compass, Sparkles
} from "lucide-react";

/* ---------------------------------- tokens ---------------------------------- */

const C = {
  bg: "#EFF3EC",
  page: "#DCE3D6",
  surface: "#FFFFFF",
  ink: "#1E2A22",
  inkSoft: "#5C6B60",
  inkFaint: "#8B978C",
  line: "#E3E9DE",
  brand: "#2F6E52",
  brandDark: "#1F4D39",
  brandSoft: "#E4EFE7",
  amber: "#E8A33D",
  amberSoft: "#FBF0DE",
  coral: "#E2574C",
  coralSoft: "#FBE7E4",
  grey: "#A9B2AB",
  greySoft: "#EEF1EC",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');";

/* ---------------------------------- data ---------------------------------- */

const PRICE_CATS = [
  { id: "all", label: "Все товары", icon: LayoutGrid, unit: "" },
  { id: "milk", label: "Молоко", icon: Milk, unit: "л" },
  { id: "bread", label: "Хлеб", icon: Wheat, unit: "шт" },
  { id: "eggs", label: "Яйца", icon: Egg, unit: "10 шт" },
  { id: "fuel", label: "Бензин АИ-95", icon: Fuel, unit: "л" },
  { id: "water", label: "Вода", icon: Droplet, unit: "1.5л" },
];

const PROMO_CATS = [
  { id: "all", label: "Все акции", icon: LayoutGrid },
  { id: "percent", label: "Скидка %", icon: Percent },
  { id: "twoforone", label: "2=1", icon: Layers },
  { id: "cashback", label: "Кэшбэк", icon: Wallet },
  { id: "sale", label: "Распродажа", icon: Tag },
];

const TYPE_LABEL = { shop: "Магазин", gas: "АЗС", cafe: "Кафе" };

// точки по городу Пермь
const PERM_CITY_POINTS = [
  {
    id: 1, name: "Пятёрочка на Компросе", brand: "Пятёрочка", type: "shop",
    address: "Комсомольский пр-т, 40", x: 27, y: 34,
    prices: [
      { id: "p1", cat: "milk", value: 88, unit: "л", mins: 12, confirms: 6, status: "active" },
      { id: "p2", cat: "bread", value: 44, unit: "шт", mins: 40, confirms: 3, status: "active" },
      { id: "p3", cat: "eggs", value: 108, unit: "10 шт", mins: 120, confirms: 2, status: "active" },
    ],
    promos: [
      { id: "m1", cat: "percent", title: "Скидка 20% на молочную продукцию", value: "−20%", until: "до 7 сент.", mins: 25, confirms: 5, status: "active" },
    ],
  },
  {
    id: 2, name: "Семья на Ленина", brand: "Семья", type: "shop",
    address: "ул. Ленина, 15", x: 53, y: 21,
    prices: [
      { id: "p4", cat: "milk", value: 91, unit: "л", mins: 55, confirms: 4, status: "active" },
      { id: "p5", cat: "bread", value: 40, unit: "шт", mins: 200, confirms: 2, status: "active" },
      { id: "p6", cat: "eggs", value: 103, unit: "10 шт", mins: 30, confirms: 7, status: "active" },
    ],
    promos: [
      { id: "m2", cat: "cashback", title: "Кэшбэк 10% картой «Семья»", value: "+10%", until: "до 30 сент.", mins: 70, confirms: 9, status: "active" },
    ],
  },
  {
    id: 3, name: "АЗС Лукойл", brand: "Лукойл", type: "gas",
    address: "Шоссе Космонавтов, 100", x: 71, y: 56,
    prices: [
      { id: "p7", cat: "fuel", value: 58.9, unit: "л", mins: 5, confirms: 11, status: "active" },
    ],
    promos: [],
  },
  {
    id: 4, name: "Виват на Куйбышева", brand: "Виват", type: "shop",
    address: "ул. Куйбышева, 95", x: 17, y: 61,
    prices: [
      { id: "p8", cat: "milk", value: 84, unit: "л", mins: 8, confirms: 8, status: "active" },
      { id: "p9", cat: "bread", value: 38, unit: "шт", mins: 15, confirms: 5, status: "active" },
      { id: "p10", cat: "water", value: 34, unit: "1.5л", mins: 90, confirms: 3, status: "active" },
    ],
    promos: [
      { id: "m3", cat: "sale", title: "Распродажа консервации −30%", value: "−30%", until: "до 10 сент.", mins: 18, confirms: 6, status: "active" },
    ],
  },
  {
    id: 5, name: "АЗС Газпромнефть", brand: "Газпромнефть", type: "gas",
    address: "ул. Героев Хасана, 105", x: 83, y: 31,
    prices: [
      { id: "p11", cat: "fuel", value: 60.4, unit: "л", mins: 33, confirms: 5, status: "active" },
    ],
    promos: [],
  },
  {
    id: 6, name: "Кофейня у ЦУМа", brand: "Кафе", type: "cafe",
    address: "ул. Ленина, 45", x: 41, y: 71,
    prices: [],
    promos: [
      { id: "m4", cat: "twoforone", title: "2 кофе по цене одного до 12:00", value: "2=1", until: "сегодня", mins: 9, confirms: 4, status: "active" },
    ],
  },
  {
    id: 7, name: "Добрыня на Крисанова", brand: "Добрыня", type: "shop",
    address: "ул. Крисанова, 12", x: 63, y: 76,
    prices: [
      { id: "p12", cat: "milk", value: 93, unit: "л", mins: 320, confirms: 1, status: "active" },
      { id: "p13", cat: "bread", value: 45, unit: "шт", mins: 260, confirms: 1, status: "active" },
    ],
    promos: [],
  },
];

// точки по Пермскому краю (районные города и трассы)
const PERM_KRAI_POINTS = [
  {
    id: 101, name: "Магнит в Краснокамске", brand: "Магнит", type: "shop",
    address: "г. Краснокамск, ул. Победы, 3", x: 22, y: 26,
    prices: [
      { id: "k1", cat: "milk", value: 90, unit: "л", mins: 40, confirms: 4, status: "active" },
      { id: "k2", cat: "bread", value: 42, unit: "шт", mins: 100, confirms: 2, status: "active" },
    ],
    promos: [],
  },
  {
    id: 102, name: "АЗС Лукойл — трасса Пермь–Березники", brand: "Лукойл", type: "gas",
    address: "а/д Пермь–Березники, 48 км", x: 58, y: 40,
    prices: [
      { id: "k3", cat: "fuel", value: 59.5, unit: "л", mins: 20, confirms: 7, status: "active" },
    ],
    promos: [],
  },
  {
    id: 103, name: "Пятёрочка в Чайковском", brand: "Пятёрочка", type: "shop",
    address: "г. Чайковский, ул. Ленина, 22", x: 74, y: 66,
    prices: [
      { id: "k4", cat: "milk", value: 87, unit: "л", mins: 15, confirms: 5, status: "active" },
    ],
    promos: [
      { id: "k5m", cat: "percent", title: "Скидка 15% на хлеб", value: "−15%", until: "до 9 сент.", mins: 30, confirms: 3, status: "active" },
    ],
  },
  {
    id: 104, name: "Магазин «Кунгурский»", brand: "Кунгурский", type: "shop",
    address: "г. Кунгур, ул. Свободы, 8", x: 30, y: 72,
    prices: [
      { id: "k6", cat: "eggs", value: 110, unit: "10 шт", mins: 200, confirms: 2, status: "active" },
    ],
    promos: [],
  },
  {
    id: 105, name: "АЗС Роснефть — трасса Пермь–Кунгур", brand: "Роснефть", type: "gas",
    address: "а/д Пермь–Кунгур, 15 км", x: 45, y: 18,
    prices: [
      { id: "k7", cat: "fuel", value: 60.9, unit: "л", mins: 60, confirms: 4, status: "active" },
    ],
    promos: [],
  },
];

const CITIES = ["Пермь", "Пермский край"];
const DATASET_BY_CITY = { "Пермь": PERM_CITY_POINTS, "Пермский край": PERM_KRAI_POINTS };

/* ---------------------------------- helpers ---------------------------------- */

function timeAgo(mins) {
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

function confidencePct(confirms) {
  return Math.min(96, 46 + confirms * 7);
}

function catIcon(list, id) {
  const found = list.find((c) => c.id === id);
  return found ? found.icon : Tag;
}
function catLabel(list, id) {
  const found = list.find((c) => c.id === id);
  return found ? found.label : id;
}

function avgPriceFor(cityPoints, cat) {
  const all = cityPoints.flatMap((p) => p.prices.filter((x) => x.cat === cat).map((x) => x.value));
  if (all.length === 0) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

// pin color per current mode/category
function pinTone(point, mode, category, cityPoints) {
  if (mode === "prices") {
    const entries = point.prices.filter((p) => p.status === "active" && (category === "all" || p.cat === category));
    if (entries.length === 0) return null;
    const stalest = Math.min(...entries.map((e) => e.mins));
    if (stalest > 180) return "grey";
    const cheapest = entries.some((e) => e.mins <= 180 && e.value <= avgPriceFor(cityPoints, e.cat) * 0.97);
    if (cheapest) return "brand";
    const pricey = entries.every((e) => e.value >= avgPriceFor(cityPoints, e.cat) * 1.03);
    if (pricey) return "coral";
    return "amber";
  }
  const entries = point.promos.filter((p) => p.status === "active" && (category === "all" || p.cat === category));
  if (entries.length === 0) return null;
  const freshest = Math.min(...entries.map((e) => e.mins));
  if (freshest < 60) return "brand";
  if (freshest < 240) return "amber";
  return "grey";
}

const TONE_HEX = { brand: C.brand, amber: C.amber, coral: C.coral, grey: C.grey };

/* ---------------------------------- small UI atoms ---------------------------------- */

function IconCircleButton({ onClick, children, size = 38, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center transition"
      style={{
        width: size, height: size, borderRadius: 999,
        background: C.surface, border: `1px solid ${C.line}`, color: C.ink,
      }}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 whitespace-nowrap transition"
      style={{
        borderRadius: 999,
        background: active ? C.brand : C.surface,
        color: active ? "#fff" : C.inkSoft,
        border: `1px solid ${active ? C.brand : C.line}`,
        fontFamily: "Manrope, sans-serif",
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {Icon ? <Icon size={15} strokeWidth={2.2} /> : null}
      {label}
    </button>
  );
}

function Pill({ children, tone = "brand" }) {
  const bg = tone === "brand" ? C.brandSoft : tone === "amber" ? C.amberSoft : tone === "coral" ? C.coralSoft : C.greySoft;
  const fg = tone === "brand" ? C.brandDark : tone === "amber" ? "#8A5C10" : tone === "coral" ? "#A5342B" : C.inkSoft;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5"
      style={{ background: bg, color: fg, borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: "Manrope, sans-serif" }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- map ---------------------------------- */

function MapBackground() {
  return (
    <svg viewBox="0 0 400 460" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="400" height="460" fill={C.bg} />
      <path d="M -20 120 C 80 90, 140 200, 260 150 S 420 210, 460 160 L 460 220 C 380 260, 300 190, 220 230 S 40 200, -20 250 Z" fill="#DCEAD9" opacity="0.9" />
      {[...Array(7)].map((_, i) => (
        <line key={"v" + i} x1={30 + i * 55} y1="0" x2={30 + i * 55} y2="460" stroke="#D9E1D2" strokeWidth="2" />
      ))}
      {[...Array(8)].map((_, i) => (
        <line key={"h" + i} x1="0" y1={20 + i * 58} x2="400" y2={20 + i * 58} stroke="#D9E1D2" strokeWidth="2" />
      ))}
      <rect x="60" y="60" width="70" height="50" rx="6" fill="#E7ECE2" />
      <rect x="200" y="280" width="90" height="60" rx="6" fill="#E7ECE2" />
      <rect x="280" y="90" width="60" height="80" rx="6" fill="#E7ECE2" />
      <rect x="40" y="300" width="80" height="40" rx="6" fill="#E7ECE2" />
    </svg>
  );
}

function Pin({ point, tone, active, onClick }) {
  const hex = TONE_HEX[tone];
  return (
    <button
      onClick={onClick}
      className="absolute flex items-center justify-center transition"
      style={{
        left: `${point.x}%`, top: `${point.y}%`,
        transform: `translate(-50%, -100%) scale(${active ? 1.18 : 1})`,
        zIndex: active ? 30 : 10,
      }}
      title={point.name}
    >
      <span className="flex flex-col items-center">
        <span
          className="flex items-center justify-center shadow-lg"
          style={{
            width: active ? 40 : 34, height: active ? 40 : 34, borderRadius: 999,
            background: hex, border: "3px solid #fff",
          }}
        >
          <MapPin size={active ? 18 : 15} color="#fff" strokeWidth={2.4} fill={hex} />
        </span>
        <span style={{ width: 2, height: 8, background: hex, marginTop: -1 }} />
      </span>
    </button>
  );
}

/* ---------------------------------- point sheet ---------------------------------- */

function PointSheet({ point, mode, onClose, onConfirm, onReport, onAddHere }) {
  if (!point) return null;
  const priceItems = point.prices;
  const promoItems = point.promos;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center" style={{ background: "rgba(20,26,20,0.42)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[420px] sm:rounded-3xl rounded-t-3xl overflow-hidden"
        style={{ background: C.surface, maxHeight: "84vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${C.line}` }}>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>{point.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1" style={{ fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: C.inkSoft }}>
              <span>{TYPE_LABEL[point.type]}</span><span>·</span><span>{point.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconCircleButton size={34} title="Поделиться"><Share2 size={15} /></IconCircleButton>
            <IconCircleButton size={34} title="Закрыть" onClick={onClose}><X size={16} /></IconCircleButton>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-4" style={{ flex: 1 }}>
          {priceItems.length > 0 && (
            <div className="mb-5">
              <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 12, color: C.inkFaint, letterSpacing: 0.3 }}>ЦЕНЫ ПО ОТМЕТКАМ ПОКУПАТЕЛЕЙ</div>
              <div className="flex flex-col gap-2">
                {priceItems.map((it) => {
                  const Icon = catIcon(PRICE_CATS, it.cat);
                  const stale = it.mins > 180;
                  return (
                    <div key={it.id} className="flex items-center gap-3 p-3" style={{ borderRadius: 16, background: stale ? C.greySoft : C.brandSoft, opacity: it.status === "reported" ? 0.5 : 1 }}>
                      <span className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, background: "#fff" }}>
                        <Icon size={16} color={C.ink} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13.5, color: C.ink }}>{catLabel(PRICE_CATS, it.cat)}</div>
                        <div className="flex items-center gap-1.5 mt-0.5" style={{ fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: C.inkSoft }}>
                          <Clock size={11} /> {timeAgo(it.mins)} <span>·</span> <ShieldCheck size={11} /> {confidencePct(it.confirms)}%
                        </div>
                      </div>
                      <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
                        {it.value}₽<span style={{ fontSize: 11, fontWeight: 500, color: C.inkSoft }}> /{it.unit}</span>
                      </div>
                      {it.status !== "reported" && (
                        <div className="flex flex-col gap-1 ml-1">
                          <button onClick={() => onConfirm(point.id, "prices", it.id)} title="Подтвердить" style={{ color: C.brand }}><ThumbsUp size={15} /></button>
                          <button onClick={() => onReport(point.id, "prices", it.id)} title="Неактуально" style={{ color: C.inkFaint }}><ThumbsDown size={15} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {promoItems.length > 0 && (
            <div>
              <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 12, color: C.inkFaint, letterSpacing: 0.3 }}>АКЦИИ И СКИДКИ</div>
              <div className="flex flex-col gap-2">
                {promoItems.map((it) => {
                  const Icon = catIcon(PROMO_CATS, it.cat);
                  return (
                    <div key={it.id} className="flex items-center gap-3 p-3" style={{ borderRadius: 16, background: C.coralSoft, opacity: it.status === "reported" ? 0.5 : 1 }}>
                      <span className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, background: "#fff" }}>
                        <Icon size={16} color={C.ink} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13.5, color: C.ink }}>{it.title}</div>
                        <div className="flex items-center gap-1.5 mt-0.5" style={{ fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: C.inkSoft }}>
                          <Clock size={11} /> {timeAgo(it.mins)} <span>·</span> {it.until} <span>·</span> <ShieldCheck size={11} /> {confidencePct(it.confirms)}%
                        </div>
                      </div>
                      <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 15, color: C.coral }}>{it.value}</div>
                      {it.status !== "reported" && (
                        <div className="flex flex-col gap-1 ml-1">
                          <button onClick={() => onConfirm(point.id, "promos", it.id)} title="Подтвердить" style={{ color: C.brand }}><ThumbsUp size={15} /></button>
                          <button onClick={() => onReport(point.id, "promos", it.id)} title="Неактуально" style={{ color: C.inkFaint }}><ThumbsDown size={15} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {priceItems.length === 0 && promoItems.length === 0 && (
            <div className="text-center py-8" style={{ color: C.inkFaint, fontFamily: "Manrope, sans-serif", fontSize: 13.5 }}>
              Пока никто не отмечал {mode === "prices" ? "цены" : "акции"} в этой точке.<br />Станьте первым!
            </div>
          )}
        </div>

        <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <button
            onClick={() => onAddHere(point.id)}
            className="w-full flex items-center justify-center gap-2 py-3"
            style={{ borderRadius: 16, background: C.brand, color: "#fff", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14.5 }}
          >
            <Plus size={17} /> {mode === "prices" ? "Отметить цену здесь" : "Добавить акцию здесь"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- add mark modal ---------------------------------- */

function AddMarkModal({ mode, points, pointId, onClose, onSubmit }) {
  const [step, setStep] = useState(pointId ? "form" : "pick");
  const [pickedId, setPickedId] = useState(pointId);
  const [product, setProduct] = useState(mode === "prices" ? "milk" : "percent");
  const [price, setPrice] = useState(89);
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("−15%");
  const [until, setUntil] = useState("неделя");
  const [photo, setPhoto] = useState(false);

  const point = points.find((p) => p.id === pickedId);
  const cats = mode === "prices" ? PRICE_CATS.filter((c) => c.id !== "all") : PROMO_CATS.filter((c) => c.id !== "all");

  function handlePick(id) {
    setPickedId(id);
    setStep("form");
  }

  function handleSubmit() {
    if (mode === "prices") {
      onSubmit(pickedId, {
        type: "prices",
        entry: { id: "new" + Date.now(), cat: product, value: Number(price), unit: cats.find((c) => c.id === product)?.unit || "", mins: 0, confirms: 1, status: "active" },
      });
    } else {
      onSubmit(pickedId, {
        type: "promos",
        entry: { id: "new" + Date.now(), cat: product, title: title || `Акция: ${catLabel(PROMO_CATS, product)}`, value: discount, until: `через ${until}`, mins: 0, confirms: 1, status: "active" },
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(20,26,20,0.5)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[420px] sm:rounded-3xl rounded-t-3xl overflow-hidden"
        style={{ background: C.surface, maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>
            {mode === "prices" ? "Отметить цену" : "Добавить акцию"}
          </span>
          <IconCircleButton size={32} onClick={onClose}><X size={15} /></IconCircleButton>
        </div>

        <div className="overflow-y-auto px-5 py-4" style={{ flex: 1 }}>
          {step === "pick" && (
            <div>
              <div className="mb-3" style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: C.inkSoft }}>
                Наведите на точку, где вы находитесь:
              </div>
              <div className="flex flex-col gap-2">
                {points.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePick(p.id)}
                    className="flex items-center gap-3 p-3 text-left"
                    style={{ borderRadius: 14, border: `1px solid ${C.line}` }}
                  >
                    <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: C.brandSoft }}>
                      <MapPin size={15} color={C.brand} />
                    </span>
                    <div>
                      <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13.5, color: C.ink }}>{p.name}</div>
                      <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: C.inkFaint }}>{p.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "form" && (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1" style={{ fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: C.inkFaint }}>
                  <MapPin size={13} /> {point ? point.name : "Точка не выбрана"}
                </div>
              </div>

              <div>
                <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}>
                  {mode === "prices" ? "Какой товар?" : "Тип акции"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <Chip key={c.id} active={product === c.id} onClick={() => setProduct(c.id)} icon={c.icon} label={c.label} />
                  ))}
                </div>
              </div>

              {mode === "prices" ? (
                <div>
                  <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}>Цена, ₽</div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPrice((v) => Math.max(1, v - 1))} className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 999, background: C.greySoft }}>
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="text-center"
                      style={{ width: 90, fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 22, border: `1px solid ${C.line}`, borderRadius: 12, padding: "8px 0", color: C.ink }}
                    />
                    <button onClick={() => setPrice((v) => Number(v) + 1)} className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 999, background: C.greySoft }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}>Что за акция?</div>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Например: скидка на молочку 20%"
                      style={{ width: "100%", fontFamily: "Manrope, sans-serif", fontSize: 13.5, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", color: C.ink }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div style={{ flex: 1 }}>
                      <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}>Выгода</div>
                      <input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        style={{ width: "100%", fontFamily: "Manrope, sans-serif", fontSize: 13.5, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", color: C.ink }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="mb-2" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}>Действует</div>
                      <select
                        value={until}
                        onChange={(e) => setUntil(e.target.value)}
                        style={{ width: "100%", fontFamily: "Manrope, sans-serif", fontSize: 13.5, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", color: C.ink }}
                      >
                        <option value="3 дня">3 дня</option>
                        <option value="неделя">неделю</option>
                        <option value="месяц">месяц</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => setPhoto((v) => !v)}
                className="flex items-center justify-center gap-2 py-3"
                style={{ borderRadius: 14, border: `1.5px dashed ${photo ? C.brand : C.line}`, background: photo ? C.brandSoft : "transparent", color: photo ? C.brandDark : C.inkSoft, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 13 }}
              >
                {photo ? <Check size={16} /> : <Camera size={16} />}
                {photo ? "Фото чека/ценника прикреплено" : "Прикрепить фото чека или ценника"}
              </button>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: C.inkFaint, marginTop: -12 }}>
                Необязательно, но отметки с фото вызывают больше доверия у соседей.
              </div>
            </div>
          )}
        </div>

        {step === "form" && (
          <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.line}` }}>
            <button
              onClick={handleSubmit}
              disabled={!pickedId}
              className="w-full flex items-center justify-center gap-2 py-3"
              style={{ borderRadius: 16, background: pickedId ? C.brand : C.grey, color: "#fff", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14.5 }}
            >
              Отправить отметку
            </button>
            <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 11, color: C.inkFaint, textAlign: "center", marginTop: 8 }}>
              Отметка анонимна и появится на карте сразу
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

export default function GdeSkidkaPrototype() {
  const [mode, setMode] = useState("prices");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("Пермь");
  const [cityOpen, setCityOpen] = useState(false);
  const [pointsByCity, setPointsByCity] = useState(DATASET_BY_CITY);
  const [selectedId, setSelectedId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addPointId, setAddPointId] = useState(null);
  const [listExpanded, setListExpanded] = useState(false);
  const [helped, setHelped] = useState(128);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    setCategory("all");
    setSelectedId(null);
  }, [mode, city]);

  function showToast(text) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const cats = mode === "prices" ? PRICE_CATS : PROMO_CATS;
  const cityPoints = pointsByCity[city];
  const visiblePoints = cityPoints.filter((p) => pinTone(p, mode, category, cityPoints) !== null);

  function updateCityPoints(updater) {
    setPointsByCity((prev) => ({ ...prev, [city]: updater(prev[city]) }));
  }

  function handleConfirm(pointId, kind, itemId) {
    updateCityPoints((prev) =>
      prev.map((p) => {
        if (p.id !== pointId) return p;
        return { ...p, [kind]: p[kind].map((it) => (it.id === itemId ? { ...it, mins: 0, confirms: it.confirms + 1 } : it)) };
      })
    );
    setHelped((h) => h + 1);
    showToast("Спасибо! Отметка обновлена 💚");
  }

  function handleReport(pointId, kind, itemId) {
    updateCityPoints((prev) =>
      prev.map((p) => {
        if (p.id !== pointId) return p;
        return { ...p, [kind]: p[kind].map((it) => (it.id === itemId ? { ...it, status: "reported" } : it)) };
      })
    );
    showToast("Приняли, проверим и уберём с карты");
  }

  function handleAddHere(pointId) {
    setSelectedId(null);
    setAddPointId(pointId);
    setAddOpen(true);
  }

  function handleOpenFab() {
    setAddPointId(null);
    setAddOpen(true);
  }

  function handleSubmitMark(pointId, payload) {
    updateCityPoints((prev) =>
      prev.map((p) => (p.id === pointId ? { ...p, [payload.type]: [payload.entry, ...p[payload.type]] } : p))
    );
    setHelped((h) => h + 1);
    setAddOpen(false);
    showToast(payload.type === "prices" ? "Цена добавлена на карту ✅" : "Акция добавлена на карту ✅");
    setSelectedId(pointId);
  }

  const selectedPoint = cityPoints.find((p) => p.id === selectedId) || null;

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center py-0 sm:py-8" style={{ background: C.page }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .gs-scroll::-webkit-scrollbar { display: none; }
        .gs-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        input:focus, select:focus { outline: 2px solid ${C.brand}; outline-offset: 1px; }
        button { font-family: inherit; cursor: pointer; }
      `}</style>

      <div
        className="w-full sm:w-[430px] relative overflow-hidden flex flex-col"
        style={{ background: C.bg, minHeight: "100vh", maxHeight: "100vh", boxShadow: "0 30px 80px rgba(20,30,20,0.25)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2" style={{ background: C.surface, borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 10, background: C.brand }}>
              <Sparkles size={17} color="#fff" />
            </span>
            <span style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 800, fontSize: 17, color: C.ink }}>ГдеСкидка</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="flex items-center gap-1 px-3 py-1.5"
              style={{ borderRadius: 999, background: C.greySoft, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: C.ink }}
            >
              {city} <ChevronDown size={13} />
            </button>
            <IconCircleButton size={34}><Share2 size={15} /></IconCircleButton>
          </div>
        </div>

        {cityOpen && (
          <div className="absolute right-4 z-40" style={{ top: 58, background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", overflow: "hidden" }}>
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c); setCityOpen(false); }}
                className="block w-full text-left px-4 py-2.5"
                style={{ fontFamily: "Manrope, sans-serif", fontSize: 13.5, color: c === city ? C.brand : C.ink, fontWeight: c === city ? 700 : 500, background: c === city ? C.brandSoft : "transparent" }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* mode toggle + counter */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ background: C.surface }}>
          <div className="flex p-1" style={{ background: C.greySoft, borderRadius: 999 }}>
            {[
              { id: "prices", label: "Цены" },
              { id: "promos", label: "Акции" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="px-4 py-1.5"
                style={{
                  borderRadius: 999,
                  background: mode === m.id ? C.brand : "transparent",
                  color: mode === m.id ? "#fff" : C.inkSoft,
                  fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Pill tone="brand"><ShieldCheck size={11} /> помогли {helped} раз сегодня</Pill>
        </div>

        {/* category chips */}
        <div className="gs-scroll flex gap-2 px-4 py-2.5 overflow-x-auto" style={{ background: C.surface, borderBottom: `1px solid ${C.line}` }}>
          {cats.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} icon={c.icon} label={c.label} />
          ))}
        </div>

        {/* map */}
        <div className="relative" style={{ flex: 1, minHeight: 260 }}>
          <MapBackground />
          {visiblePoints.map((p) => (
            <Pin key={p.id} point={p} tone={pinTone(p, mode, category, cityPoints)} active={selectedId === p.id} onClick={() => setSelectedId(p.id)} />
          ))}

          <div className="absolute flex flex-col gap-2" style={{ right: 12, top: 12, zIndex: 20 }}>
            <IconCircleButton size={34}><ZoomIn size={15} /></IconCircleButton>
            <IconCircleButton size={34}><ZoomOut size={15} /></IconCircleButton>
            <IconCircleButton size={34}><Locate size={15} /></IconCircleButton>
          </div>
          <div className="absolute flex items-center gap-1 px-2.5 py-1" style={{ left: 12, top: 12, zIndex: 20, background: "rgba(255,255,255,0.9)", borderRadius: 999, fontFamily: "Manrope, sans-serif", fontSize: 10.5, color: C.inkSoft }}>
            <Compass size={11} /> обновлено 2 мин назад
          </div>

          <div className="absolute flex items-center gap-3 px-3 py-1.5" style={{ left: 12, bottom: 12, zIndex: 20, background: "rgba(255,255,255,0.92)", borderRadius: 999 }}>
            {[
              { tone: "brand", label: mode === "prices" ? "Дешевле" : "Свежая" },
              { tone: "amber", label: mode === "prices" ? "Обычная" : "Есть акция" },
              { tone: "grey", label: "Устарело" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1" style={{ fontFamily: "Manrope, sans-serif", fontSize: 10.5, color: C.inkSoft }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: TONE_HEX[l.tone] }} /> {l.label}
              </span>
            ))}
          </div>

          {/* FAB */}
          <button
            onClick={handleOpenFab}
            className="absolute flex items-center gap-2 px-4 py-3"
            style={{ right: 14, bottom: listExpanded ? 240 : 128, zIndex: 25, background: C.brand, color: "#fff", borderRadius: 999, boxShadow: "0 10px 26px rgba(47,110,82,0.4)", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13.5 }}
          >
            <Plus size={17} /> Отметить
          </button>
        </div>

        {/* bottom sheet */}
        <div
          className="relative z-20"
          style={{
            background: C.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22,
            boxShadow: "0 -8px 24px rgba(20,30,20,0.08)", transition: "max-height 0.25s ease",
            maxHeight: listExpanded ? "48vh" : 116, overflow: "hidden",
          }}
        >
          <button onClick={() => setListExpanded((v) => !v)} className="w-full flex flex-col items-center pt-2 pb-1">
            <span style={{ width: 36, height: 4, borderRadius: 999, background: C.line }} />
          </button>
          <div className="flex items-center justify-between px-4 pb-2">
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 12.5, color: C.inkFaint }}>
              {city.toUpperCase()} · {visiblePoints.length} {visiblePoints.length === 1 ? "точка" : "точек"}
            </span>
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: C.brand, fontWeight: 700 }}>
              {listExpanded ? "Свернуть" : "Развернуть"}
            </span>
          </div>
          <div className="gs-scroll overflow-y-auto px-4 pb-4" style={{ maxHeight: listExpanded ? "40vh" : 60 }}>
            <div className="flex flex-col gap-2">
              {visiblePoints.length === 0 && (
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12.5, color: C.inkFaint, padding: "8px 0" }}>
                  Ничего не найдено — попробуйте другую категорию.
                </div>
              )}
              {visiblePoints.map((p) => {
                const tone = pinTone(p, mode, category, cityPoints);
                const list = mode === "prices" ? p.prices : p.promos;
                const best = list[0];
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="flex items-center gap-3 p-2.5 text-left"
                    style={{ borderRadius: 14, border: `1px solid ${C.line}` }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: TONE_HEX[tone], flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 11.5, color: C.inkFaint }}>{TYPE_LABEL[p.type]} · {timeAgo(best ? best.mins : 999)}</div>
                    </div>
                    {mode === "prices" && best && (
                      <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 14, color: C.ink }}>{best.value}₽</div>
                    )}
                    {mode === "promos" && best && (
                      <Pill tone="coral">{best.value}</Pill>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* toast */}
        {toast && (
          <div className="absolute left-1/2 z-50 px-4 py-2.5" style={{ bottom: 18, transform: "translateX(-50%)", background: C.ink, color: "#fff", borderRadius: 999, fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 12.5, boxShadow: "0 10px 24px rgba(0,0,0,0.25)", whiteSpace: "nowrap" }}>
            {toast}
          </div>
        )}
      </div>

      {selectedPoint && (
        <PointSheet
          point={selectedPoint}
          mode={mode}
          onClose={() => setSelectedId(null)}
          onConfirm={handleConfirm}
          onReport={handleReport}
          onAddHere={handleAddHere}
        />
      )}

      {addOpen && (
        <AddMarkModal
          mode={mode}
          points={cityPoints}
          pointId={addPointId}
          onClose={() => setAddOpen(false)}
          onSubmit={handleSubmitMark}
        />
      )}
    </div>
  );
}
