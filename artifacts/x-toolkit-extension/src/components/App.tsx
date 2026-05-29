import { useState, useEffect, useCallback } from "react";
import { useStorage } from "../hooks/useStorage";
import { TempMailTab } from "./tabs/TempMailTab";
import { GmailTab } from "./tabs/GmailTab";
import { HistoryTab } from "./tabs/HistoryTab";

type Tab = "tempmail" | "gmail" | "history";

const SITE_URL = "https://xtoolkit.live";
const TAB_STORAGE_KEY = "activePopupTab";

function DisposableIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GmailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5V6.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M2 7l8.293 5.862a3 3 0 0 0 3.414 0L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ClockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const TABS: { id: Tab; label: string; icon: (p: { active: boolean }) => React.ReactNode }[] = [
  {
    id: "tempmail",
    label: "Disposable",
    icon: ({ active }) => <DisposableIcon size={active ? 20 : 18} />,
  },
  {
    id: "gmail",
    label: "Temp Gmail",
    icon: ({ active }) => <GmailIcon size={active ? 20 : 18} />,
  },
  {
    id: "history",
    label: "History",
    icon: ({ active }) => <ClockIcon size={active ? 20 : 18} />,
  },
];

export function App() {
  const [tab, setTabState] = useState<Tab>("tempmail");
  const { state, setState, patch, ready } = useStorage();

  useEffect(() => {
    chrome.storage.local.get(TAB_STORAGE_KEY, (result) => {
      const saved = result[TAB_STORAGE_KEY] as Tab | undefined;
      if (saved === "tempmail" || saved === "gmail" || saved === "history") {
        setTabState(saved);
      }
    });
  }, []);

  const setTab = useCallback((newTab: Tab) => {
    setTabState(newTab);
    chrome.storage.local.set({ [TAB_STORAGE_KEY]: newTab });
  }, []);

  return (
    <div
      style={{ width: 400, height: 580, background: "#080c14", color: "#e7e9ea", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Top logo bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px 8px",
          borderBottom: "1px solid #1e2a3a",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, overflow: "hidden", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="eBg" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#09071a"/>
                  <stop offset="100%" stopColor="#110d24"/>
                </linearGradient>
                <linearGradient id="eFront" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#c4b5fd"/>
                  <stop offset="45%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#4c1d95"/>
                </linearGradient>
                <radialGradient id="eGlow" cx="90" cy="90" r="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22"/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect width="180" height="180" rx="36" fill="url(#eBg)"/>
              <rect width="180" height="180" rx="36" fill="url(#eGlow)"/>
              <g stroke="#120a2e" strokeLinecap="round" fill="none" transform="translate(6,6)">
                <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
              </g>
              <g stroke="#120a2e" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(6,6)">
                <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
              </g>
              <g stroke="#1d1050" strokeLinecap="round" fill="none" transform="translate(4,4)">
                <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
              </g>
              <g stroke="#1d1050" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(4,4)">
                <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
              </g>
              <g stroke="#2e1878" strokeLinecap="round" fill="none" transform="translate(2,2)">
                <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
              </g>
              <g stroke="#2e1878" strokeLinecap="square" strokeLinejoin="miter" fill="none" transform="translate(2,2)">
                <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
              </g>
              <g stroke="url(#eFront)" strokeLinecap="round" fill="none">
                <line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/>
              </g>
              <g stroke="url(#eFront)" strokeLinecap="square" strokeLinejoin="miter" fill="none">
                <polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/>
              </g>
              <g stroke="white" strokeLinecap="round" fill="none" opacity="0.18">
                <line x1="58" y1="44" x2="122" y2="136" strokeWidth="5"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="5"/>
              </g>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#e7e9ea", letterSpacing: "-0.2px" }}>X Toolkit</span>
        </div>
        <span style={{ fontSize: 11, color: "#71767b", marginLeft: 2, marginTop: 1 }}>Temp Email & Gmail</span>
        <div style={{ flex: 1 }} />
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="44+ free tools at xtoolkit.live"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            color: "#7c3aed", textDecoration: "none",
            fontSize: 10, fontWeight: 600,
          }}
        >
          44+ tools
          <ExternalLinkIcon />
        </a>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "tempmail" && (
          <TempMailTab
            state={state}
            setState={setState}
            patch={patch}
            ready={ready}
            onSwitchToGmail={() => setTab("gmail")}
          />
        )}
        {tab === "gmail" && (
          <GmailTab
            state={state}
            setState={setState}
            patch={patch}
            ready={ready}
            onSwitchToDisposable={() => setTab("tempmail")}
          />
        )}
        {tab === "history" && <HistoryTab state={state} patch={patch} setTab={setTab} />}
      </div>

      {/* Bottom tab bar */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #1e2a3a",
          background: "#080c14",
          flexShrink: 0,
        }}
      >
        {TABS.map(({ id, label, icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "8px 4px 7px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: active ? "#1d9bf0" : "#71767b",
                transition: "color 0.15s",
                borderTop: active ? "2px solid #1d9bf0" : "2px solid transparent",
                marginTop: -1,
              }}
            >
              {icon({ active })}
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: "0.2px" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Website promo footer */}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          padding: "5px 12px",
          background: "#050a10",
          borderTop: "1px solid #0f1e2e",
          textDecoration: "none",
          color: "#3d5a7a",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        <span>Want 44+ more tools?</span>
        <span style={{ color: "#7c3aed", fontWeight: 600 }}>Visit xtoolkit.live →</span>
      </a>
    </div>
  );
}
