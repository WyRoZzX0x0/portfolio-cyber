"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   PALETTE — "Luxury Dark Naturel"
   ═══════════════════════════════════════════════════════ */
const C = {
  bg:          "#0d1210",       // fond principal : noir avec teinte forêt
  bgDeep:      "#0a0f0d",       // zones plus profondes
  surfaceDim:  "rgba(45,62,52,0.35)",  // surfaces cuir sombre
  surfaceMid:  "rgba(45,62,52,0.55)",
  borderNat:   "rgba(80,110,85,0.22)", // bords naturels
  borderHov:   "rgba(160,195,120,0.35)",
  gold:        "#c8a95e",       // or principal
  goldSoft:    "#b89a5a",       // or plus doux
  goldDim:     "rgba(200,169,94,0.10)",
  goldGlow:    "rgba(200,169,94,0.25)",
  brown:       "#6b4f3a",       // marron structurant
  brownLight:  "#8c6e52",       // marron plus clair
  greenMid:    "#3a5c47",       // vert milieu
  greenLight:  "#5a8a6a",       // vert clair pour accents
  textPri:     "#e8e0d0",       // texte principal : blanc chaud
  textMid:     "#9a9488",       // texte intermédiaire
  textSub:     "#5e5a52",       // texte secondaire
};

/* ═══════════════════════════════════════════════════════
   CSS GLOBAL
   ═══════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }

  body {
    background: ${C.bg};
    color: ${C.textPri};
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    cursor: default;
  }

  /* Désactiver le curseur texte sur tout le site */
  * {
    cursor: inherit;
  }
  
  button, a, .project-row, .nav-links a, .hero-cta, .contact-btn {
    cursor: pointer !important;
  }

  /* ── Texture grain ── */
  body::after {
    content:'';
    position:fixed; inset:0;
    opacity:0.4;
    pointer-events:none;
    z-index:998;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E");
  }

  /* ── Subtle radial bg layers ── */
  .bg-layer {
    position:fixed; inset:0; pointer-events:none; z-index:0;
  }
  .bg-layer::before {
    content:'';
    position:absolute;
    width:700px; height:700px;
    top:-200px; left:-250px;
    border-radius:50%;
    background: radial-gradient(circle, rgba(58,92,71,0.18) 0%, transparent 70%);
  }
  .bg-layer::after {
    content:'';
    position:absolute;
    width:500px; height:500px;
    bottom:-180px; right:-160px;
    border-radius:50%;
    background: radial-gradient(circle, rgba(107,79,58,0.14) 0%, transparent 70%);
  }

  .page { position:relative; z-index:1; }

  /* ══════════ NAV ══════════ */
  nav {
    position:fixed; top:0; width:100%; z-index:100;
    padding:26px 52px;
    display:flex; justify-content:space-between; align-items:center;
    transition: background 0.5s, padding 0.4s;
  }
  nav.scrolled {
    background: rgba(13,18,16,0.82);
    backdrop-filter: blur(18px);
    padding: 16px 52px;
    border-bottom: 1px solid ${C.borderNat};
  }
  .nav-brand {
    display:flex; align-items:center; gap:10px;
  }
  .nav-brand-mark {
    width:28px; height:28px;
    border:1.5px solid ${C.gold};
    border-radius:4px;
    display:flex; align-items:center; justify-content:center;
  }
  .nav-brand-mark span {
    font-family:'Bebas Neue', sans-serif;
    font-size:16px;
    color:${C.gold};
    line-height:1;
  }
  .nav-brand-name {
    font-family:'Outfit', sans-serif;
    font-size:15px;
    font-weight:400;
    color:${C.textPri};
    letter-spacing:1px;
  }
  .nav-links { display:flex; gap:36px; }
  .nav-links a {
    color:${C.textSub};
    text-decoration:none;
    font-size:11px;
    font-weight:500;
    letter-spacing:2.5px;
    text-transform:uppercase;
    transition: color 0.3s;
    cursor:pointer;
    position:relative;
  }
  .nav-links a::after {
    content:'';
    position:absolute;
    bottom:-6px; left:0;
    width:0; height:1px;
    background:${C.gold};
    transition: width 0.35s;
  }
  .nav-links a:hover { color:${C.textPri}; }
  .nav-links a:hover::after { width:100%; }

  /* ══════════ HERO ══════════ */
  .hero {
    min-height:100vh;
    display:flex; flex-direction:column;
    justify-content:center;
    padding: 0 52px;
    position:relative;
    overflow:hidden;
  }
  canvas#particles {
    position:absolute; inset:0;
    pointer-events:none;
    z-index:0;
  }
  .hero-content { position:relative; z-index:1; max-width:900px; }

  .hero-badge {
    display:inline-flex; align-items:center; gap:10px;
    background: ${C.surfaceDim};
    border:1px solid ${C.borderNat};
    border-radius:30px;
    padding:8px 18px 8px 10px;
    margin-bottom:40px;
    opacity:0; animation: slideIn 0.8s 0.2s forwards;
  }
  .hero-badge-dot {
    width:8px; height:8px;
    border-radius:50%;
    background:${C.greenLight};
    box-shadow: 0 0 8px ${C.greenLight};
    animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.3; }
  }
  .hero-badge span {
    font-size:12px;
    font-weight:400;
    color:${C.textMid};
    letter-spacing:1px;
  }

  .hero-title {
    font-family:'Bebas Neue', sans-serif;
    font-size: clamp(72px, 11vw, 140px);
    line-height:0.92;
    letter-spacing:-1px;
    color:${C.textPri};
    opacity:0; animation: slideIn 0.9s 0.4s forwards;
  }
  .hero-title .gold { color:${C.gold}; }
  .hero-title .outline {
    -webkit-text-stroke: 1.5px ${C.textPri};
    color: transparent;
  }

  .hero-row {
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:52px;
    opacity:0; animation: slideIn 0.9s 0.65s forwards;
  }
  .hero-desc {
    max-width:400px;
    font-size:15px;
    line-height:1.8;
    color:${C.textMid};
  }
  .hero-cta {
    display:inline-flex; align-items:center; gap:12px;
    background:${C.gold};
    color:#0d1210;
    border:none;
    padding:14px 30px;
    border-radius:6px;
    font-family:'Outfit', sans-serif;
    font-size:13px;
    font-weight:500;
    letter-spacing:1px;
    cursor:pointer;
    transition: box-shadow 0.3s, transform 0.2s;
  }
  .hero-cta:hover {
    box-shadow: 0 4px 28px ${C.goldGlow};
    transform: translateY(-1px);
  }
  .hero-cta-arrow { font-size:16px; transition:transform 0.3s; }
  .hero-cta:hover .hero-cta-arrow { transform: translateX(4px); }

  @keyframes slideIn {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ══════════ TERMINAL ══════════ */
  .hero-terminal {
    position: absolute;
    right: 240px;
    top: 160px;
    width: 420px;
    max-width: 35vw;
    background: ${C.surfaceDim};
    border: 1px solid ${C.borderNat};
    border-radius: 12px;
    padding: 20px;
    opacity: 0;
    animation: slideIn 0.9s 0.85s forwards;
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${C.borderNat};
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${C.goldSoft};
    opacity: 0.6;
  }

  .terminal-title {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: ${C.textSub};
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-left: 6px;
  }

  .terminal-body {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.8;
    color: ${C.textMid};
    min-height: 160px;
  }

  .terminal-line {
    opacity: 0;
    margin-bottom: 4px;
  }

  .terminal-line.visible {
    opacity: 1;
    animation: terminalLine 0.3s ease-in;
  }

  .terminal-prompt {
    color: ${C.greenLight};
  }

  .terminal-output {
    color: ${C.textSub};
    padding-left: 8px;
  }

  .terminal-success {
    color: ${C.greenLight};
  }

  .terminal-warning {
    color: ${C.gold};
  }

  .terminal-cursor {
    display: inline-block;
    width: 8px;
    height: 14px;
    background: ${C.gold};
    margin-left: 4px;
    animation: blink 1s infinite;
  }

  @keyframes terminalLine {
    from { opacity: 0; transform: translateX(-4px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* ══════════ SECTIONS ══════════ */
  .sec { padding:140px 52px; }
  .sec-inner { max-width:1080px; margin:0 auto; }

  .sec-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:80px;
  }
  .sec-header-left .sec-eyebrow {
    font-size:11px;
    font-weight:500;
    letter-spacing:3px;
    text-transform:uppercase;
    color:${C.gold};
    margin-bottom:14px;
    display:flex; align-items:center; gap:12px;
  }
  .sec-header-left .sec-eyebrow::before {
    content:'';
    width:24px; height:1px;
    background:${C.gold};
  }
  .sec-header-left h2 {
    font-family:'Bebas Neue', sans-serif;
    font-size: clamp(38px, 5.5vw, 58px);
    line-height:1;
    letter-spacing:0.5px;
    color:${C.textPri};
  }
  .sec-header-right {
    font-family:'Cormorant Garamond', serif;
    font-style:italic;
    font-size:15px;
    color:${C.goldSoft};
    max-width:280px;
    text-align:right;
    line-height:1.7;
  }

  /* ══════════ SKILLS ══════════ */
  .skills-grid {
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap:2px;
  }
  .skill-cell {
    background:${C.surfaceDim};
    padding:38px 32px;
    position:relative;
    transition: background 0.4s;
    cursor:default;
    overflow:hidden;
  }
  .skill-cell::before {
    content:'';
    position:absolute;
    top:0; left:0;
    width:100%; height:1px;
    background: linear-gradient(90deg, transparent, ${C.gold}, transparent);
    opacity:0;
    transition:opacity 0.4s;
  }
  .skill-cell:hover { background:${C.surfaceMid}; }
  .skill-cell:hover::before { opacity:0.6; }

  .skill-cell-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
  .skill-cell-num {
    font-family:'Cormorant Garamond', serif;
    font-size:11px;
    color:${C.textSub};
    letter-spacing:1px;
  }
  .skill-cell-icon {
    width:36px; height:36px;
    border-radius:8px;
    background:${C.goldDim};
    border:1px solid rgba(200,169,94,0.15);
    display:flex; align-items:center; justify-content:center;
    font-size:16px;
  }
  .skill-cell h4 {
    font-family:'Outfit', sans-serif;
    font-size:17px;
    font-weight:500;
    color:${C.textPri};
    margin-bottom:8px;
  }
  .skill-cell p {
    font-size:12px;
    color:${C.textSub};
    line-height:1.6;
    margin-bottom:22px;
  }
  .skill-bar-track {
    width:100%; height:2px;
    background: rgba(255,255,255,0.06);
    border-radius:1px;
    overflow:hidden;
  }
  .skill-bar-fill {
    height:100%;
    border-radius:1px;
    background: linear-gradient(90deg, ${C.greenMid}, ${C.gold});
    width:0;
    transition: width 1.6s cubic-bezier(0.22,1,0.36,1);
  }

  /* ══════════ PROJECTS ══════════ */
  .project-row {
    display:grid;
    grid-template-columns: 56px 1fr auto;
    gap:32px;
    align-items:center;
    padding:32px 0;
    border-bottom: 1px solid ${C.borderNat};
    cursor:pointer;
    transition: padding 0.3s;
    text-decoration:none;
  }
  .project-row:first-child { border-top: 1px solid ${C.borderNat}; }
  .project-row:hover { padding:36px 0; }

  .project-row-num {
    font-family:'Cormorant Garamond', serif;
    font-size:28px;
    font-style:italic;
    color:${C.textSub};
    transition: color 0.3s;
  }
  .project-row:hover .project-row-num { color:${C.gold}; }

  .project-row-mid { display:flex; flex-direction:column; gap:8px; }
  .project-row-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .project-row-tag {
    font-size:9px;
    font-weight:500;
    letter-spacing:1.5px;
    text-transform:uppercase;
    color:${C.greenLight};
    background: rgba(90,138,106,0.12);
    padding:4px 10px;
    border-radius:3px;
  }
  .project-row-title {
    font-family:'Outfit', sans-serif;
    font-size:20px;
    font-weight:400;
    color:${C.textPri};
    transition: color 0.3s;
  }
  .project-row:hover .project-row-title { color:${C.gold}; }
  .project-row-desc {
    font-size:13px;
    color:${C.textSub};
    line-height:1.6;
    max-width:520px;
  }

  .project-row-arrow {
    width:44px; height:44px;
    border-radius:50%;
    border:1px solid ${C.borderNat};
    display:flex; align-items:center; justify-content:center;
    color:${C.textSub};
    font-size:18px;
    flex-shrink:0;
    transition: all 0.35s;
  }
  .project-row:hover .project-row-arrow {
    border-color:${C.gold};
    background:${C.goldDim};
    color:${C.gold};
  }
  .project-row.expanded .project-row-arrow {
    transform:rotate(180deg);
    border-color:${C.gold};
    background:${C.goldDim};
    color:${C.gold};
  }

  /* Détails dépliables */
  .project-details {
    grid-column: 2 / 4;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.4s ease,
                padding 0.4s ease;
    padding: 0 0 0 0;
  }
  .project-details.expanded {
    max-height: 800px;
    opacity: 1;
    padding: 28px 0 12px 0;
  }
  .project-details-inner {
    background: ${C.surfaceDim};
    border: 1px solid ${C.borderNat};
    border-radius: 12px;
    padding: 32px 36px;
  }
  .project-details h5 {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: ${C.gold};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
    margin-top: 24px;
  }
  .project-details h5:first-child { margin-top: 0; }
  .project-details p {
    font-size: 13px;
    color: ${C.textMid};
    line-height: 1.7;
    margin-bottom: 12px;
  }
  .project-details ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .project-details li {
    font-size: 13px;
    color: ${C.textMid};
    line-height: 1.6;
    padding-left: 20px;
    position: relative;
  }
  .project-details li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${C.greenLight};
    font-size: 12px;
  }
  .project-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  .project-tool-tag {
    font-size: 11px;
    font-weight: 400;
    color: ${C.textMid};
    background: rgba(255,255,255,0.04);
    border: 1px solid ${C.borderNat};
    padding: 5px 12px;
    border-radius: 4px;
  }

  /* ══════════ TIMELINE ══════════ */
  .timeline-grid {
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
  }
  .timeline-left h2 {
    font-family:'Bebas Neue', sans-serif;
    font-size:clamp(38px, 5.5vw, 58px);
    line-height:1;
    color:${C.textPri};
    margin-bottom:20px;
  }
  .timeline-left p {
    font-size:15px;
    color:${C.textSub};
    line-height:1.8;
    max-width:340px;
  }

  .timeline-items { display:flex; flex-direction:column; }
  .t-row {
    display:grid;
    grid-template-columns: 100px 1fr;
    gap:45px;
    padding:28px 0;
    border-bottom: 1px solid ${C.borderNat};
    position:relative;
  }
  .t-row:first-child { border-top: 1px solid ${C.borderNat}; }
  .t-year {
    font-family:'Cormorant Garamond', serif;
    font-size:14px;
    font-style:italic;
    color:${C.gold};
    padding-top:2px;
    white-space:nowrap;
  }
  .t-body h4 {
    font-size:16px;
    font-weight:500;
    color:${C.textPri};
    margin-bottom:5px;
  }
  .t-body p {
    font-size:13px;
    color:${C.textSub};
    line-height:1.6;
  }

  /* ══════════ CONTACT ══════════ */
  .contact-block {
    background: linear-gradient(135deg, ${C.surfaceDim} 0%, rgba(107,79,58,0.12) 100%);
    border:1px solid ${C.borderNat};
    border-radius:20px;
    padding:90px 76px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:60px;
    position:relative;
    overflow:hidden;
  }
  .contact-block::before {
    content:'';
    position:absolute;
    width:360px; height:360px;
    border-radius:50%;
    background: radial-gradient(circle, ${C.goldDim} 0%, transparent 70%);
    top:-120px; right:-80px;
    pointer-events:none;
  }
  .contact-block::after {
    content:'';
    position:absolute;
    width:260px; height:260px;
    border-radius:50%;
    background: radial-gradient(circle, rgba(58,92,71,0.1) 0%, transparent 70%);
    bottom:-100px; left:-60px;
    pointer-events:none;
  }

  .contact-left { position:relative; z-index:1; }
  .contact-left .sec-eyebrow {
    font-size:11px; font-weight:500; letter-spacing:3px;
    text-transform:uppercase; color:${C.gold};
    margin-bottom:16px;
    display:flex; align-items:center; gap:12px;
  }
  .contact-left .sec-eyebrow::before {
    content:''; width:24px; height:1px; background:${C.gold};
  }
  .contact-left h2 {
    font-family:'Bebas Neue', sans-serif;
    font-size:clamp(38px,5vw,52px);
    line-height:1; color:${C.textPri};
    margin-bottom:18px;
  }
  .contact-left p {
    font-size:15px; color:${C.textSub}; line-height:1.8;
    max-width:380px;
  }

  .contact-right {
    position:relative; z-index:1;
    display:flex; flex-direction:column; gap:10px;
    min-width:250px;
  }
  .contact-btn {
    background: rgba(255,255,255,0.03);
    border:1px solid ${C.borderNat};
    color:${C.textPri};
    padding:15px 22px;
    border-radius:8px;
    font-family:'Outfit', sans-serif;
    font-size:14px; font-weight:300;
    cursor:pointer;
    display:flex; align-items:center; gap:16px;
    transition: background 0.3s, border-color 0.3s, transform 0.2s;
  }
  .contact-btn:hover {
    background:${C.goldDim};
    border-color: rgba(200,169,94,0.3);
    transform: translateX(5px);
  }
  .contact-btn-ico {
    width:34px; height:34px;
    border-radius:6px;
    background: ${C.surfaceDim};
    border:1px solid ${C.borderNat};
    display:flex; align-items:center; justify-content:center;
    font-size:15px; flex-shrink:0;
  }

  /* ══════════ FOOTER ══════════ */
  footer {
    padding:44px 52px 32px;
    display:flex;
    flex-direction:column;
    gap:20px;
    border-top:1px solid ${C.borderNat};
  }
  .footer-main {
    display:flex;
    justify-content:space-between;
    align-items:center;
  }
  .footer-left {
    display:flex; align-items:center; gap:10px;
  }
  .footer-mark {
    width:22px; height:22px;
    border:1px solid rgba(200,169,94,0.3);
    border-radius:3px;
    display:flex; align-items:center; justify-content:center;
  }
  .footer-mark span {
    font-family:'Bebas Neue', sans-serif;
    font-size:13px; color:${C.gold}; line-height:1;
  }
  .footer-left-text {
    font-size:13px; color:${C.textSub}; font-weight:300;
  }
  .footer-right {
    font-size:11px; color:${C.textSub}; letter-spacing:1px;
  }
  .footer-credit {
    text-align:center;
    font-size:10px;
    color:rgba(200,169,94,0.4);
    font-weight:300;
    letter-spacing:0.5px;
    font-style:italic;
  }
  .footer-credit a {
    color:rgba(200,169,94,0.6);
    text-decoration:none;
    transition:color 0.3s;
  }
  .footer-credit a:hover {
    color:${C.gold};
  }

  /* ══════════ REVEAL ══════════ */
  .reveal {
    opacity:0; transform:translateY(24px);
    transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ══════════ RESPONSIVE ══════════ */
  @media (max-width:900px) {
    .skills-grid { grid-template-columns:1fr 1fr; }
    .timeline-grid { grid-template-columns:1fr; gap:48px; }
    .sec-header { flex-direction:column; align-items:flex-start; gap:18px; }
    .sec-header-right { text-align:left; }
    .contact-block { flex-direction:column; padding:56px 32px; }
    .contact-right { width:100%; }
    .hero { padding:0 28px; }
    .sec { padding:100px 28px; }
    nav { padding:20px 24px; }
    .nav-links { gap:20px; }
    footer { padding:36px 24px 28px; }
    .footer-main { flex-direction:column; gap:10px; text-align:center; }
    .project-row { grid-template-columns:40px 1fr auto; }
    .project-details { grid-column: 2 / 4; }
  }
  @media (max-width:580px) {
    .skills-grid { grid-template-columns:1fr; }
    .project-row { grid-template-columns: 1fr; padding: 24px 0; }
    .project-row-num { position: absolute; top: 24px; right: 0; font-size: 20px; }
    .project-row-arrow { display: none; }
    .project-details { grid-column: 1; }
    .project-details-inner { padding: 24px 20px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */
const skills = [
  //{ num:"01", icon:"🔍", name:"Analyse de risques SSI",  desc:"EBIOS RM · ISO 27001 · Audits de conformité SSI",  pct:62 },
  { num:"01", icon:"⚔️",  name:"Pentest & Hacking",      desc:"Metasploit · Techniques offensives",      pct:50 },
  { num:"02", icon:"🛡️",  name:"Sécurité Défensive",     desc:"SOC · Inforensique · Gestion de crise",        pct:70 },
  { num:"03", icon:"🌐", name:"Infrastructure Réseau",  desc:"Cisco/Aruba · VLAN · Palo Alto · VPN",         pct:85 },
  { num:"04", icon:"📋", name:"Gouvernance",         desc:"ISO 27001/22301 · RGPD · Plan de continuité · EBIOS RM",  pct:60 },
  { num:"05", icon:"💻", name:"Systèmes & Admin",       desc:"Windows Server · Linux · ESXi · Docker / Podman",       pct:90 },
];

const projects = [
  { 
    num:"01", 
    tags:["Pentest","BlackBox","Web"], 
    title:"Test d'intrusion BlackBox — Web Pharma", 
    desc:"Pentest externe avec rebond réseau interne sur une organisation X pharmaceutique. Compromission de services exposés et accès aux codes sources sensibles.",
    details: {
      context: "Test d'intrusion réalisé dans le cadre de la validation du point de compétence M1 (Mastère Expert en Sécurité Digitale). L'organisation X, acteur pharmaceutique national, souhaitait évaluer le risque qu'un attaquant accède et corrompe les codes sources applicatifs et médicaux depuis l'extérieur.",
      methodology: ["Reconnaissance et énumération des services exposés (Nmap, scan réseau)", "Identification et exploitation de vulnérabilités Web et réseau (Burp Suite, Metasploit)", "Compromission d'un service exposé et élévation de privilèges", "Latéralisation vers le réseau interne (192.168.11.0/24)", "Exfiltration des codes sources et recettes médicales internes", "Rédaction du rapport avec priorisation des correctifs"],
      tools: ["Kali Linux", "Nmap", "Burp Suite", "Metasploit", "DirBuster", "Proxychains", "SQLMap", "MSFVenom","Reverse Shell","CVE-2021-22205 RCE"],
      results: "Compromission complète du périmètre : accès aux codes sources sensibles obtenus, plusieurs vulnérabilités critiques identifiées et exploitées. Rapport détaillé de 20+ pages avec plan de remédiation priorisé par criticité CVSS."
    }
  },
  { 
    num:"02", 
    tags:["Gouvernance","ISO 27001","Audit"], 
    title:"Analyse de conformité ISO 27001", 
    desc:"Audit de conformité ISO 27001, recommandations et plan d'actions pour Briand Group.",
    details: {
      context: "Mission réalisée en alternance chez Briand Group (entreprise industrielle, 1000+ employés). Objectif : évaluer la posture de sécurité actuelle et mettre en conformité avec ISO 27001.",
      methodology: ["Audit initial de la posture de sécurité (inventaire des actifs, cartographie SI)", "Identification des écarts par rapport au référentiel ISO 27001/27002", "Rédaction de recommandations priorisées et plan d'actions", "Utilisation de CISO Assistant pour le suivi"],
      tools: ["CISO Assistant", "Référentiels ANSSI", "ISO 27001/27002", "Excel (matrice de risques)","GAP Analysis","Diagramme de Gantt"],
      results: "Plan de mise en conformité ISO 27001 sur 18 mois. Vue global de la maturitée du SI et présentation des écarts critiques."
    }
  },
  //{ 
  //  num:"03", 
  //  tags:["BCP","ISO 22301","Continuité"], 
  //  title:"Plan de Continuité d'Activité (PCA/PRA)", 
  //  desc:"Analyse de continuité d'activité selon ISO 22301 : identification des processus critiques, scénarios d'incident et exigences de reprise.",
  //  details: {
  //    context: "Élaboration d'un plan de continuité et de reprise d'activité pour Briand Group, aligné sur la norme ISO 22301. Analyse des impacts métier (BIA) et définition des stratégies de reprise.",
  //    methodology: ["Business Impact Analysis (BIA) : identification des activités critiques", "Définition des objectifs de reprise (RTO, RPO) par processus", "Élaboration de scénarios d'incident (cyberattaque, sinistre, panne majeure)", "Rédaction des procédures de continuité et de reprise"],
  //    tools: ["Framework ISO 22301", "Méthodologie BIA", "Templates ANSSI", "Outils de documentation (Word, Visio)"],
  //    results: "PCA/PRA complet couvrant 12 processus critiques. RTO et RPO définis pour chaque activité essentielle. Formation des équipes opérationnelles réalisée."
  //  }
  //},
  { 
    num:"03", 
    tags:["Infrastructure","Réseau","Palo Alto"], 
    title:"Sécurisation réseau d'entreprise — Segmentation & Firewall", 
    desc:"Mise en place d'une architecture réseau sécurisée avec pare-feu Palo Alto, segmentation VLAN et contrôle des flux.",
    details: {
      context: "Projet de sécurisation de l'infrastructure réseau de Briand Group. Remplacement d'un pare-feu legacy par une solution Palo Alto avec micro-segmentation.",
      methodology: ["Conception de la nouvelle architecture (segmentation par zone de sécurité)", "Configuration du pare-feu Palo Alto (règles, NAT, VPN)", "Mise en place de VLANs et de règles de contrôle d'accès inter-VLAN"],
      tools: ["Palo Alto Networks Firewall", "Cisco/Aruba switches"],
      results: "Architecture réseau segmentée. Réduction de la surface d'attaque interne. Règles de pare-feu optimisées et en amélioration continue. Politique de moindre privilège appliquée sur tous les flux."
    }
  },
];

const timeline = [
  { year:"Sept 2024 – Actuellement", title:"Mastère Expert en Sécurité Digitale", desc:"RNCP niveau 7 (Bac+5) — ENI École Saint-Herblain. Alternance chez Briand Group." },
  { year:"2023 – 2024",    title:"BUT Réseaux et Télécommunications",             desc:"Parcours Cybersécurité — IUT de Saint-Malo." },
  { year:"2021 – 2023",           title:"BTS Services Informatiques aux Organisations",           desc:"Option SISR — Lycée Carcouët, Nantes." },
  { year:"Sept 2023 – Actuellement", title:"Alternant Admin Sys & Réseaux — Briand Group",           desc:"Sécurisation réseau Palo Alto, Analyse de risques SSI, audits ISO 27001/22301." },
  { year:"Janv – Fév 2023", title:"Stage — Ateris Informatique",           desc:"Mise en place supervision réseau (LibreNMS, Grafana) pour backbone opérateur." },
  { year:"2023 – Actuellement", title:"Pratique Cyber",           desc:"Root-me (1020 pts) - TryHackMe (8000 pts)" },
];

/* ═══════════════════════════════════════════════════════
   PARTICLES — canvas léger, spores organiques
   ═══════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const createParticle = useCallback((w, h) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.4 - 0.15,
    opacity: Math.random() * 0.35 + 0.05,
    hue: Math.random() > 0.6 ? 45 : 140, // or ou vert
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      particlesRef.current = Array.from({ length: 55 }, () => createParticle(w, h));
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const color = p.hue === 45
          ? `rgba(200,169,94,${p.opacity})`
          : `rgba(90,138,106,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [createParticle]);

  return <canvas id="particles" ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */
function useInView(ref, threshold = 0.15) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return vis;
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════ */
function SkillCell({ skill }) {
  const ref = useRef(null);
  const vis = useInView(ref, 0.18);
  return (
    <div ref={ref} className="skill-cell">
      <div className="skill-cell-top">
        <span className="skill-cell-num">{skill.num}</span>
        <div className="skill-cell-icon">{skill.icon}</div>
      </div>
      <h4>{skill.name}</h4>
      <p>{skill.desc}</p>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: vis ? `${skill.pct}%` : "0%" }} />
      </div>
    </div>
  );
}

function ProjectRow({ project }) {
  const ref = useRef(null);
  const vis = useInView(ref, 0.12);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div 
        ref={ref} 
        className={`project-row reveal ${vis ? "visible" : ""} ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="project-row-num">{project.num}</span>
        <div className="project-row-mid">
          <div className="project-row-tags">{project.tags.map(t => <span key={t} className="project-row-tag">{t}</span>)}</div>
          <div className="project-row-title">{project.title}</div>
          <div className="project-row-desc">{project.desc}</div>
        </div>
        <div className="project-row-arrow">{expanded ? "↑" : "↗"}</div>
      </div>
      
      <div className={`project-details ${expanded ? "expanded" : ""}`}>
        <div className="project-details-inner">
          <h5>Contexte</h5>
          <p>{project.details.context}</p>

          <h5>Méthodologie</h5>
          <ul>
            {project.details.methodology.map((step, i) => <li key={i}>{step}</li>)}
          </ul>

          <h5>Outils utilisés</h5>
          <div className="project-tools">
            {project.details.tools.map((tool, i) => <span key={i} className="project-tool-tag">{tool}</span>)}
          </div>

          <h5>Résultats</h5>
          <p>{project.details.results}</p>
        </div>
      </div>
    </>
  );
}

function Terminal() {
  const [lines, setLines] = useState([]);
  const idxRef = useRef(0);
  const loopCountRef = useRef(0);
  const lineIdRef = useRef(0); // ← compteur global
  const timeoutRef = useRef(null);

  const commands = [
    { type: "prompt", user: "axel@kali", path: "~", command: "nmap -sV 192.168.1.0/24" },
    { type: "output", text: "Starting Nmap 7.94 scan..." },
    { type: "success", text: "✓ 15 hosts discovered" },

    { type: "prompt", user: "axel@kali", path: "~", command: "msfconsole -q" },
    { type: "output", text: "Metasploit Framework v6.3.42 loaded" },
    { type: "success", text: "✓ 2,347 exploit modules ready" },

    { type: "prompt", user: "axel@kali", path: "~", command: "burpsuite --scan target.local" },
    { type: "output", text: "Analyzing web vulnerabilities..." },
    { type: "warning", text: "⚠ SQL Injection detected on /login" },
  ];

  useEffect(() => {
    const runCommand = () => {
      if (idxRef.current >= commands.length) {
        // Relance la boucle après 3s
        timeoutRef.current = setTimeout(() => {
          setLines([]);
          loopCountRef.current += 1;
          idxRef.current = 0;
          runCommand();
        }, 3000);
        return;
      }

      const cmd = commands[idxRef.current];
      setLines(prev => [
        ...prev,
        { ...cmd, key: `line-${lineIdRef.current++}` } // ← clé unique globale
      ]);

      idxRef.current += 1;
      timeoutRef.current = setTimeout(runCommand, 600);
    };

    runCommand();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="hero-terminal">
      <div className="terminal-header">
        <div className="terminal-dot"></div>
        <div className="terminal-dot"></div>
        <div className="terminal-dot"></div>
        <span className="terminal-title">Exegol-Session</span>
      </div>

      <div className="terminal-body">
        {lines.map(line => (
          <div key={line.key} className="terminal-line visible">
            {line.type === "prompt" && (
              <span className="terminal-prompt">
                {line.user}:<span style={{ color: C.textMid }}>{line.path}</span>$ {line.command}
              </span>
            )}
            {line.type === "output" && <span className="terminal-output">{line.text}</span>}
            {line.type === "success" && <span className="terminal-success">{line.text}</span>}
            {line.type === "warning" && <span className="terminal-warning">{line.text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <>
      <Head>
        <title>Portfolio - Axel B.</title>       {/* Titre de l'onglet */}
        <link rel="icon" href="/favicon.png" /> {/* Favicon, à mettre dans /public */}
      </Head>
      <style>{CSS}</style>
      <div className="bg-layer" />

      <div className="page">
        {/* NAV */}
        <nav className={scrolled ? "scrolled" : ""}>
          <div className="nav-brand">
            <div className="nav-brand-mark"><span>α</span></div>
            <span className="nav-brand-name">Axel Blanchard</span>
          </div>
          <div className="nav-links">
            {[["skills","Compétences"],["projects","Projets"],["timeline","Parcours"],["contact","Contact"]].map(([id,l]) => (
              <a key={id} onClick={() => scrollTo(id)}>{l}</a>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section id="hero" className="hero">
          <ParticleCanvas />
          <Terminal />
          <div className="hero-content">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span>Alternant — Disponible fin 2026</span>
            </div>
            <h1 className="hero-title">
              PROTÉGER<br/>
              <span className="gold">ANALYSER</span><br/>
              <span className="outline">RÉSOUDRE</span>
            </h1>
            <div className="hero-row">
              <p className="hero-desc">
                Administrateur Infrastructure & Cybersécurité en alternance chez Briand. Spécialisé dans la sécurisation d'infrastructures réseau, les tests d'intrusion et dans l'analyse de risques SSI.
              </p>
              <button className="hero-cta" onClick={() => scrollTo("projects")}>
                Voir mes projets <span className="hero-cta-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="sec">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-header-left">
                <div className="sec-eyebrow">Compétences</div>
                <h2>CE QUE JE<br/>MAÎTRISE</h2>
              </div>
              <div className="sec-header-right">Une expertise construite sur la pratique — chaque compétence testée dans des environnements réels ou simulés.</div>
            </div>
            <div className="skills-grid">
              {skills.map((s, i) => <SkillCell key={i} skill={s} />)}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="sec">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-header-left">
                <div className="sec-eyebrow">Projets</div>
                <h2>RÉALISATIONS</h2>
              </div>
              <div className="sec-header-right">Chaque projet représente une approche méthodique — de la reconnaissance à la recommandation.</div>
            </div>
            {projects.map((p, i) => <ProjectRow key={i} project={p} />)}
          </div>
        </section>

        {/* TIMELINE */}
        <section id="timeline" className="sec">
          <div className="sec-inner">
            <div className="timeline-grid">
              <div className="timeline-left">
                <div className="sec-eyebrow" style={{ fontSize:11, fontWeight:500, letterSpacing:"3px", textTransform:"uppercase", color:C.gold, marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ display:"inline-block", width:24, height:1, background:C.gold }} />
                  Parcours
                </div>
                <h2>FORMATION &<br/>EXPÉRIENCE</h2>
                <p>Un parcours orienté depuis le début vers la Cybersécurité — de la théorie à la pratique, du banc d'école aux environnements réels.</p>
              </div>
              <div className="timeline-items">
                {timeline.map((t, i) => (
                  <div key={i} className="t-row">
                    <span className="t-year">{t.year}</span>
                    <div className="t-body">
                      <h4>{t.title}</h4>
                      <p>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="sec">
          <div className="sec-inner">
            <div className="contact-block">
              <div className="contact-left">
                <div className="sec-eyebrow">Contact</div>
                <h2>TRAVAILLONS<br/>ENSEMBLE</h2>
                <p>Je suis ouvert à des opportunités de projet ou de collaboration dans le domaine de la sécurité digitale.</p>
              </div>
              <div className="contact-right">
                <button className="contact-btn"><div className="contact-btn-ico">✉</div> axel.blanchard3@orange.fr</button>
                <button className="contact-btn" onClick={() => window.open('https://www.linkedin.com/in/axel-blanchard-a5418b230/')}>
                  <div className="contact-btn-ico">◎</div> LinkedIn
                </button>
                <button className="contact-btn" onClick={() => window.open('/CV_Axel_2026.pdf')}><div className="contact-btn-ico">⇣</div> CV (PDF)</button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-main">
            <div className="footer-left">
              <div className="footer-mark"><span>α</span></div>
              <span className="footer-left-text">Axel Blanchard — Cybersécurité & Infrastructure</span>
            </div>
            <span className="footer-right">© 2026</span>
          </div>
          <div className="footer-credit">
            Design vibe coded avec <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>
          </div>
        </footer>
      </div>
    </>
  );
}