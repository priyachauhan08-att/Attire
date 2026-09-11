import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Package, Eye, MousePointerClick, Percent, Trash2,
  LayoutGrid, ShoppingBag, TrendingUp, X, ImagePlus, Loader2
} from "lucide-react";
import "./AdminLogin.css";

// ---- palette -------------------------------------------------------------
const C = {
  bg: "#F6F5F0",
  surface: "#FFFFFF",
  ink: "#181A17",
  inkSoft: "#65675F",
  inkFaint: "#9B9C93",
  line: "#E4E1D6",
  accent: "#0B6B4A",
  accentSoft: "#DEEFE5",
  danger: "#AE3B34",
};

const apiUrl = import.meta.env.VITE_API_URL;

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
      .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
      .table-wrap { overflow-x: auto; }
      .add-btn-label { display: inline; }

      @media (max-width: 860px) {
        .kpi-grid { grid-template-columns: repeat(2, 1fr); }
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
        .add-btn-label { display: none; }
      }
      @media (max-width: 400px) {
        .kpi-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.inkSoft, fontSize: 13 }}>
        <Icon size={15} strokeWidth={1.8} />
        <span>{label}</span>
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600,
        color: color || C.ink, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
      }}>{value}</div>
    </div>
  );
}

function Sidebar({ tab, setTab }) {
  const items = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "trending", label: "Trending", icon: TrendingUp },
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
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
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
    setItems((prev) => [...prev, { brand: "", name: "", price: "", buyUrl: "", imageFile: null, imagePreview: null }]);
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

      const itemsMeta = items.map((it) => ({
        brand: it.brand.trim(),
        name: it.name.trim(),
        price: Number(it.price),
        buyUrl: it.buyUrl.trim(),
      }));
      fd.append("items", JSON.stringify(itemsMeta));
      items.forEach((it) => fd.append("itemImages", it.imageFile));

      const res = await fetch(`${apiUrl}/api/products`, { method: "POST", body: fd });
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
          maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.line}`,
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
          <Field label="Main image (full outfit)">
            <input ref={mainInputRef} type="file" accept="image/*" onChange={handleMainImage} style={{ display: "none" }} />
            {mainImage ? (
              <div style={{ position: "relative", width: 96, height: 96 }}>
                <img src={mainImage} alt="Main look" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.line}` }} />
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
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Forest Walk" style={inputStyle} />
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
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Autumn" style={inputStyle} />
          </Field>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Shop this look</div>

            {items.map((item, i) => (
              <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, marginBottom: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <input id={`item-img-${i}`} type="file" accept="image/*" onChange={(e) => handleItemImage(i, e)} style={{ display: "none" }} />
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
                    <input value={item.brand} onChange={(e) => updateItem(i, "brand", e.target.value)} placeholder="Brand" style={inputStyle} />
                    <input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Item name" style={inputStyle} />
                  </div>

                  {items.length > 1 && (
                    <button onClick={() => removeItemRow(i)} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkSoft, flexShrink: 0 }}>
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" step="0.01" min="0" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} placeholder="Price" style={{ ...inputStyle, width: 100 }} />
                  <input type="url" value={item.buyUrl} onChange={(e) => updateItem(i, "buyUrl", e.target.value)} placeholder="Shop link (https://...)" style={{ ...inputStyle, flex: 1 }} />
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
              cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1,
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

function TopByMetric({ title, icon: Icon, products, metricKey, metricLabel }) {
  const top = [...products].sort((a, b) => (b[metricKey] || 0) - (a[metricKey] || 0)).slice(0, 5);
  const max = top[0]?.[metricKey] || 1;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={16} strokeWidth={1.8} color={C.accent} />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: C.ink }}>{title}</div>
      </div>
      {top.length === 0 ? (
        <div style={{ fontSize: 13, color: C.inkFaint }}>No data yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {top.map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.inkFaint, width: 16 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, gap: 8 }}>
                  <span style={{ color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  <span style={{ color: C.inkSoft, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{p[metricKey] || 0} {metricLabel}</span>
                </div>
                <div style={{ height: 5, background: C.accentSoft, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${((p[metricKey] || 0) / max) * 100}%`, height: "100%", background: C.accent, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- main -------------------------------------------------------------

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${apiUrl}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (p) => setProducts((prev) => [p, ...prev]);

  const removeProduct = async (id, name) => {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    const prevProducts = products;
    setProducts((prev) => prev.filter((p) => p._id !== id));
    try {
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      setProducts(prevProducts);
    }
  };
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

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
              {{ overview: "Overview", products: "Products", trending: "Trending" }[tab]}
            </div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Live data from your store</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            display: "flex", alignItems: "center", gap: 6, background: C.ink, color: "#fff",
            border: "none", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <Plus size={15} /> <span className="add-btn-label">Add product</span>
          </button>
        </div>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.inkSoft, fontSize: 13, padding: "40px 0", justifyContent: "center" }}>
            <Loader2 size={16} className="spin" /> Loading store data…
          </div>
        )}

        {!loading && error && (
          <div style={{ color: C.danger, fontSize: 13, padding: "40px 0", textAlign: "center" }}>
            Couldn't load products: {error}
          </div>
        )}

        {!loading && !error && tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="kpi-grid">
              <StatCard icon={Package} label="Products live" value={products.length} />
              <StatCard icon={Eye} label="Total views" value={totalViews.toLocaleString("en-IN")} />
              <StatCard icon={MousePointerClick} label="Total clicks" value={totalClicks.toLocaleString("en-IN")} />
            </div>
            <div className="two-col">
              <TopByMetric title="Most viewed" icon={Eye} products={products} metricKey="views" metricLabel="views" />
              <TopByMetric title="Most clicked" icon={MousePointerClick} products={products} metricKey="clicks" metricLabel="clicks" />
            </div>
          </div>
        )}

        {!loading && !error && tab === "products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: C.inkSoft }}>
              <b style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{products.length}</b>{" "}
              {products.length === 1 ? "look" : "looks"} total
            </div>

            <div className="table-wrap" style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14 }}>
              <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 13 }}>              <thead>
                <tr style={{ borderBottom: `1px solid ${C.line}`, color: C.inkSoft, textAlign: "left" }}>
                  {["Look", "Category", "Views", "Clicks", ""].map((h) => (
                    <th key={h} style={{ padding: "11px 16px", fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "20px 16px", color: C.inkFaint }}>No products yet.</td></tr>
                  ) : products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ padding: "11px 16px" }}>{p.name}</td>
                      <td style={{ padding: "11px 16px", color: C.inkSoft }}>{p.category || "—"}</td>
                      <td style={{ padding: "11px 16px", fontVariantNumeric: "tabular-nums" }}>{p.views || 0}</td>
                      <td style={{ padding: "11px 16px", fontVariantNumeric: "tabular-nums" }}>{p.clicks || 0}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right" }}>
                        <button onClick={() => removeProduct(p._id, p.name)} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint }}>
                          <Trash2 size={15} />
                        </button>                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && tab === "trending" && (
          <div className="two-col">
            <TopByMetric title="Most viewed looks" icon={Eye} products={products} metricKey="views" metricLabel="views" />
            <TopByMetric title="Most clicked looks" icon={MousePointerClick} products={products} metricKey="clicks" metricLabel="clicks" />
          </div>
        )}
      </div>

      {showAdd && <AddProductForm onAdd={addProduct} onClose={() => setShowAdd(false)} />}
    </div>
  );
}