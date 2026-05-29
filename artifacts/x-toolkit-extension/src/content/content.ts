(() => {
  const POPUP_ID = "__xtoolkit_autofill__";

  const EMAIL_SELECTORS = [
    'input[type="email"]',
    'input[name*="email" i]',
    'input[id*="email" i]',
    'input[placeholder*="email" i]',
    'input[autocomplete="email"]',
    'input[autocomplete="username"]',
  ].join(",");

  let popup: HTMLElement | null = null;
  let currentInput: HTMLInputElement | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let showDebounce: ReturnType<typeof setTimeout> | null = null;

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => hidePopup(), 200);
  }

  function cancelClose() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  }

  function hidePopup() {
    if (popup) popup.style.display = "none";
    currentInput = null;
  }

  function positionPopup(el: HTMLElement, input: HTMLInputElement) {
    const rect = input.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const popupWidth = 272;
    let top = rect.bottom + scrollY + 6;
    let left = rect.left + scrollX;
    if (rect.left + popupWidth > window.innerWidth - 12) {
      left = Math.max(scrollX + 8, rect.right + scrollX - popupWidth);
    }
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
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

  function makeBtn(opts: {
    label: string;
    sublabel?: string;
    bg: string;
    color: string;
    borderColor?: string;
    onClick: (e: MouseEvent) => void;
    mono?: boolean;
    bold?: boolean;
  }): HTMLButtonElement {
    const el = document.createElement("button");
    el.type = "button";
    Object.assign(el.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
      padding: "9px 12px",
      marginBottom: "4px",
      border: `1px solid ${opts.borderColor ?? "transparent"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      background: opts.bg,
      color: opts.color,
      boxSizing: "border-box",
      outline: "none",
      transition: "filter 0.1s",
      textAlign: "left",
    } as CSSStyleDeclaration);

    const mainLine = document.createElement("div");
    Object.assign(mainLine.style, {
      fontSize: opts.mono ? "12.5px" : "13px",
      fontWeight: opts.bold !== false ? "600" : "500",
      fontFamily: opts.mono ? "monospace,monospace" : "inherit",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: opts.color,
      lineHeight: "1.35",
      width: "100%",
    } as CSSStyleDeclaration);
    mainLine.textContent = opts.label;
    el.appendChild(mainLine);

    if (opts.sublabel) {
      const sub = document.createElement("div");
      Object.assign(sub.style, {
        fontSize: "10px",
        color: opts.color,
        opacity: "0.7",
        marginTop: "2px",
        lineHeight: "1.2",
      } as CSSStyleDeclaration);
      sub.textContent = opts.sublabel;
      el.appendChild(sub);
    }

    el.addEventListener("mouseover", () => { el.style.filter = "brightness(0.92)"; });
    el.addEventListener("mouseout", () => { el.style.filter = ""; });
    el.addEventListener("mousedown", (e) => e.preventDefault());
    el.addEventListener("click", opts.onClick);
    return el;
  }

  function setLoadingText(btn: HTMLButtonElement, loading: boolean, originalLabel: string) {
    const mainLine = btn.querySelector("div") as HTMLElement | null;
    if (mainLine) mainLine.textContent = loading ? "Generating…" : originalLabel;
    btn.style.opacity = loading ? "0.55" : "1";
    btn.style.cursor = loading ? "default" : "pointer";
  }

  async function showPopup(input: HTMLInputElement) {
    cancelClose();
    currentInput = input;

    let disposable = "";
    let gmail = "";

    try {
      const result = await chrome.storage.local.get([
        "tempMailProvider", "guerrilla", "mailgw", "maildrop", "gmail",
      ]);
      const provider = result["tempMailProvider"] as string | undefined;
      if (provider === "guerrilla" || !provider) {
        disposable = (result["guerrilla"] as Record<string, string> | null)?.email ?? "";
      } else if (provider === "mailgw") {
        disposable = (result["mailgw"] as Record<string, string> | null)?.email ?? "";
      } else if (provider === "maildrop") {
        disposable = (result["maildrop"] as Record<string, string> | null)?.email ?? "";
      }
      gmail = (result["gmail"] as Record<string, string> | null)?.email ?? "";
    } catch { return; }

    if (!disposable && !gmail) return;

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
        width: "272px",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "none",
        boxSizing: "border-box",
      } as CSSStyleDeclaration);
      popup.addEventListener("mouseenter", cancelClose);
      popup.addEventListener("mouseleave", scheduleClose);
      document.body.appendChild(popup);
    }

    popup.innerHTML = "";

    // ── Email fill buttons ─────────────────────────────────────────
    if (disposable) {
      popup.appendChild(makeBtn({
        label: disposable,
        sublabel: "Temp Email — click to fill",
        bg: "#7c3aed",
        color: "#ffffff",
        onClick: () => fillInput(input, disposable),
        mono: true,
      }));
    }

    if (gmail) {
      popup.appendChild(makeBtn({
        label: gmail,
        sublabel: "Temp Gmail — Gmail accepted",
        bg: "#1d4ed8",
        color: "#ffffff",
        onClick: () => fillInput(input, gmail),
        mono: true,
      }));
    }

    // ── Thin divider ───────────────────────────────────────────────
    const sep = document.createElement("div");
    Object.assign(sep.style, { height: "1px", background: "#f3f4f6", margin: "2px 0 6px" } as CSSStyleDeclaration);
    popup.appendChild(sep);

    // ── Generate new temp mail button ──────────────────────────────
    const newEmailLabel = "↻  Generate a new temp mail";
    const newEmailBtn = makeBtn({
      label: newEmailLabel,
      bg: "#f9fafb",
      color: "#374151",
      borderColor: "#e5e7eb",
      bold: false,
      onClick: async (e) => {
        e.preventDefault();
        setLoadingText(newEmailBtn, true, newEmailLabel);
        try {
          const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_DISPOSABLE" });
          if (resp?.email && currentInput) fillInput(currentInput, resp.email as string);
        } catch { /* ignore */ }
        hidePopup();
      },
    });
    popup.appendChild(newEmailBtn);

    // ── Dashboard button ───────────────────────────────────────────
    popup.appendChild(makeBtn({
      label: "Dashboard  ↗",
      bg: "#f9fafb",
      color: "#6b7280",
      borderColor: "#e5e7eb",
      bold: false,
      onClick: () => { window.open("https://xtoolkit.live/tools/temp-mail", "_blank"); hidePopup(); },
    }));

    positionPopup(popup, input);
    popup.style.display = "block";
  }

  function tryShow(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    if (target.matches && target.matches(EMAIL_SELECTORS)) {
      if (showDebounce) clearTimeout(showDebounce);
      showDebounce = setTimeout(() => void showPopup(target as HTMLInputElement), 50);
    }
  }

  // ── Event listeners ────────────────────────────────────────────────────
  document.addEventListener("focusin", (e) => tryShow(e.target), true);
  document.addEventListener("click",   (e) => tryShow(e.target), true);

  document.addEventListener("focusout", (e) => {
    const t = e.target as HTMLElement;
    if (t.matches && t.matches(EMAIL_SELECTORS)) scheduleClose();
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup && popup.style.display !== "none") hidePopup();
  }, true);

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (popup && popup.style.display !== "none" && !popup.contains(t) && !(t.matches && t.matches(EMAIL_SELECTORS))) {
      hidePopup();
    }
  }, true);

  window.addEventListener("scroll", () => {
    if (popup && popup.style.display !== "none" && currentInput) positionPopup(popup, currentInput);
  }, { passive: true, capture: true });

  window.addEventListener("resize", () => {
    if (popup && popup.style.display !== "none" && currentInput) positionPopup(popup, currentInput);
  });

  // ── MutationObserver: catch dynamically added inputs (SPAs) ────────────
  const observer = new MutationObserver(() => {
    // Re-check if already-focused element is an email input (catches SPA navigation)
    const active = document.activeElement;
    if (active instanceof HTMLInputElement && active.matches(EMAIL_SELECTORS)) {
      if (!popup || popup.style.display === "none") {
        if (showDebounce) clearTimeout(showDebounce);
        showDebounce = setTimeout(() => void showPopup(active), 100);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Check if an email input is already focused when script loads ───────
  const alreadyFocused = document.activeElement;
  if (alreadyFocused instanceof HTMLInputElement && alreadyFocused.matches(EMAIL_SELECTORS)) {
    void showPopup(alreadyFocused);
  }
})();
