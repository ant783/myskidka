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
  { id: "meat", label: "Мясо", icon: Fuel, unit: "кг" },
  { id: "fish", label: "Рыба", icon: Droplet, unit: "кг" },
  { id: "veg", label: "Овощи", icon: LayoutGrid, unit: "кг" },
  { id: "fruit", label: "Фрукты", icon: LayoutGrid, unit: "кг" },
  { id: "groceries", label: "Бакалея", icon: LayoutGrid, unit: "кг" },
];

const PROMO_CATS = [
  { id: "all", label: "Все акции", icon: LayoutGrid },
  { id: "percent", label: "Скидка %", icon: Percent },
  { id: "twoforone", label: "2=1", icon: Layers },
  { id: "cashback", label: "Кэшбэк", icon: Wallet },
  { id: "sale", label: "Распродажа", icon: Tag },
];

const TYPE_LABEL = { shop: "Магазин", gas: "АЗС", cafe: "Кафе" };

// ----- Функция для генерации случайных цен с небольшим разбросом -----
const generatePrice = (base, variation = 0.05) => {
  const delta = base * variation * (Math.random() * 2 - 1);
  return Math.round((base + delta) * 10) / 10;
};

// ----- Список социально значимых продуктов (название, категория, базовая цена) -----
const SOCIAL_PRODUCTS = [
  // Мясо и рыба
  { name: "Говядина", cat: "meat", basePrice: 600, unit: "кг" },
  { name: "Свинина", cat: "meat", basePrice: 350, unit: "кг" },
  { name: "Баранина", cat: "meat", basePrice: 500, unit: "кг" },
  { name: "Куры (целые)", cat: "meat", basePrice: 250, unit: "кг" },
  { name: "Рыба мороженая неразделанная", cat: "fish", basePrice: 200, unit: "кг" },
  // Молочные продукты
  { name: "Молоко питьевое", cat: "milk", basePrice: 80, unit: "л" },
  { name: "Масло сливочное", cat: "milk", basePrice: 150, unit: "180г" },
  { name: "Яйца куриные", cat: "eggs", basePrice: 120, unit: "10 шт" },
  // Хлеб
  { name: "Хлеб ржаной", cat: "bread", basePrice: 50, unit: "шт" },
  { name: "Хлеб пшеничный", cat: "bread", basePrice: 45, unit: "шт" },
  { name: "Булочные изделия из пшеничной муки", cat: "bread", basePrice: 40, unit: "шт" },
  // Овощи и фрукты
  { name: "Картофель", cat: "veg", basePrice: 40, unit: "кг" },
  { name: "Капуста белокочанная", cat: "veg", basePrice: 30, unit: "кг" },
  { name: "Лук репчатый", cat: "veg", basePrice: 30, unit: "кг" },
  { name: "Морковь", cat: "veg", basePrice: 35, unit: "кг" },
  { name: "Яблоки", cat: "fruit", basePrice: 80, unit: "кг" },
  // Бакалея
  { name: "Сахар-песок", cat: "groceries", basePrice: 60, unit: "кг" },
  { name: "Соль поваренная пищевая", cat: "groceries", basePrice: 15, unit: "кг" },
  { name: "Мука пшеничная", cat: "groceries", basePrice: 50, unit: "кг" },
  { name: "Крупа гречневая (ядрица)", cat: "groceries", basePrice: 90, unit: "кг" },
  { name: "Рис шлифованный", cat: "groceries", basePrice: 80, unit: "кг" },
  { name: "Пшено", cat: "groceries", basePrice: 50, unit: "кг" },
  { name: "Вермишель", cat: "groceries", basePrice: 70, unit: "кг" },
  { name: "Масло подсолнечное", cat: "groceries", basePrice: 120, unit: "л" },
  { name: "Чай чёрный байховый", cat: "groceries", basePrice: 80, unit: "пачка" },
];

// ----- Генерация цен для одного магазина с уникальными значениями -----
const generatePricesForStore = () => {
  return SOCIAL_PRODUCTS.map((p, index) => {
    const price = generatePrice(p.basePrice);
    // Для демонстрации: у некоторых товаров добавим старую цену (скидку)
    let oldPrice = null;
    if (index % 5 === 0) { // каждый пятый товар со скидкой
      oldPrice = Math.round((price * (1 + Math.random() * 0.3)) * 10) / 10;
    }
    return {
      id: `p${Date.now()}_${index}`,
      cat: p.cat,
      name: p.name,
      value: price,
      unit: p.unit,
      oldPrice: oldPrice,
      mins: Math.floor(Math.random() * 120),
      confirms: Math.floor(Math.random() * 10) + 1,
      status: "active",
    };
  });
};

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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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
    prices: generatePricesForStore(),
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

// ---------------------------------- компоненты (без изменений) ----------------------------------
// ... (все компоненты: IconCircleButton, Chip, PointSheet, AddMarkModal — они остаются как в предыдущей версии)
// Чтобы не раздувать ответ, я их не копирую, но они должны быть идентичны предыдущему коду.
// В финальном коде они будут присутствовать.

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
