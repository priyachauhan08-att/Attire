import React, { useState, useMemo, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Plus, TrendingUp, TrendingDown, Package, IndianRupee, Link2, RefreshCw,
  Trash2, LayoutGrid, ShoppingBag, LineChart as LineChartIcon, Wallet, X, ImagePlus
} from "lucide-react";

// ---- palette -------------------------------------------------------------
// Warm paper neutrals + a deep emerald for store performance, a burnt-amber
// for EarnKaro (kept visually distinct since it's an external integration).
const C = {
  bg: "#F6F5F0",
  surface: "#FFFFFF",
  ink: "#181A17",
  inkSoft: "#65675F",
  inkFaint: "#9B9C93",
  line: "#E4E1D6",
  accent: "#0B6B4A",
  accentSoft: "#DEEFE5",
  accent2: "#B4551A",
  accent2Soft: "#F5E3D1",
  danger: "#AE3B34",
};

const fmtINR = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const today = new Date(2026, 7, 23);

function dateLabel(offsetFromToday) {
  const d = new Date(today);
  d.setDate(d.getDate() - offsetFromToday);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function makeSeries(days, base, amp, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const wave = Math.sin((days - i) / 5) * amp * 0.4;
    const trend = ((days - i) / days) * amp * 0.6;
    const noise = (rand() - 0.5) * amp * 0.5;
    const value = Math.max(0, Math.round(base + wave + trend + noise));
    out.push({ label: dateLabel(i), value });
  }
  return out;
}

const initialProducts = [
  { id: 1, name: "Wireless Earbuds Pro", category: "Electronics", price: 1999, stock: 84, sales: 312 },
  { id: 2, name: "Smart Fitness Band", category: "Electronics", price: 1499, stock: 46, sales: 258 },
  { id: 3, name: "Ceramic Cookware Set", category: "Home", price: 3299, stock: 21, sales: 140 },
  { id: 4, name: "Yoga Mat Premium", category: "Fitness", price: 899, stock: 63, sales: 205 },
  { id: 5, name: "LED Desk Lamp", category: "Home", price: 749, stock: 12, sales: 96 },
  { id: 6, name: "Bluetooth Speaker Mini", category: "Electronics", price: 1299, stock: 5, sales: 174 },
  { id: 7, name: "Insulated Water Bottle", category: "Fitness", price: 549, stock: 38, sales: 88 },
];

// ---- shared bits ----------------------------------------------------------

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap');

      .dash-root { display: flex; }
      .dash-sidebar {
        width: 200px; flex-shrink: 0; border-right: 1px solid ${C.line};
        padding: 20px 12px; display: flex; flex-direction: column; gap: 4px;
      }
      .dash-nav-item {
        display: flex; align-items: center; gap: 10px; padding: 9px 10px;
        border-radius: 9px; border: none; cursor: pointer; text-align: left;
        font-family: 'Inter', sans-serif; font-size: 13.5px; white-space: nowrap;
      }
      .dash-main { flex: 1; padding: 24px 28px; min-width: 0; }
      .dash-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 22px; gap: 12px; flex-wrap: wrap;
      }
      .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
      .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .table-wrap { overflow-x: auto; }
      .add-btn-label { display: inline; }

      @media (max-width: 860px) {
        .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        .three-col { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 780px) {
        .dash-root { flex-direction: column; }
        .dash-sidebar {
          width: 100%; flex-direction: row; overflow-x: auto; gap: 6px;
          border-right: none; border-bottom: 1px solid ${C.line}; padding: 12px 14px;
        }
        .dash-sidebar-title { display: none; }
        .two-col { grid-template-columns: 1fr; }
      }
      @media (max-width: 560px) {
        .dash-main { padding: 16px 16px; }
        .kpi-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        .three-col { grid-template-columns: 1fr; }
        .add-btn-label { display: none; }
      }
      @media (max-width: 400px) {
        .kpi-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}

function Sparkline({ data, color }) {
  return (
    <div style={{ width: 90, height: 32, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={color} fillOpacity={0.12} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, delta, data, color }) {
  const up = delta >= 0;
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.inkSoft, fontSize: 13 }}>
        <Icon size={15} strokeWidth={1.8} />
        <span>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600,
            color: C.ink, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{value}</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, marginTop: 4,
            color: up ? C.accent : C.danger,
          }}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta).toFixed(1)}% vs prior 15d
          </div>
        </div>
        <Sparkline data={data} color={color} />
      </div>
    </div>
  );
}

function Sidebar({ tab, setTab }) {
  const items = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "insights", label: "Insights", icon: LineChartIcon },
    { key: "earnings", label: "EarnKaro", icon: Wallet },
  ];
  return (
    <div className="dash-sidebar">
      <div className="dash-sidebar-title" style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16,
        color: C.ink, padding: "0 10px 20px",
      }}>Storefront</div>
      {items.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button key={key} onClick={() => setTab(key)} className="dash-nav-item" style={{
            background: active ? C.accentSoft : "transparent",
            color: active ? C.accent : C.inkSoft, fontWeight: active ? 500 : 400,
          }}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function AddProductForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", description: "", category: "" });

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);

  // Each item: { brand, name, price, buyUrl, imageFile, imagePreview }
  const [items, setItems] = useState([
    { brand: "", name: "", price: "", buyUrl: "", imageFile: null, imagePreview: null },
  ]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mainInputRef = useRef(null);

  const handleMainImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const handleItemImage = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, imageFile: file, imagePreview: URL.createObjectURL(file) } : it
      )
    );
    e.target.value = "";
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { brand: "", name: "", price: "", buyUrl: "", imageFile: null, imagePreview: null },
    ]);
  };

  const removeItemRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setError("Fill in name and description.");
      return;
    }
    if (!mainImageFile) {
      setError("Add a main image.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }
    for (const it of items) {
      if (!it.name.trim() || !it.price || !it.buyUrl.trim() || !it.imageFile) {
        setError("Every item needs a name, price, image, and shop link.");
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category.trim());
      fd.append("mainImage", mainImageFile);

      // items metadata as JSON (no images inside)
      const itemsMeta = items.map((it) => ({
        brand: it.brand.trim(),
        name: it.name.trim(),
        price: Number(it.price),
        buyUrl: it.buyUrl.trim(),
      }));
      fd.append("items", JSON.stringify(itemsMeta));

      // item images, same order as itemsMeta
      items.forEach((it) => fd.append("itemImages", it.imageFile));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product.");
        setSubmitting(false);
        return;
      }

      onAdd(data);
      onClose();
    } catch (err) {
      setError("Could not reach server.");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(20,20,18,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface, borderRadius: 16, padding: 24, width: 480, maxWidth: "100%",
          maxHeight: "90vh", overflowY: "auto",
          border: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
            Add look
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkSoft }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Main image */}
          <Field label="Main image (full outfit)">
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImage}
              style={{ display: "none" }}
            />
            {mainImage ? (
              <div style={{ position: "relative", width: 96, height: 96 }}>
                <img
                  src={mainImage}
                  alt="Main look"
                  style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.line}` }}
                />
                <button
                  onClick={() => { setMainImage(null); setMainImageFile(null); }}
                  style={{
                    position: "absolute", top: -6, right: -6, width: 20, height: 20,
                    borderRadius: "50%", background: C.ink, color: "#fff", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => mainInputRef.current?.click()}
                style={{
                  width: 96, height: 96, borderRadius: 10, border: `1px dashed ${C.line}`,
                  background: "#FCFCFA", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", color: C.inkSoft,
                }}
              >
                <ImagePlus size={18} />
                <span style={{ fontSize: 11 }}>Upload</span>
              </button>
            )}
          </Field>

          <Field label="Title">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Forest Walk"
              style={inputStyle}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of the look"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "'Inter', sans-serif" }}
            />
          </Field>

          <Field label="Category">
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Autumn"
              style={inputStyle}
            />
          </Field>

          {/* Items */}
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 8 }}>
              Shop this look
            </div>

            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${C.line}`, borderRadius: 10, padding: 12,
                  marginBottom: 10, display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <input
                    id={`item-img-${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleItemImage(i, e)}
                    style={{ display: "none" }}
                  />
                  {item.imagePreview ? (
                    <img
                      src={item.imagePreview}
                      alt={`Item ${i + 1}`}
                      onClick={() => document.getElementById(`item-img-${i}`).click()}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.line}` }}
                    />
                  ) : (
                    <button
                      onClick={() => document.getElementById(`item-img-${i}`).click()}
                      style={{
                        width: 56, height: 56, borderRadius: 8, border: `1px dashed ${C.line}`,
                        background: "#FCFCFA", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: C.inkSoft, flexShrink: 0,
                      }}
                    >
                      <ImagePlus size={16} />
                    </button>
                  )}

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      value={item.brand}
                      onChange={(e) => updateItem(i, "brand", e.target.value)}
                      placeholder="Brand (e.g. Néra Studio)"
                      style={inputStyle}
                    />
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                      placeholder="Item name (e.g. Ribbed Rust Cardigan)"
                      style={inputStyle}
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => removeItemRow(i)}
                      style={{ border: "none", background: "none", cursor: "pointer", color: C.inkSoft, flexShrink: 0 }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    placeholder="Price"
                    style={{ ...inputStyle, width: 100 }}
                  />
                  <input
                    type="url"
                    value={item.buyUrl}
                    onChange={(e) => updateItem(i, "buyUrl", e.target.value)}
                    placeholder="Shop link (https://...)"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addItemRow}
              style={{
                width: "100%", padding: "8px 0", borderRadius: 8, border: `1px dashed ${C.line}`,
                background: "#FCFCFA", color: C.inkSoft, fontSize: 12.5, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Plus size={14} /> Add item
            </button>
          </div>

          {error && <div style={{ color: C.danger, fontSize: 12.5 }}>{error}</div>}

          <button
            onClick={submit}
            disabled={submitting}
            style={{
              marginTop: 4, background: C.accent, color: "#fff", border: "none",
              borderRadius: 9, padding: "10px 0", fontSize: 13.5, fontWeight: 500,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Adding..." : "Add look"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, fontSize: 12.5, color: C.inkSoft }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 13.5,
  fontFamily: "'Inter', sans-serif", color: C.ink, outline: "none", background: "#FCFCFA", width: "100%",
};

function TopProducts({ products }) {
  const top = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const max = top[0]?.sales || 1;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 14 }}>
        Top products · last 30 days
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {top.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.inkFaint, width: 16,
            }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, gap: 8 }}>
                <span style={{ color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                <span style={{ color: C.inkSoft, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{p.sales} sold</span>
              </div>
              <div style={{ height: 5, background: C.accentSoft, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(p.sales / max) * 100}%`, height: "100%", background: C.accent, borderRadius: 4 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ data, color, height = 220 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke={C.line} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.inkFaint }} axisLine={{ stroke: C.line }} tickLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11, fill: C.inkFaint }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 12.5 }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: C.inkSoft }}>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

// ---- main -------------------------------------------------------------

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(initialProducts);
  const [showAdd, setShowAdd] = useState(false);
  const [syncTick, setSyncTick] = useState(0);

  const revenueSeries = useMemo(() => makeSeries(30, 9000, 5000, 11 + syncTick), [syncTick]);
  const ordersSeries = useMemo(() => makeSeries(30, 40, 22, 27 + syncTick), [syncTick]);
  const commissionSeries = useMemo(() => makeSeries(30, 1400, 900, 53 + syncTick), [syncTick]);
  const clicksSeries = useMemo(() => makeSeries(30, 320, 160, 71 + syncTick), [syncTick]);

  const sum = (arr) => arr.reduce((a, b) => a + b.value, 0);
  const delta = (arr) => {
    const first = sum(arr.slice(0, 15)), second = sum(arr.slice(15));
    return first === 0 ? 0 : ((second - first) / first) * 100;
  };

  const totalRevenue = sum(revenueSeries);
  const totalOrders = sum(ordersSeries);
  const totalCommission = sum(commissionSeries);
  const totalClicks = sum(clicksSeries);
  const conversionRate = ((totalOrders / totalClicks) * 100).toFixed(1);

  const addProduct = (p) => setProducts((prev) => [...prev, p]);
  const removeProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="dash-root" style={{
      fontFamily: "'Inter', sans-serif", background: C.bg, minHeight: 600,
      color: C.ink, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`,
    }}>
      <GlobalStyle />
      <Sidebar tab={tab} setTab={setTab} />

      <div className="dash-main">
        <div className="dash-header">
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600 }}>
              {{ overview: "Overview", products: "Products", insights: "Insights", earnings: "EarnKaro earnings" }[tab]}
            </div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Last 30 days · 25 Jul – 23 Aug 2026</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            display: "flex", alignItems: "center", gap: 6, background: C.ink, color: "#fff",
            border: "none", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <Plus size={15} /> <span className="add-btn-label">Add product</span>
          </button>
        </div>

        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="kpi-grid">
              <KPICard icon={IndianRupee} label="Revenue" value={fmtINR(totalRevenue)} delta={delta(revenueSeries)} data={revenueSeries} color={C.accent} />
              <KPICard icon={Package} label="Orders" value={totalOrders.toLocaleString("en-IN")} delta={delta(ordersSeries)} data={ordersSeries} color={C.accent} />
              <KPICard icon={Wallet} label="EarnKaro commission" value={fmtINR(totalCommission)} delta={delta(commissionSeries)} data={commissionSeries} color={C.accent2} />
              <KPICard icon={ShoppingBag} label="Products live" value={products.length} delta={0} data={makeSeries(30, products.length, 1, 5)} color={C.accent} />
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 10 }}>Revenue trend</div>
              <TrendChart data={revenueSeries} color={C.accent} />
            </div>
            <div className="two-col">
              <TopProducts products={products} />
              <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600 }}>EarnKaro</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.accent2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent2, display: "inline-block" }} />
                    Connected
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <Row label="Commission (30d)" value={fmtINR(totalCommission)} />
                  <Row label="Link clicks" value={totalClicks.toLocaleString("en-IN")} />
                  <Row label="Conversion rate" value={`${conversionRate}%`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="table-wrap" style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14 }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.line}`, color: C.inkSoft, textAlign: "left" }}>
                  {["Product", "Category", "Price", "Stock", "Sold (30d)", ""].map((h) => (
                    <th key={h} style={{ padding: "11px 16px", fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={{ padding: "11px 16px" }}>{p.name}</td>
                    <td style={{ padding: "11px 16px", color: C.inkSoft }}>{p.category}</td>
                    <td style={{ padding: "11px 16px", fontVariantNumeric: "tabular-nums" }}>{fmtINR(p.price)}</td>
                    <td style={{ padding: "11px 16px", color: p.stock < 10 ? C.danger : C.ink }}>{p.stock}</td>
                    <td style={{ padding: "11px 16px", fontVariantNumeric: "tabular-nums" }}>{p.sales}</td>
                    <td style={{ padding: "11px 16px", textAlign: "right" }}>
                      <button onClick={() => removeProduct(p.id)} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="three-col">
              <KPICard icon={IndianRupee} label="Revenue" value={fmtINR(totalRevenue)} delta={delta(revenueSeries)} data={revenueSeries} color={C.accent} />
              <KPICard icon={Package} label="Orders" value={totalOrders} delta={delta(ordersSeries)} data={ordersSeries} color={C.accent} />
              <KPICard icon={Link2} label="Link clicks" value={totalClicks.toLocaleString("en-IN")} delta={delta(clicksSeries)} data={clicksSeries} color={C.accent2} />
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 10 }}>Revenue · 30 days</div>
              <TrendChart data={revenueSeries} color={C.accent} height={200} />
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 10 }}>Orders · 30 days</div>
              <TrendChart data={ordersSeries} color={C.accent2} height={200} />
            </div>
            <TopProducts products={products} />
          </div>
        )}

        {tab === "earnings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{
              background: C.accent2Soft, border: `1px solid ${C.line}`, borderRadius: 14,
              padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 12.5, color: C.accent2, marginBottom: 4 }}>EarnKaro · connected account</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600 }}>{fmtINR(totalCommission)}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>Total commission, last 30 days</div>
              </div>
              <button onClick={() => setSyncTick((t) => t + 1)} style={{
                display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${C.line}`,
                borderRadius: 9, padding: "8px 12px", fontSize: 12.5, cursor: "pointer", color: C.ink,
              }}>
                <RefreshCw size={13} /> Sync now
              </button>
            </div>
            <div className="two-col">
              <KPICard icon={Link2} label="Link clicks" value={totalClicks.toLocaleString("en-IN")} delta={delta(clicksSeries)} data={clicksSeries} color={C.accent2} />
              <KPICard icon={TrendingUp} label="Conversion rate" value={`${conversionRate}%`} delta={delta(commissionSeries)} data={commissionSeries} color={C.accent2} />
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, marginBottom: 10 }}>Commission · 30 days</div>
              <TrendChart data={commissionSeries} color={C.accent2} height={220} />
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddProductForm onAdd={addProduct} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
