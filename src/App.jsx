import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, X, Check, Camera, ChevronDown, Share2,
  ThumbsUp, ThumbsDown, Milk, Wheat, Egg, Fuel, Droplet,
  LayoutGrid, Percent, Layers, Wallet, Tag, Minus, Sparkles
} from 'lucide-react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

// ---------------------------------- tokens ----------------------------------
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

// ---------------------------------- data ----------------------------------
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

const PERM_CITY_POINTS = [
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
    name: "Семья на Ленина",
    brand: "Семья",
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
    name: "АЗС Лукойл",
    brand: "Лукойл",
    type: "gas",
    address: "Шоссе Космонавтов, 100",
    lat: 58.035,
    lng: 56.275,
    prices: [
      { id: "p7", cat: "fuel", value: 58.9, unit: "л", mins: 5, confirms: 11, status: "active" },
    ],
    promos: [],
  },
  {
    id: 4,
    name: "Виват на Куйбышева",
    brand: "Виват",
    type: "shop",
    address: "ул. Куйбышева, 95",
    lat: 58.009,
    lng: 56.220,
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
    id: 5,
    name: "АЗС Газпромнефть",
    brand: "Газпромнефть",
    type: "gas",
    address: "ул. Героев Хасана, 105",
    lat: 58.027,
    lng: 56.280,
    prices: [
      { id: "p11", cat: "fuel", value: 60.4, unit: "л", mins: 33, confirms: 5, status: "active" },
    ],
    promos: [],
  },
  {
    id: 6,
    name: "Кофейня у ЦУМа",
    brand: "Кафе",
    type: "cafe",
    address: "ул. Ленина, 45",
    lat: 58.013,
    lng: 56.245,
    prices: [],
    promos: [
      { id: "m4", cat: "twoforone", title: "2 кофе по цене одного до 12:00", value: "2=1", until: "сегодня", mins: 9, confirms: 4, status: "active" },
    ],
  },
  {
    id: 7,
    name: "Добрыня на Крисанова",
    brand: "Добрыня",
    type: "shop",
    address: "ул. Крисанова, 12",
    lat: 58.022,
    lng: 56.267,
    prices: [
      { id: "p12", cat: "milk", value: 93, unit: "л", mins: 320, confirms: 1, status: "active" },
      { id: "p13", cat: "bread", value: 45, unit: "шт", mins: 260, confirms: 1, status: "active" },
    ],
    promos: [],
  },
];

const PERM_KRAI_POINTS = [
  {
    id: 101,
    name: "Магнит в Краснокамске",
    brand: "Магнит",
    type: "shop",
    address: "г. Краснокамск, ул. Победы, 3",
    lat: 58.082,
    lng: 55.755,
    prices: [
      { id: "k1", cat: "milk", value: 90, unit: "л", mins: 40, confirms: 4, status: "active" },
      { id: "k2", cat: "bread", value: 42, unit: "шт", mins: 100, confirms: 2, status: "active" },
    ],
    promos: [],
  },
  {
    id: 102,
    name: "АЗС Лукойл — трасса Пермь–Березники",
    brand: "Лукойл",
    type: "gas",
    address: "а/д Пермь–Березники, 48 км",
    lat: 58.150,
    lng: 56.000,
    prices: [
      { id: "k3", cat: "fuel", value: 59.5, unit: "л", mins: 20, confirms: 7, status: "active" },
    ],
    promos: [],
  },
  {
    id: 103,
    name: "Пятёрочка в Чайковском",
    brand: "Пятёрочка",
    type: "shop",
    address: "г. Чайковский, ул. Ленина, 22",
    lat: 56.778,
    lng: 54.114,
    prices: [
      { id: "k4", cat: "milk", value: 87, unit: "л", mins: 15, confirms: 5, status: "active" },
    ],
    promos: [
      { id: "k5m", cat: "percent", title: "Скидка 15% на хлеб", value: "−15%", until: "до 9 сент.", mins: 30, confirms: 3, status: "active" },
    ],
  },
  {
    id: 104,
    name: "Магазин «Кунгурский»",
    brand: "Кунгурский",
    type: "shop",
    address: "г. Кунгур, ул. Свободы, 8",
    lat: 57.428,
    lng: 56.959,
    prices: [
      { id: "k6", cat: "eggs", value: 110, unit: "10 шт", mins: 200, confirms: 2, status: "active" },
    ],
    promos: [],
  },
  {
    id: 105,
    name: "АЗС Роснефть — трасса Пермь–Кунгур",
    brand: "Роснефть",
    type: "gas",
    address: "а/д Пермь–Кунгур, 15 км",
    lat: 57.850,
    lng: 56.500,
    prices: [
      { id: "k7", cat: "fuel", value: 60.9, unit: "л", mins: 60, confirms: 4, status: "active" },
    ],
    promos: [],
  },
];

const CITIES = ["Пермь", "Пермский край"];
const DATASET_BY_CITY = {
  "Пермь": PERM_CITY_POINTS,
  "Пермский край": PERM_KRAI_POINTS,
};

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

function avgPriceFor(cityPoints, cat) {
  const all = cityPoints.flatMap((p) =>
    p.prices.filter((x) => x.cat === cat).map((x) => x.value)
  );
  if (all.length === 0) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

function pinTone(point, mode, category, cityPoints) {
  if (mode === "prices") {
    const entries = point.prices.filter(
      (p) => p.status === "active" && (category === "all" || p.cat === category)
    );
    if (entries.length === 0) return null;
    const stalest = Math.min(...entries.map((e) => e.mins));
    if (stalest > 180) return "grey";
    const cheapest = entries.some(
      (e) => e.mins <= 180 && e.value <= avgPriceFor(cityPoints, e.cat) * 0.97
    );
    if (cheapest) return "brand";
    const pricey = entries.every(
      (e) => e.value >= avgPriceFor(cityPoints, e.cat) * 1.03
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

// ---------------------------------- components ----------------------------------
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
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.greySoft)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}
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
        color: active ? C.brandDark : C.inkSoft,
        fontFamily: "Manrope, sans-serif",
        fontWeight: 600,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
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
        boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
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
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18, color: C.ink }}>
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
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.inkFaint, marginBottom: 10 }}>
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
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.inkFaint, marginBottom: 10 }}>
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
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
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
        background: "rgba(0,0,0,0.4)",
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
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
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
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18, color: C.ink }}>
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
                  color: photo ? C.brandDark : C.inkSoft,
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
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
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
  const visiblePoints = cityPoints.filter(
    (p) => pinTone(p, mode, category, cityPoints) !== null
  );

  function updateCityPoints(updater) {
    setPointsByCity((prev) => ({
      ...prev,
      [city]: updater(prev[city]),
    }));
  }

  function handleConfirm(pointId, kind, itemId) {
    updateCityPoints((prev) =>
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
    updateCityPoints((prev) =>
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
    updateCityPoints((prev) =>
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

  const selectedPoint = cityPoints.find((p) => p.id === selectedId) || null;

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
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "Unbounded, sans-serif",
            }}
          >
            ₽
          </div>
          <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 700, fontSize: 18 }}>
            Где<span style={{ color: C.brand }}>Скидка</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setCityOpen(!cityOpen)}
            style={{
              background: C.greySoft,
              border: "none",
              borderRadius: 30,
              padding: "6px 14px",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: C.ink,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {city} <ChevronDown size={14} />
          </button>
          {cityOpen && (
            <div
              style={{
                position: "absolute",
                top: 60,
                right: 20,
                background: C.surface,
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: `1px solid ${C.line}`,
                padding: 8,
                zIndex: 30,
                minWidth: 140,
              }}
            >
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setCityOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 14px",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    borderRadius: 10,
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: c === city ? 700 : 500,
                    fontSize: 14,
                    color: c === city ? C.brand : C.ink,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.greySoft)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <IconCircleButton
            onClick={() => {}}
            title="Поделиться"
            size={36}
          >
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
            color: mode === "prices" ? "#fff" : C.inkSoft,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
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
            color: mode === "promos" ? "#fff" : C.inkSoft,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
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

      {/* ========== Яндекс.Карты ========== */}
      <div style={{ width: '100%', height: '400px', minHeight: '300px', background: '#e8edeb' }}>
        <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY }}>
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
                  balloonContent: `<strong>${p.name}</strong><br/>${p.address}`
                }}
                options={{
                  preset: 'islands#blueIcon'
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
          <Sparkles size={16} color={C.amber} />
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
                transition: "border 0.15s",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: TONE_HEX[pinTone(p, mode, category, cityPoints)] || C.grey,
                  flexShrink: 0,
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
          color: "#fff",
          border: "none",
          borderRadius: 60,
          padding: "16px 24px",
          fontFamily: "Unbounded, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 6px 28px rgba(47,110,82,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 50,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 10px 32px rgba(47,110,82,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(47,110,82,0.35)";
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
            background: C.ink,
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
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
            background: "rgba(0,0,0,0.3)",
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
          points={cityPoints}
          pointId={addPointId}
          onClose={() => setAddOpen(false)}
          onSubmit={handleSubmitMark}
        />
      )}
    </div>
  );
}
