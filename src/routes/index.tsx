import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown,
  Lightbulb,
  Lamp,
  PanelTop,
  Sun,
  TreePine,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "OnlineLighten — Modern Lighting, Delivered" },
      {
        name: "description",
        content:
          "Chandeliers, LEDs and outdoor lighting for modern homes. Order on WhatsApp.",
      },
    ],
  }),
});

const categories = [
  { slug: "chandeliers", name: "Chandeliers", Icon: Crown },
  { slug: "pendant-lights", name: "Pendant", Icon: Lamp },
  { slug: "led-lights", name: "LED", Icon: Lightbulb },
  { slug: "wall-brackets", name: "Wall", Icon: PanelTop },
  { slug: "ceiling-lights", name: "Ceiling", Icon: Sun },
  { slug: "outdoor-lighting", name: "Outdoor", Icon: TreePine },
];

/* ─────────────────────────────────────────────
   SVG Chandelier Scene — cinematic v2
   Upgrades: prism light scatter, particle field,
   animated halo rings, depth fog, shimmer chains
───────────────────────────────────────────── */
function ChandelierScene() {
  const crystalOffsets1 = [-60,-40,-20,20,40,60];
  const crystalOffsets2 = [-105,-80,-55,-28,0,28,55,80,105];
  const crystalOffsets3 = [-135,-110,-85,-60,-35,-10,10,35,60,85,110,135];

  /* prism rays shooting outward from crystal zone */
  const prismRays = [
    { angle: -70, len: 180, color: "#ff9f7a", delay: "0s" },
    { angle: -50, len: 140, color: "#ffd97a", delay: "0.4s" },
    { angle: -30, len: 200, color: "#c8f0ff", delay: "0.8s" },
    { angle: -15, len: 160, color: "#ffc8a0", delay: "1.2s" },
    { angle:  10, len: 180, color: "#f5c26b", delay: "0.2s" },
    { angle:  35, len: 150, color: "#c8f0ff", delay: "0.6s" },
    { angle:  55, len: 200, color: "#ffd97a", delay: "1.0s" },
    { angle:  72, len: 140, color: "#ffb07a", delay: "1.4s" },
  ];

  /* floating light orbs */
  const orbs = [
    { cx: 260, cy: 380, r: 3,   dur: "7s",  d: "0s"  },
    { cx: 340, cy: 450, r: 2,   dur: "9s",  d: "2s"  },
    { cx: 390, cy: 320, r: 1.5, dur: "11s", d: "4s"  },
    { cx: 510, cy: 360, r: 2.5, dur: "8s",  d: "1s"  },
    { cx: 560, cy: 480, r: 1.5, dur: "13s", d: "3s"  },
    { cx: 620, cy: 340, r: 2,   dur: "10s", d: "5s"  },
    { cx: 430, cy: 500, r: 1,   dur: "12s", d: "6s"  },
    { cx: 475, cy: 420, r: 2,   dur: "6s",  d: "1.5s"},
    { cx: 300, cy: 520, r: 1.5, dur: "14s", d: "7s"  },
    { cx: 650, cy: 410, r: 1,   dur: "9s",  d: "3.5s"},
  ];

  return (
    <svg
      viewBox="0 0 900 700"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Deep dark room — cool near edges, warm near source */}
        <radialGradient id="roomBg" cx="50%" cy="18%" r="65%">
          <stop offset="0%"   stopColor="#2a1c08" stopOpacity="1" />
          <stop offset="40%"  stopColor="#110b03" stopOpacity="1" />
          <stop offset="100%" stopColor="#050302" stopOpacity="1" />
        </radialGradient>

        {/* Warm ceiling halo */}
        <radialGradient id="ceilHalo" cx="50%" cy="0%" r="55%">
          <stop offset="0%"   stopColor="#f5c26b" stopOpacity="0.45" />
          <stop offset="60%"  stopColor="#c87e20" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c87e20" stopOpacity="0" />
        </radialGradient>

        {/* Main light cone */}
        <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffd97a" stopOpacity="0.55" />
          <stop offset="40%"  stopColor="#f5a623" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
        </linearGradient>

        {/* Crystal facet — icy blue-white */}
        <linearGradient id="crystalIce" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%"  stopColor="#c8ecff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f0c040" stopOpacity="0.5" />
        </linearGradient>

        {/* Gold metal */}
        <linearGradient id="goldMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f5e6a0" />
          <stop offset="40%"  stopColor="#d4a84b" />
          <stop offset="100%" stopColor="#8a5c10" />
        </linearGradient>

        {/* Floor marble */}
        <radialGradient id="floorGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#f5c26b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f5c26b" stopOpacity="0" />
        </radialGradient>

        {/* Soft bloom filter */}
        <filter id="bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Heavy glow for orb */}
        <filter id="orbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        {/* Flame soft */}
        <filter id="flameSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Haze for depth fog */}
        <filter id="haze" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="22" />
        </filter>

        <style>{`
          /* ── KEYFRAMES ── */
          @keyframes pendulum {
            0%,100% { transform: rotate(-2deg); }
            50%      { transform: rotate(2deg);  }
          }
          @keyframes pendulumFast {
            0%,100% { transform: rotate(-1.2deg); }
            50%      { transform: rotate(1.2deg);  }
          }
          @keyframes flicker {
            0%,100% { opacity:1;    transform: scaleY(1)   scaleX(1);   }
            8%      { opacity:0.82; transform: scaleY(0.9) scaleX(1.1); }
            16%     { opacity:1;    transform: scaleY(1.1) scaleX(0.9); }
            44%     { opacity:0.91; transform: scaleY(0.95) scaleX(1);  }
            60%     { opacity:1;    transform: scaleY(1.05) scaleX(1);  }
            78%     { opacity:0.88; transform: scaleY(0.92) scaleX(1.1);}
          }
          @keyframes crystalPulse {
            0%,100% { opacity:0.75; filter: brightness(1);   }
            33%     { opacity:1;    filter: brightness(1.35); }
            66%     { opacity:0.65; filter: brightness(0.9);  }
          }
          @keyframes prismFlash {
            0%,100% { opacity:0;    }
            10%,90% { opacity:0;    }
            40%,60% { opacity:0.55; }
            50%     { opacity:0.8;  }
          }
          @keyframes haloRing {
            0%   { r: 50;  opacity:0.55; }
            50%  { r: 90;  opacity:0.15; }
            100% { r: 130; opacity:0;    }
          }
          @keyframes orbFloat {
            0%   { transform: translate(0,0);   opacity:0;   }
            10%  { opacity:0.8; }
            50%  { transform: translate(-12px,-45px); opacity:0.6; }
            90%  { opacity:0.3; }
            100% { transform: translate(8px,-80px);  opacity:0;   }
          }
          @keyframes coneBreath {
            0%,100% { opacity:0.75; }
            40%     { opacity:0.55; }
            70%     { opacity:0.88; }
          }
          @keyframes wallSconce {
            0%,100% { opacity:0.12; }
            50%     { opacity:0.22; }
          }
          @keyframes chainSway {
            0%,100% { transform: rotate(-0.8deg); }
            50%      { transform: rotate(0.8deg);  }
          }
          @keyframes glintSpin {
            0%   { transform: rotate(0deg)   scale(1);   opacity:0.8; }
            25%  { transform: rotate(90deg)  scale(1.5); opacity:1;   }
            50%  { transform: rotate(180deg) scale(1);   opacity:0.6; }
            75%  { transform: rotate(270deg) scale(1.4); opacity:0.9; }
            100% { transform: rotate(360deg) scale(1);   opacity:0.8; }
          }
          @keyframes fogDrift {
            0%   { transform: translateX(0)   opacity:0.04; }
            50%  { transform: translateX(30px) opacity:0.07; }
            100% { transform: translateX(0)   opacity:0.04; }
          }

          /* ── CLASSES ── */
          .c-main {
            transform-origin: 450px 2px;
            animation: pendulum 7s cubic-bezier(.45,.05,.55,.95) infinite;
          }
          .c-tier3 {
            transform-origin: 450px 2px;
            animation: pendulum 7.3s cubic-bezier(.45,.05,.55,.95) infinite;
            animation-delay: 0.15s;
          }
          .flame { transform-origin: center bottom; animation: flicker 3.2s ease-in-out infinite; }
          .flame2 { transform-origin: center bottom; animation: flicker 2.8s ease-in-out infinite; animation-delay: 0.5s; }
          .flame3 { transform-origin: center bottom; animation: flicker 3.6s ease-in-out infinite; animation-delay: 1.1s; }
          .flame4 { transform-origin: center bottom; animation: flicker 3.0s ease-in-out infinite; animation-delay: 0.8s; }

          .xtal { animation: crystalPulse 3s ease-in-out infinite; }
          .xtal:nth-child(2n) { animation-delay:0.45s; }
          .xtal:nth-child(3n) { animation-delay:0.9s;  }
          .xtal:nth-child(4n) { animation-delay:1.35s; }
          .xtal:nth-child(5n) { animation-delay:1.8s;  }

          .pray { animation: prismFlash 5s ease-in-out infinite; }
          .pray:nth-child(2n) { animation-delay:0.6s;  }
          .pray:nth-child(3n) { animation-delay:1.2s;  }
          .pray:nth-child(4n) { animation-delay:1.8s;  }
          .pray:nth-child(5n) { animation-delay:2.4s;  }
          .pray:nth-child(6n) { animation-delay:3.0s;  }

          .hring { animation: haloRing 3s ease-out infinite; }
          .hring2{ animation: haloRing 3s ease-out infinite; animation-delay:1s; }
          .hring3{ animation: haloRing 3s ease-out infinite; animation-delay:2s; }

          .light-cone { animation: coneBreath 4s ease-in-out infinite; }
          .sconce-l   { animation: wallSconce 5s ease-in-out infinite; }
          .sconce-r   { animation: wallSconce 5s ease-in-out infinite; animation-delay:2.5s; }
          .glint      { transform-origin: center; animation: glintSpin 4s linear infinite; }
          .glint2     { transform-origin: center; animation: glintSpin 4s linear infinite; animation-delay:2s; }
          .fog        { animation: fogDrift 12s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ── 1. DEEP BACKGROUND ── */}
      <rect width="900" height="700" fill="url(#roomBg)" />

      {/* Architectural panelling — subtle perspective lines */}
      {/* Ceiling coffers */}
      <line x1="0" y1="0"   x2="450" y2="60"  stroke="#1e1408" strokeWidth="0.6" opacity="0.6"/>
      <line x1="900" y1="0" x2="450" y2="60"  stroke="#1e1408" strokeWidth="0.6" opacity="0.6"/>
      <line x1="0" y1="0"   x2="450" y2="60"  stroke="#1e1408" strokeWidth="0.6" opacity="0.4" transform="translate(200,0)"/>
      <line x1="900" y1="0" x2="450" y2="60"  stroke="#1e1408" strokeWidth="0.6" opacity="0.4" transform="translate(-200,0)"/>
      {/* Horizon / baseboard */}
      <rect x="0" y="555" width="900" height="4" fill="#1c1308" opacity="0.8"/>
      <rect x="0" y="559" width="900" height="2" fill="#241a0a" opacity="0.5"/>
      {/* Floor */}
      <rect x="0" y="561" width="900" height="139" fill="#0d0904"/>
      {/* Floor tile grid */}
      {[0,1,2,3,4,5].map(i=>(
        <line key={`fv${i}`} x1={i*180} y1="561" x2={i*180+90} y2="700" stroke="#161008" strokeWidth="0.8"/>
      ))}
      {[0,1,2].map(i=>(
        <line key={`fh${i}`} x1="0" y1={610+i*40} x2="900" y2={610+i*40} stroke="#161008" strokeWidth="0.5"/>
      ))}

      {/* Wall sconces — left & right ambient light blobs */}
      <ellipse className="sconce-l" cx="60" cy="320" rx="80" ry="180" fill="#c87e20" opacity="0.12" filter="url(#haze)"/>
      <ellipse className="sconce-r" cx="840" cy="320" rx="80" ry="180" fill="#c87e20" opacity="0.12" filter="url(#haze)"/>

      {/* Depth fog layer */}
      <rect className="fog" x="0" y="400" width="900" height="200" fill="#c87e20" opacity="0.04" filter="url(#haze)"/>

      {/* Ceiling warm halo */}
      <rect width="900" height="120" fill="url(#ceilHalo)"/>

      {/* ── 2. LIGHT CONE (behind chandelier) ── */}
      <g className="light-cone">
        {/* Outer soft cone */}
        <polygon points="450,298 80,700 820,700" fill="url(#coneGrad)" opacity="0.5"/>
        {/* Mid cone */}
        <polygon points="450,298 220,700 680,700" fill="url(#coneGrad)" opacity="0.35"/>
        {/* Inner bright shaft */}
        <polygon points="450,298 370,700 530,700" fill="url(#coneGrad)" opacity="0.45"/>
        {/* Tight core */}
        <polygon points="450,298 415,700 485,700" fill="#ffd97a" opacity="0.12"/>
      </g>

      {/* ── 3. PRISM SCATTER RAYS ── */}
      <g>
        {prismRays.map((r, i) => {
          const rad = (r.angle * Math.PI) / 180;
          const x2 = 450 + Math.sin(rad) * r.len;
          const y2 = 290 + Math.cos(rad) * r.len;
          return (
            <line
              key={i}
              className="pray"
              x1="450" y1="290"
              x2={x2} y2={y2}
              stroke={r.color}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              style={{ animationDelay: r.delay }}
            />
          );
        })}
      </g>

      {/* ── 4. PULSING HALO RINGS ── */}
      <g opacity="0.6">
        <circle className="hring"  cx="450" cy="290" r="50"  fill="none" stroke="#f5c26b" strokeWidth="1.5" strokeOpacity="0.6"/>
        <circle className="hring2" cx="450" cy="290" r="50"  fill="none" stroke="#ffd97a" strokeWidth="1"   strokeOpacity="0.4"/>
        <circle className="hring3" cx="450" cy="290" r="50"  fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3"/>
      </g>

      {/* ── 5. CHANDELIER (main sway) ── */}
      <g className="c-main">

        {/* Ceiling canopy */}
        <ellipse cx="450" cy="12" rx="30" ry="9" fill="url(#goldMetal)"/>
        <ellipse cx="450" cy="9"  rx="22" ry="6" fill="#f5e6a0" opacity="0.6"/>

        {/* Drop rod */}
        <rect x="447" y="18" width="6" height="52" fill="url(#goldMetal)" rx="2"/>

        {/* ── TIER A — top collar ── */}
        <ellipse cx="450" cy="74" rx="26" ry="9" fill="url(#goldMetal)"/>
        <ellipse cx="450" cy="70" rx="18" ry="6" fill="#f5e6a0" opacity="0.5"/>

        {/* Tier A spoke arms */}
        {crystalOffsets1.map((x,i) => (
          <line key={i} x1="450" y1="73" x2={450+x} y2={90+(Math.abs(x)/30)*8}
            stroke="url(#goldMetal)" strokeWidth="2.2"/>
        ))}

        {/* Tier A crystals — diamond-facet shapes */}
        {crystalOffsets1.map((x,i) => {
          const cy = 96 + (Math.abs(x)/30)*8;
          return (
            <g key={i} className="xtal" style={{animationDelay:`${i*0.38}s`}}>
              {/* main prism body */}
              <polygon
                points={`${450+x},${cy-10} ${450+x+5},${cy} ${450+x},${cy+14} ${450+x-5},${cy}`}
                fill="url(#crystalIce)" opacity="0.92" filter="url(#bloom)"
              />
              {/* inner bright facet */}
              <polygon
                points={`${450+x-1},${cy-6} ${450+x+2},${cy-1} ${450+x},${cy+5} ${450+x-2},${cy}`}
                fill="#ffffff" opacity="0.55"
              />
            </g>
          );
        })}

        {/* ── Center rod B ── */}
        <rect x="447" y="74" width="6" height="46" fill="url(#goldMetal)" rx="2"/>

        {/* ── TIER B — wide ring ── */}
        <ellipse cx="450" cy="122" rx="108" ry="13" fill="none" stroke="url(#goldMetal)" strokeWidth="3.5"/>
        {/* Decorative studs on ring */}
        {[-108,-72,-36,0,36,72,108].map((x,i)=>(
          <ellipse key={i} cx={450+x} cy="122" rx="4" ry="4"
            fill="#f5e6a0" opacity="0.7" filter="url(#bloom)"/>
        ))}

        {/* Tier B spokes */}
        {crystalOffsets2.map((x,i) => (
          <line key={i} x1="450" y1="121" x2={450+x} y2={142+(Math.abs(x)/40)*6}
            stroke="url(#goldMetal)" strokeWidth="2"/>
        ))}

        {/* Tier B crystals — longer teardrop */}
        {crystalOffsets2.map((x,i) => {
          const cy = 152 + (Math.abs(x)/40)*6;
          const ht = 14 + (i%3)*4;
          return (
            <g key={i} className="xtal" style={{animationDelay:`${i*0.28}s`}}>
              <polygon
                points={`${450+x},${cy-12} ${450+x+6},${cy+2} ${450+x},${cy+ht} ${450+x-6},${cy+2}`}
                fill="url(#crystalIce)" opacity="0.95" filter="url(#bloom)"
              />
              <polygon
                points={`${450+x-1},${cy-7} ${450+x+3},${cy+2} ${450+x},${cy+8} ${450+x-2},${cy+1}`}
                fill="#c8ecff" opacity="0.6"
              />
            </g>
          );
        })}

        {/* ── Globe body ── */}
        <rect x="447" y="122" width="6" height="36" fill="url(#goldMetal)" rx="2"/>
        {/* Outer globe */}
        <ellipse cx="450" cy="178" rx="32" ry="24" fill="#1a1206" stroke="url(#goldMetal)" strokeWidth="2.5"/>
        {/* Inner globe glow */}
        <ellipse cx="450" cy="175" rx="22" ry="16" fill="#2e1f07" stroke="#d4a84b" strokeWidth="1"/>
        {/* Globe equator band */}
        <ellipse cx="450" cy="178" rx="32" ry="6" fill="none" stroke="#c8a45a" strokeWidth="1" opacity="0.5"/>

        {/* ── CANDLE ARMS — 8 arms radially ── */}
        {[
          {dx:58, dy:18, fc:"flame"},
          {dx:-58, dy:18, fc:"flame2"},
          {dx:42, dy:28, fc:"flame3"},
          {dx:-42, dy:28, fc:"flame4"},
          {dx:70, dy:10, fc:"flame2"},
          {dx:-70, dy:10, fc:"flame3"},
          {dx:28, dy:32, fc:"flame4"},
          {dx:-28, dy:32, fc:"flame"},
        ].map(({dx,dy,fc},i)=>{
          const ax = 450+dx, ay = 175+dy;
          return (
            <g key={i}>
              {/* curved arm */}
              <path d={`M450,190 Q${450+dx*0.5},${190+dy*0.3} ${ax},${ay}`}
                fill="none" stroke="url(#goldMetal)" strokeWidth="2.5" strokeLinecap="round"/>
              {/* bobeche cup */}
              <ellipse cx={ax} cy={ay} rx="8" ry="4" fill="url(#goldMetal)"/>
              {/* candle wax */}
              <rect x={ax-3.5} y={ay-16} width="7" height="16" rx="1.5" fill="#f0e4c8" opacity="0.9"/>
              {/* wax drip detail */}
              <path d={`M${ax+3.5},${ay-10} Q${ax+5},${ay-6} ${ax+3},${ay-2}`}
                fill="none" stroke="#e8d8b0" strokeWidth="1.5" opacity="0.5"/>
              {/* flame */}
              <g className={fc}>
                {/* outer flame bloom */}
                <ellipse cx={ax} cy={ay-22} rx="7"   ry="10"  fill="#ff9933" opacity="0.35" filter="url(#flameSoft)"/>
                {/* main flame body */}
                <ellipse cx={ax} cy={ay-20} rx="4.5" ry="8"   fill="#ffcc33" opacity="0.9"/>
                {/* bright inner */}
                <ellipse cx={ax} cy={ay-19} rx="2.5" ry="5.5" fill="#fff4a0" opacity="0.95"/>
                {/* hot white core */}
                <ellipse cx={ax} cy={ay-18} rx="1.2" ry="3"   fill="#ffffff" opacity="0.85"/>
              </g>
            </g>
          );
        })}

        {/* ── Central warm orb glow ── */}
        <ellipse cx="450" cy="185" rx="55" ry="50" fill="#ffd97a" opacity="0.08" filter="url(#orbGlow)"/>
        <ellipse cx="450" cy="185" rx="28" ry="25" fill="#ffd97a" opacity="0.12" filter="url(#orbGlow)"/>

      </g>

      {/* ── TIER C (slight independent sway) ── */}
      <g className="c-tier3">
        {/* Connecting rod */}
        <rect x="447" y="200" width="6" height="38" fill="url(#goldMetal)" rx="2"/>

        {/* Tier C outer ring */}
        <ellipse cx="450" cy="240" rx="140" ry="15" fill="none" stroke="url(#goldMetal)" strokeWidth="4"/>
        {/* Inner decorative ring */}
        <ellipse cx="450" cy="240" rx="118" ry="10" fill="none" stroke="#c8a45a" strokeWidth="1" opacity="0.45"/>

        {/* Ring studs */}
        {[-140,-105,-70,-35,0,35,70,105,140].map((x,i)=>(
          <ellipse key={i} cx={450+x} cy="240" rx="4.5" ry="4.5"
            fill="#f5e6a0" opacity="0.65" filter="url(#bloom)"/>
        ))}

        {/* Tier C crystal drop chains */}
        {crystalOffsets3.map((x,i) => {
          const chainLen = 20 + (i%4)*10;
          const cy1 = 248, cy2 = cy1 + chainLen;
          return (
            <g key={i} className="xtal" style={{animationDelay:`${i*0.22}s`}}>
              {/* chain links */}
              <line x1={450+x} y1={cy1} x2={450+x} y2={cy1+8}
                stroke="#c8a45a" strokeWidth="1.2"/>
              <ellipse cx={450+x} cy={cy1+11} rx="3.5" ry="2.5"
                fill="none" stroke="#c8a45a" strokeWidth="1"/>
              <line x1={450+x} y1={cy1+14} x2={450+x} y2={cy1+chainLen-4}
                stroke="#c8a45a" strokeWidth="1.2"/>
              {/* crystal prism — varied sizes */}
              <polygon
                points={`
                  ${450+x},${cy2-14}
                  ${450+x+(4+i%3)},${cy2}
                  ${450+x},${cy2+(16+i%4*3)}
                  ${450+x-(4+i%3)},${cy2}
                `}
                fill="url(#crystalIce)" opacity="0.95" filter="url(#bloom)"
              />
              <polygon
                points={`
                  ${450+x-1},${cy2-9}
                  ${450+x+2},${cy2-1}
                  ${450+x},${cy2+6}
                  ${450+x-2},${cy2}
                `}
                fill="#c8ecff" opacity="0.65"
              />
            </g>
          );
        })}
      </g>

      {/* ── 6. GLINT STARS on brightest crystals ── */}
      {[
        {cx:450-135, cy:280, s:0.9},
        {cx:450+135, cy:280, s:0.8},
        {cx:450,     cy:265, s:1.1},
        {cx:450-105, cy:170, s:0.7},
        {cx:450+105, cy:170, s:0.7},
      ].map(({cx,cy,s},i)=>(
        <g key={i} className={i%2===0?"glint":"glint2"} style={{transformOrigin:`${cx}px ${cy}px`, animationDelay:`${i*0.8}s`}}>
          <line x1={cx-8*s} y1={cy} x2={cx+8*s} y2={cy} stroke="#ffffff" strokeWidth="0.8" opacity="0.7"/>
          <line x1={cx} y1={cy-8*s} x2={cx} y2={cy+8*s} stroke="#ffffff" strokeWidth="0.8" opacity="0.7"/>
          <line x1={cx-5*s} y1={cy-5*s} x2={cx+5*s} y2={cy+5*s} stroke="#fff4a0" strokeWidth="0.5" opacity="0.5"/>
          <line x1={cx+5*s} y1={cy-5*s} x2={cx-5*s} y2={cy+5*s} stroke="#fff4a0" strokeWidth="0.5" opacity="0.5"/>
        </g>
      ))}

      {/* ── 7. FLOATING LIGHT ORBS ── */}
      {orbs.map((o,i)=>(
        <circle key={i} cx={o.cx} cy={o.cy} r={o.r}
          fill="#ffd97a" opacity="0"
          style={{
            animation:`orbFloat ${o.dur} ease-in-out infinite`,
            animationDelay: o.d,
          }}
          filter="url(#bloom)"
        />
      ))}

      {/* ── 8. FLOOR REFLECTION ── */}
      <ellipse cx="450" cy="580" rx="220" ry="28" fill="url(#floorGlow)"/>
      {/* Specular spot */}
      <ellipse cx="450" cy="578" rx="60" ry="8" fill="#f5c26b" opacity="0.12"/>
    </svg>
  );
}

function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  const { data: allProducts, isLoading: loadingAll } = useQuery({
    queryKey: ["products", "home-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  return (
    <div>
      {/* ─────────── HERO — animated chandelier parlour ─────────── */}
      <section className="relative overflow-hidden bg-[#0d0a04] text-glow" style={{ minHeight: "clamp(420px, 65vh, 88vh)" }}>
        {/* SVG animated chandelier scene */}
        <ChandelierScene />

        {/* Text content overlay */}
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-12 sm:py-20 sm:px-6 lg:px-8" style={{ minHeight: "clamp(420px, 65vh, 88vh)" }}>
          <div className="max-w-xl animate-fade-up">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur"
              style={{
                borderColor: "rgba(212,168,75,0.4)",
                background: "rgba(212,168,75,0.06)",
                color: "#d4a84b",
              }}
            >
              <Sparkles className="h-3 w-3" /> OnlineLighten
            </span>
            <h1
              className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
              style={{ color: "#f5e6c0" }}
            >
              Light that{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#f5c26b,#d4a84b,#f5e6c0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                moves you.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm sm:text-base" style={{ color: "rgba(245,230,192,0.75)" }}>
              Hand-picked chandeliers, LEDs and outdoor fixtures — modern design, delivered nationwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-glow transition-all hover:scale-[1.02]"
                style={{ background: "#d4a84b", color: "#0d0a04" }}
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/5"
                style={{ borderColor: "rgba(245,230,192,0.25)", color: "#f5e6c0" }}
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── USP ─────────── */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 grid-cols-3 sm:px-6 sm:py-8 lg:px-8">
          {[
            { icon: Zap, title: "Power" },
            { icon: Eye, title: "Visibility" },
            { icon: ShieldCheck, title: "Security" },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-gold">
                <f.icon className="h-4 w-4" />
              </span>
              <p className="font-display text-sm font-semibold sm:text-base">
                {f.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── CATEGORIES — animated color sweep ─────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-10 sm:pb-20 lg:px-8">
        <style>{`
          /* ── continuous wave that travels left→right across every tile ── */
          @keyframes waveMove {
            0%   { background-position: -200% center; }
            100% { background-position: 300% center; }
          }
          /* border gradient orbit */
          @keyframes borderOrbit {
            0%   { background-position: 0%   50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0%   50%; }
          }
          @keyframes iconPop {
            0%,100% { transform: scale(1) rotate(0deg); }
            50%     { transform: scale(1.18) rotate(-8deg); }
          }
          @keyframes iconFloat {
            0%,100% { transform: translateY(0px); }
            50%     { transform: translateY(-3px); }
          }

          /* base tile */
          .cat-tile {
            position: relative;
            overflow: hidden;
            border-radius: 1rem;
            border: 1px solid rgba(212,168,75,0.18);
            background: #111008;
            transition: transform 0.4s cubic-bezier(.22,1,.36,1),
                        box-shadow 0.4s ease,
                        border-color 0.4s ease;
          }

          /* ── The travelling wave layer (always present, slow idle speed) ── */
          .cat-tile::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              105deg,
              transparent       0%,
              transparent      30%,
              rgba(212,168,75,0.06) 38%,
              rgba(245,194,107,0.14) 44%,
              rgba(255,240,180,0.20) 50%,
              rgba(245,194,107,0.14) 56%,
              rgba(212,168,75,0.06) 62%,
              transparent      70%,
              transparent      100%
            );
            background-size: 250% 100%;
            animation: waveMove 4s linear infinite;
            pointer-events: none;
          }

          /* ── Glowing border on hover ── */
          .cat-tile::after {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(
              270deg,
              #c87e20, #f5c26b, #fff4c0, #d4a84b, #c87e20
            );
            background-size: 300% 300%;
            -webkit-mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.35s ease;
            pointer-events: none;
          }

          .cat-tile:hover {
            transform: translateY(-5px) scale(1.03);
            box-shadow:
              0 16px 40px -10px rgba(212,168,75,0.4),
              0 0 0 1px rgba(212,168,75,0.25);
            border-color: transparent;
          }
          .cat-tile:hover::before {
            /* speed up the wave on hover */
            animation: waveMove 1.4s linear infinite;
          }
          .cat-tile:hover::after {
            opacity: 1;
            animation: borderOrbit 2s linear infinite;
          }
          .cat-tile:hover .cat-icon {
            background: linear-gradient(135deg, #d4a84b, #f5c26b);
            color: #0d0a04;
            box-shadow: 0 0 18px rgba(212,168,75,0.55);
            animation: iconPop 0.4s ease, iconFloat 2s ease-in-out 0.4s infinite;
          }
          .cat-tile:hover .cat-name {
            color: #f5e6c0;
          }
          .cat-tile:hover .cat-arrow {
            color: #f5c26b;
            letter-spacing: 0.12em;
          }

          .cat-icon {
            background: rgba(212,168,75,0.1);
            color: #d4a84b;
            border-radius: 9999px;
            width: 2.5rem; height: 2.5rem;
            display: grid; place-items: center;
            transition: background 0.35s ease, color 0.35s ease,
                        box-shadow 0.35s ease;
          }
          .cat-name {
            color: rgba(245,230,192,0.85);
            transition: color 0.3s ease;
          }
          .cat-arrow {
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(212,168,75,0.6);
            transition: color 0.35s ease, letter-spacing 0.4s ease;
          }

          /* stagger the wave start per tile so they don't all pulse in sync */
          .cat-tile:nth-child(1)::before { animation-delay: 0s;    }
          .cat-tile:nth-child(2)::before { animation-delay: -0.7s; }
          .cat-tile:nth-child(3)::before { animation-delay: -1.4s; }
          .cat-tile:nth-child(4)::before { animation-delay: -2.1s; }
          .cat-tile:nth-child(5)::before { animation-delay: -2.8s; }
          .cat-tile:nth-child(6)::before { animation-delay: -3.5s; }
        `}</style>

        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
              Collections
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map(({ slug, name, Icon }, idx) => (
            <Link
              key={slug}
              to="/category/$slug"
              params={{ slug }}
              className="cat-tile flex aspect-square flex-col items-center justify-center p-3 text-center"
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <span className="cat-icon">
                <Icon className="h-5 w-5" />
              </span>
              <p
                className="cat-name relative mt-2 font-display text-sm font-semibold sm:text-base"
              >
                {name}
              </p>
              <p className="cat-arrow relative mt-0.5">Shop →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────── FEATURED CAROUSEL ─────────── */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-6 flex items-end justify-between sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
                Curated
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">
                Featured
              </h2>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <FeaturedCarousel products={featured} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No featured products yet.
            </p>
          )}
        </div>
      </section>

      {/* ─────────── ALL PRODUCTS ─────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
              Catalog
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">
              All products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm"
          >
            View all →
          </Link>
        </div>
        {loadingAll ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : allProducts && allProducts.length > 0 ? (
          <AllProductsPaginated products={allProducts} />
        ) : (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pagination
───────────────────────────────────────────── */
const PAGE_SIZE = 8;

function AllProductsPaginated({ products }: { products: ProductCardData[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paged = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );
  const go = (p: number) => {
    setPage(p);
    const el = document.getElementById("home-all-products-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div id="home-all-products-top">
      <div
        key={page}
        className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 animate-fade-in-page"
      >
        {paged.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={page === 1 && i < 4} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => go(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40 transition hover:bg-muted"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i + 1)}
              className={`h-9 min-w-9 rounded-full border px-3 text-xs font-semibold ${
                page === i + 1
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => go(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40 transition hover:bg-muted"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Carousel
───────────────────────────────────────────── */
function FeaturedCarousel({ products }: { products: ProductCardData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="min-w-0 shrink-0 grow-0 basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/4"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Previous"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute -left-2 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-soft hover:bg-muted sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        aria-label="Next"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute -right-2 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-soft hover:bg-muted sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-6 flex justify-center gap-1.5">
        {snaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === selected ? "w-6 bg-gold" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}