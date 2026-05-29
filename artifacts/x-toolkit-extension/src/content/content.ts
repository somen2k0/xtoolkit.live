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
    const popupWidth = 288;
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

  function makeSection(label: string): HTMLDivElement {
    const el = document.createElement("div");
    Object.assign(el.style, {
      fontSize: "10px",
      color: "#9ca3af",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      padding: "6px 8px 3px",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    } as CSSStyleDeclaration);
    el.textContent = label;
    return el;
  }

  function makeSep(): HTMLDivElement {
    const el = document.createElement("div");
    Object.assign(el.style, { height: "1px", background: "#f3f4f6", margin: "4px 0" } as CSSStyleDeclaration);
    return el;
  }

  function makeBtn(opts: {
    label: string;
    sublabel?: string;
    bg: string;
    color: string;
    borderColor?: string;
    onClick: (e: MouseEvent) => void;
    mono?: boolean;
  }): HTMLButtonElement {
    const el = document.createElement("button");
    el.type = "button";
    Object.assign(el.style, {
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: "9px 10px",
      marginBottom: "3px",
      border: `1px solid ${opts.borderColor ?? "transparent"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      background: opts.bg,
      color: opts.color,
      boxSizing: "border-box",
      outline: "none",
      transition: "filter 0.1s",
      gap: "8px",
      textAlign: "left",
    } as CSSStyleDeclaration);

    const textWrap = document.createElement("div");
    textWrap.style.flex = "1";
    textWrap.style.minWidth = "0";
    textWrap.style.overflow = "hidden";

    const mainLine = document.createElement("div");
    Object.assign(mainLine.style, {
      fontSize: opts.mono ? "12px" : "13px",
      fontWeight: "600",
      fontFamily: opts.mono ? "monospace,monospace" : "inherit",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: opts.color,
      lineHeight: "1.3",
    } as CSSStyleDeclaration);
    mainLine.textContent = opts.label;
    textWrap.appendChild(mainLine);

    if (opts.sublabel) {
      const sub = document.createElement("div");
      Object.assign(sub.style, {
        fontSize: "10px",
        color: opts.color,
        opacity: "0.65",
        marginTop: "1px",
        lineHeight: "1.2",
      } as CSSStyleDeclaration);
      sub.textContent = opts.sublabel;
      textWrap.appendChild(sub);
    }

    el.appendChild(textWrap);

    el.addEventListener("mouseover", () => { el.style.filter = "brightness(0.93)"; });
    el.addEventListener("mouseout", () => { el.style.filter = ""; });
    el.addEventListener("mousedown", (e) => e.preventDefault());
    el.addEventListener("click", opts.onClick);
    return el;
  }

  function setLoadingState(btn: HTMLButtonElement, loading: boolean, originalLabel: string) {
    const mainLine = btn.querySelector("div > div") as HTMLElement | null;
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
        width: "288px",
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

    // ── Header ─────────────────────────────────────────────────────
    const header = document.createElement("div");
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 6px 7px",
    } as CSSStyleDeclaration);

    const logoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    logoSvg.setAttribute("width", "14");
    logoSvg.setAttribute("height", "14");
    logoSvg.setAttribute("viewBox", "0 0 24 24");
    logoSvg.setAttribute("fill", "none");
    logoSvg.setAttribute("stroke", "#7c3aed");
    logoSvg.setAttribute("stroke-width", "2");
    logoSvg.setAttribute("stroke-linecap", "round");
    logoSvg.innerHTML = '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>';

    const headerText = document.createElement("span");
    Object.assign(headerText.style, {
      fontSize: "11px",
      color: "#374151",
      fontWeight: "700",
      letterSpacing: "0.1px",
    } as CSSStyleDeclaration);
    headerText.textContent = "X Toolkit – Autofill";

    header.appendChild(logoSvg);
    header.appendChild(headerText);
    popup.appendChild(header);

    // ── Fill section ───────────────────────────────────────────────
    if (disposable) {
      popup.appendChild(makeSection("Temp Email"));
      popup.appendChild(makeBtn({
        label: disposable,
        sublabel: "Click to fill",
        bg: "#7c3aed",
        color: "#ffffff",
        onClick: () => fillInput(input, disposable),
        mono: true,
      }));
    }

    if (gmail) {
      popup.appendChild(makeSection("Temp Gmail"));
      popup.appendChild(makeBtn({
        label: gmail,
        sublabel: "Click to fill — Gmail accepted",
        bg: "#1d4ed8",
        color: "#ffffff",
        onClick: () => fillInput(input, gmail),
        mono: true,
      }));
    }

    popup.appendChild(makeSep());

    // ── Generate new section ───────────────────────────────────────
    const newEmailBtn = makeBtn({
      label: "↻  New Temp Email",
      bg: "#f9fafb",
      color: "#374151",
      borderColor: "#e5e7eb",
      onClick: async (e) => {
        e.preventDefault();
        setLoadingState(newEmailBtn, true, "↻  New Temp Email");
        try {
          const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_DISPOSABLE" });
          if (resp?.email && currentInput) fillInput(currentInput, resp.email as string);
        } catch { /* ignore */ }
        hidePopup();
      },
    });
    popup.appendChild(newEmailBtn);

    const newGmailBtn = makeBtn({
      label: "↻  New Temp Gmail",
      bg: "#f9fafb",
      color: "#374151",
      borderColor: "#e5e7eb",
      onClick: async (e) => {
        e.preventDefault();
        setLoadingState(newGmailBtn, true, "↻  New Temp Gmail");
        try {
          const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_GMAIL" });
          if (resp?.email && currentInput) fillInput(currentInput, resp.email as string);
        } catch { /* ignore */ }
        hidePopup();
      },
    });
    popup.appendChild(newGmailBtn);

    popup.appendChild(makeSep());

    const dashBtn = makeBtn({
      label: "Open Dashboard  ↗",
      bg: "#f9fafb",
      color: "#6b7280",
      borderColor: "#e5e7eb",
      onClick: () => { window.open("https://xtoolkit.live/tools/temp-mail", "_blank"); hidePopup(); },
    });
    popup.appendChild(dashBtn);

    positionPopup(popup, input);
    popup.style.display = "block";
  }

  document.addEventListener("focusin", (e) => {
    const t = e.target as HTMLElement;
    if (t.matches && t.matches(EMAIL_SELECTORS)) void showPopup(t as HTMLInputElement);
  }, true);

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
})();
