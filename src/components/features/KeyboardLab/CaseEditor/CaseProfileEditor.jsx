/**
 * CaseProfileEditor — 2D parametric case cross-section editor.
 *
 * The user drags control points to shape the keyboard case side profile.
 * The profile is an array of {x, y, d?} points defining the cross-section polygon.
 * The system extrudes this symmetrically along the width axis into 3D geometry.
 *
 * Each point may have a `d` (depth inset) that narrows the extrusion at that
 * vertex — applied equally on both sides (symmetric).
 *
 * Mount surface: click any edge to designate it as the key mount surface.
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useLabTranslation } from "../i18n/useLabTranslation";

// ─── Default profiles ───

const PROFILE_PRESETS = {
  flat: {
    name: "Flat Box",
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 15 },
      { x: 0, y: 15 },
    ],
    mountEdge: [3, 2],
  },
  wedge: {
    name: "Cyberboard Wedge",
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 12 },
      { x: 82, y: 30, d: 2 },
      { x: 0, y: 12 },
    ],
    mountEdge: [3, 4],
  },
  chamferedWedge: {
    name: "Chamfered Wedge",
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 45 },
      { x: 90, y: 50, d: 3 },
      { x: 10, y: 16, d: 3 },
      { x: 0, y: 12 },
    ],
    mountEdge: [5, 2],
  },
  ergo: {
    name: "Ergonomic",
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 35 },
      { x: 70, y: 28 },
      { x: 0, y: 18 },
    ],
    mountEdge: [4, 2],
  },
};

const CaseProfileEditor = ({ theme, onChange, initialProfile, extrudeWidth, onExtrudeWidthChange }) => {
  const tLab = useLabTranslation();
  const svgRef = useRef(null);
  const [points, setPoints] = useState(initialProfile?.points || PROFILE_PRESETS.wedge.points);
  const [mountEdge, setMountEdge] = useState(initialProfile?.mountEdge || PROFILE_PRESETS.wedge.mountEdge);
  const [coloredEdges, setColoredEdges] = useState(initialProfile?.coloredEdges || []);
  // Pass-through: editor doesn't expose UI for topFrame yet, but it must
  // preserve the field so it survives the onChange round-trip — otherwise
  // the resolved profile's cutouts get silently stripped on every edit.
  const [topFrame, setTopFrame] = useState(initialProfile?.topFrame || null);
  const [dragging, setDragging] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);

  // Sync from parent when initialProfile changes (e.g., loading a saved design).
  // Hash the WHOLE profile, not just points — otherwise async-loaded topFrame
  // / coloredEdges arrive with the same points, the sync skips, and the
  // editor's emit-effect immediately strips the new fields with its stale
  // local state. Whole-profile hashing still breaks the user-edit loop
  // because after the editor emits, parent's profile === editor's local
  // state, so the hash matches and we don't re-sync.
  const lastLoadedRef = useRef(null);
  useEffect(() => {
    if (!initialProfile?.points) return;
    const key = JSON.stringify({
      points: initialProfile.points,
      mountEdge: initialProfile.mountEdge,
      coloredEdges: initialProfile.coloredEdges,
      topFrame: initialProfile.topFrame,
    });
    if (key !== lastLoadedRef.current) {
      lastLoadedRef.current = key;
      setPoints(initialProfile.points.map(p => ({ ...p })));
      if (initialProfile.mountEdge) setMountEdge([...initialProfile.mountEdge]);
      setColoredEdges(initialProfile.coloredEdges || []);
      setTopFrame(initialProfile.topFrame || null);
      setSelectedPoint(null);
    }
  }, [initialProfile]);

  const text = theme?.text || "#e0e0e0";
  const accent = theme?.stats || "#6ec6ff";
  const bg = theme?.background || "#111115";
  const mountColor = "#44dd88";

  // SVG coordinate system: x=0 left (front), x=100 right (back), y=0 bottom, y grows up
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(400);
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((e) => setContainerW(e[0].contentRect.width));
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);
  const svgW = Math.max(200, containerW - 16);
  const svgH = Math.round(svgW * 0.32);
  const padX = 24;
  const padY = 14;
  const scaleX = (svgW - padX * 2) / 100;
  const scaleY = (svgH - padY * 2) / 60;

  const toSvg = (pt) => ({
    sx: padX + pt.x * scaleX,
    sy: svgH - padY - pt.y * scaleY,
  });

  const fromSvg = (sx, sy) => ({
    x: Math.round(Math.max(0, Math.min(100, (sx - padX) / scaleX))),
    y: Math.round(Math.max(0, Math.min(60, (svgH - padY - sy) / scaleY))),
  });

  // Emit profile changes
  useEffect(() => {
    if (onChange) {
      const next = { points, mountEdge, coloredEdges };
      if (topFrame) next.topFrame = topFrame;
      onChange(next);
    }
  }, [points, mountEdge, coloredEdges, topFrame, onChange]);


  // ─── Drag handling ───
  const handlePointMouseDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(idx);
    setSelectedPoint(idx);
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const pt = fromSvg(e.clientX - rect.left, e.clientY - rect.top);
    setPoints((prev) => {
      const next = [...prev];
      next[dragging] = { ...next[dragging], ...pt };
      return next;
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // ─── Add breakpoint on edge (double-click) ───
  const addPointOnEdge = useCallback((e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const click = fromSvg(e.clientX - rect.left, e.clientY - rect.top);

    let minDist = Infinity, bestEdge = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const a = points[i], b = points[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      let t = len2 > 0 ? ((click.x - a.x) * dx + (click.y - a.y) * dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const px = a.x + t * dx, py = a.y + t * dy;
      const d = Math.hypot(click.x - px, click.y - py);
      if (d < minDist) { minDist = d; bestEdge = i; }
    }

    const a = points[bestEdge];
    const b = points[(bestEdge + 1) % points.length];
    const newPt = { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) };
    const insertIdx = bestEdge + 1;

    const next = [...points];
    next.splice(insertIdx, 0, newPt);
    setPoints(next);
    setMountEdge(prev => prev.map(mi => mi >= insertIdx ? mi + 1 : mi));
    setColoredEdges(prev => prev.map(e => ({
      ...e,
      from: e.from >= insertIdx ? e.from + 1 : e.from,
      to: e.to >= insertIdx ? e.to + 1 : e.to,
    })));
    setSelectedPoint(insertIdx);
  }, [points]);

  // ─── Remove point (keep min 3) ───
  const removePoint = useCallback((idx) => {
    if (points.length <= 3) return;
    setPoints(prev => prev.filter((_, i) => i !== idx));
    setMountEdge(prev => prev.map(mi => {
      if (mi === idx) return Math.max(0, mi - 1);
      return mi > idx ? mi - 1 : mi;
    }));
    setColoredEdges(prev => prev
      .filter(e => e.from !== idx && e.to !== idx)
      .map(e => ({
        ...e,
        from: e.from > idx ? e.from - 1 : e.from,
        to: e.to > idx ? e.to - 1 : e.to,
      })));
    if (selectedPoint === idx) setSelectedPoint(null);
    else if (selectedPoint !== null && selectedPoint > idx) setSelectedPoint(s => s - 1);
  }, [points.length, selectedPoint]);

  const handleRightClick = (idx, e) => {
    e.preventDefault();
    removePoint(idx);
  };

  // ─── Edge click → set mount surface ───
  const handleEdgeClick = useCallback((i, e) => {
    e.stopPropagation();
    const j = (i + 1) % points.length;
    setMountEdge([i, j]);
  }, [points.length]);

  // Build SVG polygon path
  const pathD = points.map((pt, i) => {
    const { sx, sy } = toSvg(pt);
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ") + " Z";

  // Mount surface line
  const mountFrom = toSvg(points[mountEdge[0]]);
  const mountTo = toSvg(points[mountEdge[1]]);

  const btnStyle = { background: "transparent", border: `1px solid ${accent}44`, borderRadius: "4px", color: text, padding: "4px 10px", cursor: "pointer", fontSize: "12px" };
  const lbl = { display: "flex", alignItems: "center", gap: "4px", color: text, fontSize: "12px" };

  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* SVG Editor */}
      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        style={{ background: `${text}05`, borderRadius: "6px", border: `1px solid ${text}10`, cursor: dragging !== null ? "grabbing" : "default" }}
        onDoubleClick={addPointOnEdge}
        onClick={() => { if (dragging === null) setSelectedPoint(null); }}
      >
        {/* Grid */}
        {[0, 25, 50, 75, 100].map((x) => {
          const { sx } = toSvg({ x, y: 0 });
          return <line key={`gx${x}`} x1={sx} y1={padY} x2={sx} y2={svgH - padY} stroke={`${text}06`} />;
        })}
        {[0, 20, 40, 60].map((y) => {
          const { sy } = toSvg({ x: 0, y });
          return <line key={`gy${y}`} x1={padX} y1={sy} x2={svgW - padX} y2={sy} stroke={`${text}06`} />;
        })}

        {/* Profile fill */}
        <path d={pathD} fill={`${accent}12`} stroke={`${accent}40`} strokeWidth={1} />

        {/* Clickable edges */}
        {points.map((pt, i) => {
          const j = (i + 1) % points.length;
          const a = toSvg(pt);
          const b = toSvg(points[j]);
          const isMount = (mountEdge[0] === i && mountEdge[1] === j) || (mountEdge[0] === j && mountEdge[1] === i);
          const isHover = hoveredEdge === i;
          const ce = coloredEdges.find(e => (e.from === i && e.to === j) || (e.from === j && e.to === i));
          return (
            <g key={`edge-${i}`}>
              <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
                stroke="transparent" strokeWidth={12}
                style={{ cursor: "pointer" }}
                onClick={(e) => handleEdgeClick(i, e)}
                onMouseEnter={() => setHoveredEdge(i)}
                onMouseLeave={() => setHoveredEdge(null)}
              />
              {ce && (
                <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
                  stroke={ce.color} strokeWidth={3} pointerEvents="none" />
              )}
              {isMount && (
                <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
                  stroke={mountColor} strokeWidth={2.5} strokeDasharray="4,3" pointerEvents="none" />
              )}
              {isHover && !isMount && (
                <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy}
                  stroke={`${mountColor}66`} strokeWidth={2} strokeDasharray="3,3" pointerEvents="none" />
              )}
            </g>
          );
        })}


        {/* Edge midpoint labels — show the edge key (e.g. "0→1") so users can map
            the edge-accent row back to a specific line in the viewer. */}
        {points.map((_, i) => {
          const j = (i + 1) % points.length;
          const a = toSvg(points[i]);
          const b = toSvg(points[j]);
          const mx = (a.sx + b.sx) / 2;
          const my = (a.sy + b.sy) / 2;
          const isMount = (mountEdge[0] === i && mountEdge[1] === j) || (mountEdge[0] === j && mountEdge[1] === i);
          const ce = coloredEdges.find(e => (e.from === i && e.to === j) || (e.from === j && e.to === i));
          return (
            <g key={`em-${i}`} pointerEvents="none">
              <rect x={mx - 14} y={my - 7} width={28} height={14} rx={3}
                fill={bg} fillOpacity={0.75}
                stroke={ce ? ce.color : isMount ? mountColor : `${text}22`} strokeWidth={0.75} />
              <text x={mx} y={my + 4} fontSize="10" textAnchor="middle"
                fill={ce ? ce.color : isMount ? mountColor : `${text}99`} fontWeight={600}>
                {i}→{j}
              </text>
            </g>
          );
        })}

        {/* Control points — numbered badges */}
        {points.map((pt, i) => {
          const { sx, sy } = toSvg(pt);
          const isHovered = hoveredPoint === i;
          const isSelected = selectedPoint === i;
          const isDrag = dragging === i;
          const isOnMount = mountEdge.includes(i);
          const r = isDrag || isSelected ? 10 : isHovered ? 9 : 8;
          return (
            <g key={i}>
              <circle cx={sx} cy={sy} r={r}
                fill={isDrag ? accent : isSelected ? accent : isHovered ? `${accent}cc` : isOnMount ? `${mountColor}88` : `${accent}66`}
                stroke={isOnMount ? mountColor : accent} strokeWidth={1.5}
                style={{ cursor: "grab" }}
                onMouseDown={(e) => handlePointMouseDown(i, e)}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                onContextMenu={(e) => handleRightClick(i, e)}
              />
              <text x={sx} y={sy + 4} fontSize="11" textAnchor="middle" fontWeight={700}
                fill={isSelected || isDrag ? bg : text} pointerEvents="none">
                {i}
              </text>
              <text x={sx} y={sy - 14} fontSize="10" fill={text} textAnchor="middle" opacity={0.5} pointerEvents="none">
                {pt.x},{pt.y}
              </text>
            </g>
          );
        })}

        {/* Labels */}
        <text x={padX} y={svgH - 2} fontSize="10" fill={text} opacity={0.4}>{tLab("lab_front")}</text>
        <text x={svgW - padX - 20} y={svgH - 2} fontSize="10" fill={text} opacity={0.4}>{tLab("lab_back")}</text>
      </svg>

      {/* ─── Extrusion width (always visible) ─── */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <label style={lbl}
          title={tLab("lab_extrusion_title")}>
          {tLab("lab_extrusion_width")}
          <input type="number" min="50" max="200" step="1"
            value={Math.round((extrudeWidth ?? 1.0) * 100)}
            onChange={(e) => {
              const v = Math.max(50, Math.min(200, parseInt(e.target.value) || 100));
              onExtrudeWidthChange?.(v / 100);
            }}
            style={{
              background: bg, color: text, border: `1px solid ${text}33`,
              borderRadius: "3px", width: "42px", padding: "1px 3px",
              fontSize: "12px", textAlign: "center",
            }}
          />%
        </label>
        <span style={{ fontSize: "12px", color: text, opacity: 0.45 }}>{tLab("lab_symmetric")}</span>
        <span style={{ flex: 1 }} />
        <button onClick={() => setPoints(points.map(p => ({ ...p, y: Math.round(p.y * 1.1) })))} style={btnStyle}>{tLab("lab_taller")}</button>
        <button onClick={() => setPoints(points.map(p => ({ ...p, y: Math.max(0, Math.round(p.y * 0.9)) })))} style={btnStyle}>{tLab("lab_shorter")}</button>
      </div>

      {/* ─── Points table (always visible) ─── */}
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: text, opacity: 0.55, textTransform: "uppercase", letterSpacing: "1px", marginRight: "2px" }}>{tLab("lab_points")}</span>
        {points.map((pt, i) => {
          const isSelected = selectedPoint === i;
          const isOnMount = mountEdge.includes(i);
          return (
            <div key={i}
              onClick={(e) => { e.stopPropagation(); setSelectedPoint(i); }}
              style={{
                display: "flex", alignItems: "center", gap: "3px",
                padding: "2px 5px", borderRadius: "3px", cursor: "pointer",
                background: isSelected ? `${accent}22` : "transparent",
                border: `1px solid ${isSelected ? accent : isOnMount ? `${mountColor}44` : `${text}11`}`,
                fontSize: "12px", color: text,
              }}>
              <span style={{ color: isOnMount ? mountColor : `${text}77`, fontWeight: 600, minWidth: "10px" }}>{i}</span>
              <span style={{ opacity: 0.6 }}>{pt.x},{pt.y}</span>
              <span style={{ opacity: 0.45 }}>{tLab("lab_inset")}</span>
              <input type="number" min="0" max="20"
                value={pt.d || 0}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const d = parseInt(e.target.value) || 0;
                  setPoints(prev => {
                    const next = [...prev];
                    next[i] = { ...next[i], d: d > 0 ? d : undefined };
                    return next;
                  });
                }}
                style={{
                  background: bg, color: text, border: `1px solid ${text}33`,
                  borderRadius: "2px", width: "36px", padding: "1px 3px",
                  fontSize: "12px", textAlign: "center",
                }}
              />
              {points.length > 3 && (
                <span onClick={(e) => { e.stopPropagation(); removePoint(i); }}
                  style={{ color: "#ff666688", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}
                  title={tLab("lab_remove_point")}>×</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Edge accents ─── */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: text, opacity: 0.55, textTransform: "uppercase", letterSpacing: "1px", marginRight: "2px" }}>{tLab("lab_edge_accents")}</span>
        {points.map((_, i) => {
          const j = (i + 1) % points.length;
          const ce = coloredEdges.find(e => (e.from === i && e.to === j) || (e.from === j && e.to === i));
          const isMount = (mountEdge[0] === i && mountEdge[1] === j) || (mountEdge[0] === j && mountEdge[1] === i);
          return (
            <div key={`ce-${i}`} style={{
              display: "flex", alignItems: "center", gap: "3px",
              padding: "2px 5px", borderRadius: "3px",
              border: `1px solid ${ce ? ce.color + "66" : `${text}11`}`,
              fontSize: "12px", color: text,
            }}>
              <span style={{ opacity: 0.6 }}>{i}→{j}</span>
              {isMount && <span style={{ color: mountColor, fontSize: "11px", fontWeight: 700 }}>M</span>}
              <input type="color"
                value={ce?.color || "#ffffff"}
                onChange={(e) => {
                  const color = e.target.value;
                  setColoredEdges(prev => {
                    const idx = prev.findIndex(ed => (ed.from === i && ed.to === j) || (ed.from === j && ed.to === i));
                    if (idx >= 0) {
                      const next = [...prev];
                      next[idx] = { ...next[idx], color };
                      return next;
                    }
                    return [...prev, { from: i, to: j, color }];
                  });
                }}
                style={{ width: "20px", height: "20px", border: `1px solid ${text}22`, borderRadius: "3px", cursor: "pointer", background: "transparent", padding: 0 }}
              />
              {ce && (
                <span onClick={() => setColoredEdges(prev => prev.filter(e => !((e.from === i && e.to === j) || (e.from === j && e.to === i))))}
                  style={{ color: "#ff666688", cursor: "pointer", fontSize: "12px", lineHeight: 1 }}
                  title={tLab("lab_remove_accent")}>×</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "12px", color: text, opacity: 0.5, lineHeight: 1.5 }}>
        {tLab("lab_help_text")}
      </div>
    </div>
  );
};

export default CaseProfileEditor;
export { PROFILE_PRESETS };
