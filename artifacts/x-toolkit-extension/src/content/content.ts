(() => {
  const POPUP_ID = "__xtoolkit_popup__";

  const EMAIL_SELECTORS = [
    'input[type="email"]',
    'input[name*="email" i]',
    'input[id*="email" i]',
    'input[placeholder*="email" i]',
    'input[autocomplete="email"]',
    'input[autocomplete="username"]',
  ].join(",");

  const injectedInputs = new WeakSet<HTMLInputElement>();
  const inputButtonMap = new WeakMap<HTMLInputElement, HTMLButtonElement>();

  let popup: HTMLElement | null = null;
  let currentInput: HTMLInputElement | null = null;

  function logoSvg(): string {
    return `<svg width="14" height="14" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xtkFront" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#c4b5fd"/>
          <stop offset="45%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#4c1d95"/>
        </linearGradient>
      </defs>
      <g stroke="url(#xtkFront)" stroke-linecap="round" fill="none">
        <line x1="58" y1="44" x2="122" y2="136" stroke-width="28"/>
        <line x1="122" y1="44" x2="58" y2="136" stroke-width="28"/>
      </g>
      <g stroke="url(#xtkFront)" stroke-linecap="square" stroke-linejoin="miter" fill="none">
        <polyline points="46,38 31,38 31,142 46,142" stroke-width="14"/>
        <polyline points="134,38 149,38 149,142 134,142" stroke-width="14"/>
      </g>
    </svg>`;
  }

  function fillInput(input: HTMLInputElement, value: string) {
    try {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (proto?.set) proto.set.call(input, value);
      else input.value = value;
    } catch { input.value = value; }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
    hidePopup();
  }

  function positionPopup(el: HTMLElement, input: HTMLInputElement) {
    const rect = input.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const W = 280;
    let left = rect.left + scrollX;
    if (rect.left + W > window.innerWidth - 12) {
      left = Math.max(scrollX + 8, rect.right + scrollX - W);
    }
    el.style.top = `${rect.bottom + scrollY + 6}px`;
    el.style.left = `${left}px`;
  }

  function positionBtn(btn: HTMLButtonElement, input: HTMLInputElement) {
    const rect = input.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const BW = 22;
    btn.style.top = `${rect.top + scrollY + (rect.height - BW) / 2}px`;
    btn.style.left = `${rect.right + scrollX - BW - 5}px`;
    btn.style.display = "flex";
  }

  function hidePopup() {
    if (popup) popup.style.display = "none";
    currentInput = null;
  }

  async function showPopup(input: HTMLInputElement) {
    if (popup && popup.style.display !== "none" && currentInput === input) {
      hidePopup();
      return;
    }
    currentInput = input;

    let disposable = "";
    let gmailAddr = "";
    let latestOtp = "";

    try {
      const result = await chrome.storage.local.get([
        "tempMailProvider", "guerrilla", "mailgw", "maildrop", "gmail", "latestOtp",
      ]);
      const provider = (result["tempMailProvider"] as string | undefined) ?? "guerrilla";
      if (provider === "guerrilla") {
        disposable = (result["guerrilla"] as Record<string, string> | null)?.email ?? "";
      } else if (provider === "mailgw") {
        disposable = (result["mailgw"] as Record<string, string> | null)?.email ?? "";
      } else if (provider === "maildrop") {
        disposable = (result["maildrop"] as Record<string, string> | null)?.email ?? "";
      }
      gmailAddr = (result["gmail"] as Record<string, string> | null)?.email ?? "";
      latestOtp = (result["latestOtp"] as string | null) ?? "";
    } catch { return; }

    if (!popup) {
      popup = document.createElement("div");
      popup.id = POPUP_ID;
      popup.setAttribute("data-xtoolkit", "1");
      Object.assign(popup.style, {
        position: "absolute",
        zIndex: "2147483647",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        padding: "6px",
        width: "280px",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "none",
        boxSizing: "border-box",
      } as CSSStyleDeclaration);
      document.body.appendChild(popup);
    }

    popup.innerHTML = "";

    // ── Email fill rows ───────────────────────────────────────────
    function addEmailRow(email: string, sublabel: string, bg: string) {
      const btn = document.createElement("button");
      btn.type = "button";
      Object.assign(btn.style, {
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        width: "100%", padding: "8px 11px", marginBottom: "4px",
        border: "none", borderRadius: "8px", cursor: "pointer",
        background: bg, boxSizing: "border-box", outline: "none",
      } as CSSStyleDeclaration);
      const main = document.createElement("div");
      Object.assign(main.style, {
        fontSize: "12px", fontWeight: "700", fontFamily: "monospace,monospace",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        color: "#fff", lineHeight: "1.4", width: "100%",
      } as CSSStyleDeclaration);
      main.textContent = email;
      const sub = document.createElement("div");
      Object.assign(sub.style, {
        fontSize: "10px", color: "rgba(255,255,255,0.75)", marginTop: "2px",
      } as CSSStyleDeclaration);
      sub.textContent = sublabel;
      btn.appendChild(main); btn.appendChild(sub);
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("mouseover", () => { btn.style.filter = "brightness(0.9)"; });
      btn.addEventListener("mouseout", () => { btn.style.filter = ""; });
      btn.addEventListener("click", () => fillInput(input, email));
      popup!.appendChild(btn);
    }

    if (disposable) addEmailRow(disposable, "Temp Email — click to fill", "#7c3aed");
    if (gmailAddr) addEmailRow(gmailAddr, "Temp Gmail — Gmail accepted", "#1d4ed8");

    // ── Divider ───────────────────────────────────────────────────
    function addDivider(margin = "2px 0 4px") {
      const d = document.createElement("div");
      Object.assign(d.style, { height: "1px", background: "#f3f4f6", margin } as CSSStyleDeclaration);
      popup!.appendChild(d);
    }
    addDivider();

    // ── Action button (generate) ──────────────────────────────────
    function addActionBtn(label: string, onClickAsync: (btn: HTMLButtonElement) => Promise<void>) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      Object.assign(btn.style, {
        display: "flex", alignItems: "center",
        width: "100%", padding: "8px 11px", marginBottom: "4px",
        border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer",
        background: "#f9fafb", color: "#374151", boxSizing: "border-box",
        outline: "none", fontSize: "12.5px", fontWeight: "500",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        textAlign: "left",
      } as CSSStyleDeclaration);
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("mouseover", () => { btn.style.background = "#f3f4f6"; });
      btn.addEventListener("mouseout", () => { btn.style.background = "#f9fafb"; });
      btn.addEventListener("click", async () => {
        btn.textContent = "Generating…";
        btn.style.opacity = "0.55";
        btn.style.cursor = "default";
        await onClickAsync(btn).catch(() => {});
      });
      popup!.appendChild(btn);
      return btn;
    }

    addActionBtn("↻  Generate a new temp mail", async () => {
      try {
        const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_DISPOSABLE" });
        if (resp?.email && currentInput) fillInput(currentInput, resp.email as string);
      } finally { hidePopup(); }
    });

    addActionBtn("↻  Generate a new temp Gmail", async () => {
      try {
        const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_GMAIL" });
        if (resp?.email && currentInput) fillInput(currentInput, resp.email as string);
      } finally { hidePopup(); }
    });

    // ── OTP section ───────────────────────────────────────────────
    if (latestOtp) {
      addDivider("2px 0 6px");

      const otpRow = document.createElement("div");
      Object.assign(otpRow.style, {
        display: "flex", alignItems: "center", gap: "6px", padding: "0 4px 4px",
      } as CSSStyleDeclaration);

      const otpLbl = document.createElement("span");
      Object.assign(otpLbl.style, { fontSize: "10px", color: "#9ca3af", flexShrink: "0", whiteSpace: "nowrap" } as CSSStyleDeclaration);
      otpLbl.textContent = "Latest OTP";

      const otpBox = document.createElement("input");
      otpBox.type = "text";
      otpBox.readOnly = true;
      otpBox.value = latestOtp;
      Object.assign(otpBox.style, {
        flex: "1", padding: "5px 8px",
        border: "1px solid #e5e7eb", borderRadius: "6px",
        fontSize: "15px", fontFamily: "monospace,monospace",
        fontWeight: "800", color: "#111827", background: "#f9fafb",
        letterSpacing: "3px", outline: "none", minWidth: "0",
        boxSizing: "border-box",
      } as CSSStyleDeclaration);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.textContent = "Copy";
      Object.assign(copyBtn.style, {
        flexShrink: "0", padding: "5px 11px",
        background: "#10b981", color: "#ffffff",
        border: "none", borderRadius: "6px", cursor: "pointer",
        fontSize: "11px", fontWeight: "700",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      } as CSSStyleDeclaration);
      copyBtn.addEventListener("mousedown", (e) => e.preventDefault());
      copyBtn.addEventListener("click", () => {
        void navigator.clipboard.writeText(latestOtp).catch(() => {
          otpBox.select();
          document.execCommand("copy");
        });
        copyBtn.textContent = "✓ Copied";
        copyBtn.style.background = "#059669";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.style.background = "#10b981";
        }, 1500);
      });

      otpRow.appendChild(otpLbl);
      otpRow.appendChild(otpBox);
      otpRow.appendChild(copyBtn);
      popup.appendChild(otpRow);
    }

    // ── Dashboard link ────────────────────────────────────────────
    addDivider("4px 0 2px");
    const dash = document.createElement("button");
    dash.type = "button";
    dash.textContent = "Dashboard  ↗";
    Object.assign(dash.style, {
      display: "flex", alignItems: "center",
      width: "100%", padding: "6px 11px",
      border: "none", borderRadius: "8px", cursor: "pointer",
      background: "transparent", color: "#9ca3af", boxSizing: "border-box",
      outline: "none", fontSize: "11px", fontWeight: "500",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      textAlign: "left",
    } as CSSStyleDeclaration);
    dash.addEventListener("mousedown", (e) => e.preventDefault());
    dash.addEventListener("click", () => {
      window.open("https://xtoolkit.live/tools/temp-mail", "_blank");
      hidePopup();
    });
    popup.appendChild(dash);

    positionPopup(popup, input);
    popup.style.display = "block";
  }

  // ── Inject logo trigger button ────────────────────────────────
  function injectBtn(input: HTMLInputElement) {
    if (injectedInputs.has(input)) return;
    if (input.closest("[data-xtoolkit='1']")) return;
    injectedInputs.add(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-xtoolkit", "1");
    btn.title = "X Toolkit — fill email or view OTP";
    btn.innerHTML = logoSvg();
    Object.assign(btn.style, {
      position: "absolute",
      zIndex: "2147483646",
      width: "22px", height: "22px",
      background: "rgba(124,58,237,0.1)",
      border: "1px solid rgba(124,58,237,0.25)",
      borderRadius: "5px",
      cursor: "pointer",
      padding: "3px",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      transition: "background 0.15s",
      lineHeight: "1",
    } as CSSStyleDeclaration);

    btn.addEventListener("mouseover", () => { btn.style.background = "rgba(124,58,237,0.2)"; });
    btn.addEventListener("mouseout", () => { btn.style.background = "rgba(124,58,237,0.1)"; });
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      void showPopup(input);
    });

    inputButtonMap.set(input, btn);
    document.body.appendChild(btn);
    positionBtn(btn, input);
  }

  // ── Scan document for email inputs ────────────────────────────
  function scanInputs() {
    document.querySelectorAll<HTMLInputElement>(EMAIL_SELECTORS).forEach((el) => {
      if (!injectedInputs.has(el)) injectBtn(el);
    });
  }

  // ── Reposition all buttons + popup on scroll/resize ───────────
  function rePositionAll() {
    document.querySelectorAll<HTMLInputElement>(EMAIL_SELECTORS).forEach((el) => {
      const btn = inputButtonMap.get(el);
      if (btn) positionBtn(btn, el);
    });
    if (popup && popup.style.display !== "none" && currentInput) {
      positionPopup(popup, currentInput);
    }
  }

  // ── Outside click closes popup ────────────────────────────────
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (
      popup && popup.style.display !== "none" &&
      !popup.contains(t) &&
      t.getAttribute?.("data-xtoolkit") !== "1"
    ) hidePopup();
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup && popup.style.display !== "none") hidePopup();
  }, true);

  window.addEventListener("scroll", rePositionAll, { passive: true, capture: true });
  window.addEventListener("resize", rePositionAll);

  // ── MutationObserver for SPA navigation ──────────────────────
  const observer = new MutationObserver(() => scanInputs());
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Initial scan (with retries for slow pages) ────────────────
  scanInputs();
  setTimeout(scanInputs, 500);
  setTimeout(scanInputs, 1500);
})();
