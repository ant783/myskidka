import React, { useState, useRef } from 'react';
import {
  Plus, X, Check, Camera, Share2,
  ThumbsUp, ThumbsDown, Milk, Wheat, Egg, Fuel, Droplet,
  LayoutGrid, Percent, Layers, Wallet, Tag, Minus, Sparkles
} from 'lucide-react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

// ---------------------------------- Неоновая тёмная тема ----------------------------------
const C = {
  bg: "#0B0E1A",
  page: "#0F131F",
  surface: "#161E2E",
  ink: "#E8EDF5",
  inkSoft: "#9AA9C0",
  inkFaint: "#5A6A7E",
  line: "#2A3344",
  brand: "#00D4FF",
  brandDark: "#0099CC",
  brandSoft: "#0A2A3A",
  amber: "#FBBF24",
  amberSoft: "#2A2410",
  coral: "#FF5E7A",
  coralSoft: "#2A1016",
  grey: "#3A4A5E",
  greySoft: "#1E2638",
};

// ---------------------------------- Категории ----------------------------------
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

// ----- Только Пермь, только Пятёрочка (реальные адреса) -----
const PERM_PYATEROCHKA_POINTS = [
  {
    id: 1,
    name: "Пятёрочка на Компросе",
    brand: "Пятёрочка",
    type: "shop",
    address: "Комсомольский пр-т, 40",
    lat: 58.006,
    lng: 56.237,
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
    id: 2,
    name: "Пятёрочка на Ленина",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Ленина, 15",
    lat: 58.017,
    lng: 56.258,
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
    id: 3,
    name: "Пятёрочка на Ушакова",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Ушакова, 55/2",
    lat: 58.004,
    lng: 56.228,
    prices: [
      { id: "p7", cat: "milk", value: 89, unit: "л", mins: 30, confirms: 5, status: "active" },
      { id: "p8", cat: "bread", value: 42, unit: "шт", mins: 45, confirms: 4, status: "active" },
    ],
    promos: [],
  },
  {
    id: 4,
    name: "Пятёрочка на Сеченова",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Сеченова, 9",
    lat: 58.010,
    lng: 56.270,
    prices: [
      { id: "p9", cat: "milk", value: 87, unit: "л", mins: 20, confirms: 7, status: "active" },
      { id: "p10", cat: "bread", value: 39, unit: "шт", mins: 25, confirms: 6, status: "active" },
    ],
    promos: [],
  },
  {
    id: 5,
    name: "Пятёрочка на Маяковского",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Маяковского, 8",
    lat: 58.014,
    lng: 56.252,
    prices: [
      { id: "p11", cat: "milk", value: 90, unit: "л", mins: 15, confirms: 8, status: "active" },
      { id: "p12", cat: "bread", value: 41, unit: "шт", mins: 18, confirms: 5, status: "active" },
    ],
    promos: [],
  },
  {
    id: 6,
    name: "Пятёрочка на Островского",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Николая Островского, 74",
    lat: 58.020,
    lng: 56.245,
    prices: [
      { id: "p13", cat: "milk", value: 92, unit: "л", mins: 10, confirms: 9, status: "active" },
      { id: "p14", cat: "bread", value: 43, unit: "шт", mins: 12, confirms: 7, status: "active" },
    ],
    promos: [],
  },
  {
    id: 7,
    name: "Пятёрочка на Стахановской",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Стахановская, 44",
    lat: 58.025,
    lng: 56.260,
    prices: [
      { id: "p15", cat: "milk", value: 86, unit: "л", mins: 40, confirms: 4, status: "active" },
      { id: "p16", cat: "bread", value: 38, unit: "шт", mins: 35, confirms: 3, status: "active" },
    ],
    promos: [],
  },
  {
    id: 8,
    name: "Пятёрочка на Веденеева",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Академика Веденеева, 31/1",
    lat: 58.008,
    lng: 56.240,
    prices: [
      { id: "p17", cat: "milk", value: 88, unit: "л", mins: 25, confirms: 6, status: "active" },
      { id: "p18", cat: "bread", value: 40, unit: "шт", mins: 28, confirms: 5, status: "active" },
    ],
    promos: [],
  },
  {
    id: 9,
    name: "Пятёрочка на Барбюса",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Анри Барбюса, 47",
    lat: 58.030,
    lng: 56.306,
    prices: [
      { id: "p19", cat: "milk", value: 85, unit: "л", mins: 50, confirms: 3, status: "active" },
      { id: "p20", cat: "bread", value: 37, unit: "шт", mins: 55, confirms: 2, status: "active" },
    ],
    promos: [],
  },
  {
    id: 10,
    name: "Пятёрочка на Подлесной",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Подлесная, 2А",
    lat: 58.012,
    lng: 56.215,
    prices: [
      { id: "p21", cat: "milk", value: 89, unit: "л", mins: 35, confirms: 5, status: "active" },
      { id: "p22", cat: "bread", value: 41, unit: "шт", mins: 38, confirms: 4, status: "active" },
    ],
    promos: [],
  },
  {
    id: 11,
    name: "Пятёрочка на Гайвинском",
    brand: "Пятёрочка",
    type: "shop",
    address: "2-й Гайвинский переулок, 1",
    lat: 58.018,
    lng: 56.232,
    prices: [
      { id: "p23", cat: "milk", value: 87, unit: "л", mins: 22, confirms: 6, status: "active" },
      { id: "p24", cat: "bread", value: 39, unit: "шт", mins: 26, confirms: 5, status: "active" },
    ],
    promos: [],
  },
  {
    id: 12,
    name: "Пятёрочка на Широкой",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Широкая, 2А",
    lat: 58.005,
    lng: 56.225,
    prices: [
      { id: "p25", cat: "milk", value: 90, unit: "л", mins: 18, confirms: 7, status: "active" },
      { id: "p26", cat: "bread", value: 42, unit: "шт", mins: 20, confirms: 6, status: "active" },
    ],
    promos: [],
  },
  {
    id: 13,
    name: "Пятёрочка на Рабочей",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Рабочая, 9Б",
    lat: 58.015,
    lng: 56.248,
    prices: [
      { id: "p27", cat: "milk", value: 88, unit: "л", mins: 30, confirms: 4, status: "active" },
      { id: "p28", cat: "bread", value: 40, unit: "шт", mins: 32, confirms: 3, status: "active" },
    ],
    promos: [],
  },
  {
    id: 14,
    name: "Пятёрочка на Клары Цеткин",
    brand: "Пятёрочка",
    type: "shop",
    address: "ул. Клары Цеткин, 436",
    lat: 58.011,
    lng: 56.242,
    prices: [
      { id: "p29", cat: "milk", value: 86, unit: "л", mins: 45, confirms: 4, status: "active" },
      { id: "p30", cat: "bread", value: 38, unit: "шт", mins: 48, confirms: 3, status: "active" },
    ],
    promos: [],
  },
];

// ---------------------------------- helpers ----------------------------------
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

function avgPriceFor(points, cat) {
  const all = points.flatMap((p) =>
    p.prices.filter((x) => x.cat === cat).map((x) => x.value)
  );
  if (all.length === 0) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

function pinTone(point, mode, category, points) {
  if (mode === "prices") {
    const entries = point.prices.filter(
      (p) => p.status === "active" && (category === "all" || p.cat === category)
    );
    if (entries.length === 0) return null;
    const stalest = Math.min(...entries.map((e) => e.mins));
    if (stalest > 180) return "grey";
    const cheapest = entries.some(
      (e) => e.mins <= 180 && e.value <= avgPriceFor(points, e.cat) * 0.97
    );
    if (cheapest) return "brand";
    const pricey = entries.every(
      (e) => e.value >= avgPriceFor(points, e.cat) * 1.03
    );
    if (pricey) return "coral";
    return "amber";
  }
  const entries = point.promos.filter(
    (p) => p.status === "active" && (category === "all" || p.cat === category)
  );
  if (entries.length === 0) return null;
  const freshest = Math.min(...entries.map((e) => e.mins));
  if (freshest < 60) return "brand";
  if (freshest < 240) return "amber";
  return "grey";
}

const TONE_HEX = {
  brand: C.brand,
  amber: C.amber,
  coral: C.coral,
  grey: C.grey,
};

// ---------------------------------- компоненты ----------------------------------
function IconCircleButton({ onClick, children, size = 38, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.surface,
        border: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: C.ink,
        transition: "background 0.15s, box-shadow 0.15s",
        boxShadow: "0 0 8px rgba(0,212,255,0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.brandSoft;
        e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.surface;
        e.currentTarget.style.boxShadow = "0 0 8px rgba(0,212,255,0.1)";
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
      style={{
        padding: "6px 14px",
        borderRadius: 30,
        border: `1.5px solid ${active ? C.brand : C.line}`,
        background: active ? C.brandSoft : "transparent",
        color: active ? C.brand : C.inkSoft,
        fontFamily: "Manrope, sans-serif",
        fontWeight: 600,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transition: "all 0.15s, box-shadow 0.15s",
        whiteSpace: "nowrap",
        boxShadow: active ? "0 0 20px rgba(0,212,255,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = C.brand;
          e.currentTarget.style.color = C.brand;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = C.line;
          e.currentTarget.style.color = C.inkSoft;
        }
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

function PointSheet({ point, mode, onClose, onConfirm, onReport, onAddHere }) {
  if (!point) return null;
  const priceItems = point.prices;
  const promoItems = point.promos;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: "24px 24px 0 0",
        overflow: "hidden",
        background: C.surface,
        maxHeight: "84vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(0,212,255,0.15)",
        borderTop: `1px solid ${C.brand}`,
      }}
    >
      <div
        style={{
          padding: "18px 20px 12px 20px",
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18, color: C.brand }}>
            {point.name}
          </div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>
            {TYPE_LABEL[point.type]} · {point.address}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: C.inkSoft,
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "16px 20px 20px 20px", overflowY: "auto", flex: 1 }}>
        {priceItems.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.brand, marginBottom: 10 }}>
              Цены по отметкам покупателей
            </div>
            {priceItems.map((it) => {
              const Icon = catIcon(PRICE_CATS, it.cat);
              const stale = it.mins > 180;
              return (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: stale ? C.greySoft : "transparent",
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <Icon size={18} color={C.inkSoft} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>
                      {catLabel(PRICE_CATS, it.cat)}
                    </div>
                    <div style={{ fontSize: 11, color: C.inkFaint }}>
                      {timeAgo(it.mins)} · {confidencePct(it.confirms)}% достоверности
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>
                    {it.value}₽ /{it.unit}
                  </div>
                  {it.status !== "reported" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => onConfirm(point.id, "prices", it.id)}
                        title="Подтвердить"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: C.brand,
                          padding: 4,
                        }}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <button
                        onClick={() => onReport(point.id, "prices", it.id)}
                        title="Неактуально"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: C.inkFaint,
                          padding: 4,
                        }}
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {promoItems.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.brand, marginBottom: 10 }}>
              Акции и скидки
            </div>
            {promoItems.map((it) => {
              const Icon = catIcon(PROMO_CATS, it.cat);
              return (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: C.amberSoft,
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <Icon size={18} color={C.amber} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>
                      {it.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.inkFaint }}>
                      {timeAgo(it.mins)} · {it.until} · {confidencePct(it.confirms)}%
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.coral }}>
                    {it.value}
                  </div>
                  {it.status !== "reported" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => onConfirm(point.id, "promos", it.id)}
                        title="Подтвердить"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: C.brand,
                          padding: 4,
                        }}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <button
                        onClick={() => onReport(point.id, "promos", it.id)}
                        title="Неактуально"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: C.inkFaint,
                          padding: 4,
                        }}
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {priceItems.length === 0 && promoItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "30px 20px",
              color: C.inkSoft,
              background: C.greySoft,
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 14 }}>
              Пока никто не отмечал {mode === "prices" ? "цены" : "акции"} в этой точке.
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Станьте первым!</div>
          </div>
        )}

        <button
          onClick={() => onAddHere(point.id)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 0",
            borderRadius: 16,
            background: C.brand,
            color: "#fff",
            border: "none",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
            cursor: "pointer",
            marginTop: 12,
            transition: "opacity 0.15s, box-shadow 0.15s",
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = 0.85;
            e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,255,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)";
          }}
        >
          {mode === "prices" ? "Отметить цену здесь" : "Добавить акцию здесь"}
        </button>
      </div>
    </div>
  );
}

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
  const cats = mode === "prices"
    ? PRICE_CATS.filter((c) => c.id !== "all")
    : PROMO_CATS.filter((c) => c.id !== "all");

  function handlePick(id) {
    setPickedId(id);
    setStep("form");
  }

  function handleSubmit() {
    if (mode === "prices") {
      onSubmit(pickedId, {
        type: "prices",
        entry: {
          id: "new" + Date.now(),
          cat: product,
          value: Number(price),
          unit: cats.find((c) => c.id === product)?.unit || "",
          mins: 0,
          confirms: 1,
          status: "active",
        },
      });
    } else {
      onSubmit(pickedId, {
        type: "promos",
        entry: {
          id: "new" + Date.now(),
          cat: product,
          title: title || `Акция: ${catLabel(PROMO_CATS, product)}`,
          value: discount,
          until: `через ${until}`,
          mins: 0,
          confirms: 1,
          status: "active",
        },
      });
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          background: C.surface,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -8px 40px rgba(0,212,255,0.15)",
          borderTop: `1px solid ${C.brand}`,
        }}
      >
        <div
          style={{
            padding: "18px 20px 12px 20px",
            borderBottom: `1px solid ${C.line}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18, color: C.brand }}>
            {mode === "prices" ? "Отметить цену" : "Добавить акцию"}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: C.inkSoft,
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "16px 20px 20px 20px", overflowY: "auto", flex: 1 }}>
          {step === "pick" && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 12 }}>
                Наведите на точку, где вы находитесь:
              </div>
              {points.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePick(p.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    padding: "12px 16px",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 14,
                    border: `1px solid ${C.line}`,
                    background: "transparent",
                    cursor: "pointer",
                    marginBottom: 8,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.greySoft)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: C.inkSoft }}>{p.address}</div>
                </button>
              ))}
            </div>
          )}

          {step === "form" && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 12 }}>
                {point ? point.name : "Точка не выбрана"}
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 8 }}>
                {mode === "prices" ? "Какой товар?" : "Тип акции"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {cats.map((c) => (
                  <Chip
                    key={c.id}
                    active={product === c.id}
                    onClick={() => setProduct(c.id)}
                    icon={c.icon}
                    label={c.label}
                  />
                ))}
              </div>

              {mode === "prices" ? (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>
                    Цена, ₽
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setPrice((v) => Math.max(1, v - 1))}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: C.greySoft,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.ink,
                      }}
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      style={{
                        width: 90,
                        textAlign: "center",
                        fontFamily: "Unbounded, sans-serif",
                        fontWeight: 700,
                        fontSize: 22,
                        border: `1px solid ${C.line}`,
                        borderRadius: 12,
                        padding: "8px 0",
                        color: C.ink,
                        outline: "none",
                        background: C.bg,
                      }}
                    />
                    <button
                      onClick={() => setPrice((v) => Number(v) + 1)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: C.greySoft,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.ink,
                      }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>
                    Что за акция?
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: скидка на молочку 20%"
                    style={{
                      width: "100%",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 13.5,
                      border: `1px solid ${C.line}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      color: C.ink,
                      outline: "none",
                      background: C.bg,
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>
                    Выгода
                  </div>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{
                      width: "100%",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 13.5,
                      border: `1px solid ${C.line}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      color: C.ink,
                      outline: "none",
                      background: C.bg,
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>
                    Действует
                  </div>
                  <select
                    value={until}
                    onChange={(e) => setUntil(e.target.value)}
                    style={{
                      width: "100%",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 13.5,
                      border: `1px solid ${C.line}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      color: C.ink,
                      outline: "none",
                      background: C.bg,
                      marginBottom: 12,
                    }}
                  >
                    <option value="3 дня">3 дня</option>
                    <option value="неделю">неделю</option>
                    <option value="месяц">месяц</option>
                  </select>
                </>
              )}

              <button
                onClick={() => setPhoto((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 0",
                  borderRadius: 14,
                  border: `1.5px dashed ${photo ? C.brand : C.line}`,
                  background: photo ? C.brandSoft : "transparent",
                  color: photo ? C.brand : C.inkSoft,
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  marginBottom: 8,
                }}
              >
                {photo ? <Check size={18} /> : <Camera size={18} />}
                {photo ? "Фото чека/ценника прикреплено" : "Прикрепить фото чека или ценника"}
              </button>
              <div style={{ fontSize: 12, color: C.inkFaint, textAlign: "center", marginBottom: 16 }}>
                Необязательно, но отметки с фото вызывают больше доверия у соседей.
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 16,
                  background: C.brand,
                  color: "#fff",
                  border: "none",
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "opacity 0.15s, box-shadow 0.15s",
                  boxShadow: "0 0 20px rgba(0,212,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = 0.85;
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = 1;
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)";
                }}
              >
                Отправить отметку
              </button>
              <div style={{ fontSize: 12, color: C.inkFaint, textAlign: "center", marginTop: 8 }}>
                Отметка анонимна и появится на карте сразу
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------- App ----------------------------------
export default function GdeSkidkaPrototype() {
  const [mode, setMode] = useState("prices");
  const [category, setCategory] = useState("all");
  const [points, setPoints] = useState(PERM_PYATEROCHKA_POINTS);
  const [selectedId, setSelectedId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addPointId, setAddPointId] = useState(null);
  const [listExpanded, setListExpanded] = useState(false);
  const [helped, setHelped] = useState(128);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(text) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const cats = mode === "prices" ? PRICE_CATS : PROMO_CATS;
  const visiblePoints = points.filter(
    (p) => pinTone(p, mode, category, points) !== null
  );

  function updatePoints(updater) {
    setPoints(updater);
  }

  function handleConfirm(pointId, kind, itemId) {
    updatePoints((prev) =>
      prev.map((p) => {
        if (p.id !== pointId) return p;
        return {
          ...p,
          [kind]: p[kind].map((it) =>
            it.id === itemId ? { ...it, mins: 0, confirms: it.confirms + 1 } : it
          ),
        };
      })
    );
    setHelped((h) => h + 1);
    showToast("Спасибо! Отметка обновлена ✅");
  }

  function handleReport(pointId, kind, itemId) {
    updatePoints((prev) =>
      prev.map((p) => {
        if (p.id !== pointId) return p;
        return {
          ...p,
          [kind]: p[kind].map((it) =>
            it.id === itemId ? { ...it, status: "reported" } : it
          ),
        };
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
    updatePoints((prev) =>
      prev.map((p) =>
        p.id === pointId
          ? { ...p, [payload.type]: [payload.entry, ...p[payload.type]] }
          : p
      )
    );
    setHelped((h) => h + 1);
    setAddOpen(false);
    showToast(
      payload.type === "prices"
        ? "Цена добавлена на карту ✅"
        : "Акция добавлена на карту ✅"
    );
    setSelectedId(pointId);
  }

  const selectedPoint = points.find((p) => p.id === selectedId) || null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Manrope, sans-serif",
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px 20px",
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: C.brand,
              borderRadius: 12,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "Unbounded, sans-serif",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}
          >
            ₽
          </div>
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18 }}>
            Где<span style={{ color: C.brand, textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>Скидка</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.inkSoft, fontSize: 12, background: C.greySoft, padding: "4px 12px", borderRadius: 30 }}>
            Пермь
          </span>
          <IconCircleButton onClick={() => {}} title="Поделиться" size={36}>
            <Share2 size={18} />
          </IconCircleButton>
        </div>
      </div>

      {/* Mode Toggle */}
      <div
        style={{
          padding: "12px 20px 8px 20px",
          display: "flex",
          gap: 8,
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <button
          onClick={() => setMode("prices")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 30,
            border: "none",
            background: mode === "prices" ? C.brand : "transparent",
            color: mode === "prices" ? "#000" : C.inkSoft,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: mode === "prices" ? "0 0 20px rgba(0,212,255,0.3)" : "none",
          }}
        >
          Цены
        </button>
        <button
          onClick={() => setMode("promos")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 30,
            border: "none",
            background: mode === "promos" ? C.brand : "transparent",
            color: mode === "promos" ? "#000" : C.inkSoft,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: mode === "promos" ? "0 0 20px rgba(0,212,255,0.3)" : "none",
          }}
        >
          Акции
        </button>
      </div>

      {/* Category Chips */}
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          background: C.surface,
          borderBottom: `1px solid ${C.line}`,
          flexShrink: 0,
        }}
      >
        {cats.map((c) => (
          <Chip
            key={c.id}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
            icon={c.icon}
            label={c.label}
          />
        ))}
      </div>

      {/* Карта */}
      <div style={{ width: '100%', height: '50vh', minHeight: '300px', maxHeight: '600px', background: '#0F131F', border: `1px solid ${C.line}`, borderRadius: 12, overflow: 'hidden', margin: '8px 0' }}>
        <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY || 'ваш_ключ_заглушка' }}>
          <Map
            state={{ center: [58.010, 56.250], zoom: 12 }}
            width="100%"
            height="100%"
          >
            {visiblePoints.map((p) => (
              <Placemark
                key={p.id}
                geometry={[p.lat, p.lng]}
                onClick={() => setSelectedId(p.id)}
                properties={{
                  balloonContent: `<div style="color:#000"><strong>${p.name}</strong><br/>${p.address}</div>`
                }}
                options={{
                  preset: 'islands#blueCircleDotIconWithCaption',
                  iconColor: '#00D4FF'
                }}
              />
            ))}
          </Map>
        </YMaps>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px 4px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={16} color={C.brand} style={{ filter: "drop-shadow(0 0 6px #00D4FF)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
            {helped} отметок помогли соседям
          </span>
        </div>
        <button
          onClick={() => setListExpanded(!listExpanded)}
          style={{
            background: "none",
            border: "none",
            color: C.brand,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "Manrope, sans-serif",
            textShadow: "0 0 10px rgba(0,212,255,0.2)",
          }}
        >
          {listExpanded ? "Свернуть" : "Развернуть"}
        </button>
      </div>

      {/* List */}
      {listExpanded && (
        <div
          style={{
            padding: "0 20px 16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {visiblePoints.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: C.surface,
                borderRadius: 16,
                border: `1px solid ${selectedId === p.id ? C.brand : C.line}`,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "border 0.15s, box-shadow 0.15s",
                boxShadow: selectedId === p.id ? "0 0 20px rgba(0,212,255,0.15)" : "none",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: TONE_HEX[pinTone(p, mode, category, points)] || C.grey,
                  flexShrink: 0,
                  boxShadow: "0 0 10px rgba(0,212,255,0.2)",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.inkSoft }}>{p.address}</div>
              </div>
              <div style={{ fontSize: 12, color: C.inkFaint, flexShrink: 0 }}>
                {p.prices.length + p.promos.length} отметок
              </div>
            </button>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={handleOpenFab}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          background: C.brand,
          color: "#000",
          border: "none",
          borderRadius: 60,
          padding: "16px 24px",
          fontFamily: "Unbounded, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 0 30px rgba(0,212,255,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 50,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 0 50px rgba(0,212,255,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(0,212,255,0.4)";
        }}
      >
        <Plus size={22} /> Добавить
      </button>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.surface,
            color: C.ink,
            padding: "12px 24px",
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 0 40px rgba(0,212,255,0.2)",
            border: `1px solid ${C.brand}`,
            zIndex: 60,
            whiteSpace: "nowrap",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}

      {/* Point Sheet */}
      {selectedPoint && (
        <div
          onClick={() => setSelectedId(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 40,
            padding: 20,
          }}
        >
          <PointSheet
            point={selectedPoint}
            mode={mode}
            onClose={() => setSelectedId(null)}
            onConfirm={handleConfirm}
            onReport={handleReport}
            onAddHere={handleAddHere}
          />
        </div>
      )}

      {/* Add Modal */}
      {addOpen && (
        <AddMarkModal
          mode={mode}
          points={points}
          pointId={addPointId}
          onClose={() => setAddOpen(false)}
          onSubmit={handleSubmitMark}
        />
      )}
    </div>
  );
}
