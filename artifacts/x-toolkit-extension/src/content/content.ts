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
    closeTimer = setTimeout(() => {
      hidePopup();
    }, 180);
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

    const popupWidth = 268;
    let top = rect.bottom + scrollY + 6;
    let left = rect.left + scrollX;

    if (rect.left + popupWidth > window.innerWidth - 12) {
      left = Math.max(scrollX + 8, rect.right + scrollX - popupWidth);
    }

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  }

  function btn(
    label: string,
    bg: string,
    color: string,
    onClick: (e: MouseEvent) => void,
    extra?: Partial<CSSStyleDeclaration>,
  ): HTMLButtonElement {
    const el = document.createElement("button");
    el.textContent = label;
    el.type = "button";
    Object.assign(el.style, {
      display: "block",
      width: "100%",
      padding: "9px 12px",
      marginBottom: "4px",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      fontSize: "13px",
      fontWeight: "600",
      textAlign: "left",
      background: bg,
      color,
      boxSizing: "border-box",
      lineHeight: "1.4",
      letterSpacing: "0px",
      outline: "none",
      transition: "filter 0.1s",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      ...(extra ?? {}),
    } as CSSStyleDeclaration);
    el.addEventListener("mouseover", () => { el.style.filter = "brightness(0.92)"; });
    el.addEventListener("mouseout", () => { el.style.filter = ""; });
    el.addEventListener("mousedown", (e) => e.preventDefault());
    el.addEventListener("click", onClick);
    return el;
  }

  function fillInput(input: HTMLInputElement, value: string) {
    try {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (proto?.set) proto.set.call(input, value);
      else input.value = value;
    } catch {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
    hidePopup();
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
    } catch {
      return;
    }

    if (!disposable && !gmail) return;

    if (!popup) {
      popup = document.createElement("div");
      popup.id = POPUP_ID;
      popup.setAttribute("data-xtoolkit", "1");
      Object.assign(popup.style, {
        position: "absolute",
        zIndex: "2147483647",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.18), 0 1px 6px rgba(0,0,0,0.10)",
        padding: "6px",
        width: "268px",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        border: "1px solid rgba(0,0,0,0.09)",
        display: "none",
        boxSizing: "border-box",
      } as CSSStyleDeclaration);
      popup.addEventListener("mouseenter", cancelClose);
      popup.addEventListener("mouseleave", scheduleClose);
      document.body.appendChild(popup);
    }

    popup.innerHTML = "";

    const header = document.createElement("div");
    Object.assign(header.style, {
      fontSize: "10px",
      color: "#9ca3af",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      padding: "4px 6px 7px",
    } as CSSStyleDeclaration);
    header.textContent = "X Toolkit — Autofill";
    popup.appendChild(header);

    if (disposable) {
      popup.appendChild(btn(
        disposable,
        "#7c3aed",
        "#ffffff",
        () => fillInput(input, disposable),
        { fontFamily: "monospace,monospace", fontSize: "12px" },
      ));
    }

    if (gmail) {
      popup.appendChild(btn(
        gmail,
        "#1d4ed8",
        "#ffffff",
        () => fillInput(input, gmail),
        { fontFamily: "monospace,monospace", fontSize: "12px", marginBottom: "4px" },
      ));
    }

    const sep = document.createElement("div");
    Object.assign(sep.style, {
      height: "1px",
      background: "#f3f4f6",
      margin: "3px 0 7px",
    } as CSSStyleDeclaration);
    popup.appendChild(sep);

    const genBtn = btn(
      "Generate a new temp mail",
      "#f3f4f6",
      "#111827",
      async (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLButtonElement;
        target.textContent = "Generating…";
        target.style.opacity = "0.5";
        try {
          const resp = await chrome.runtime.sendMessage({ type: "GENERATE_NEW_DISPOSABLE" });
          if (resp?.email && currentInput) {
            fillInput(currentInput, resp.email as string);
          }
        } catch { }
        hidePopup();
      },
    );
    popup.appendChild(genBtn);

    const dashBtn = btn(
      "Dashboard ↗",
      "#f3f4f6",
      "#6b7280",
      () => {
        window.open("https://xtoolkit.live/tools/temp-mail", "_blank");
        hidePopup();
      },
      { marginBottom: "0", fontWeight: "500" },
    );
    popup.appendChild(dashBtn);

    positionPopup(popup, input);
    popup.style.display = "block";
  }

  document.addEventListener("focusin", (e) => {
    const t = e.target as HTMLElement;
    if (t.matches && t.matches(EMAIL_SELECTORS)) {
      void showPopup(t as HTMLInputElement);
    }
  }, true);

  document.addEventListener("focusout", (e) => {
    const t = e.target as HTMLElement;
    if (t.matches && t.matches(EMAIL_SELECTORS)) {
      scheduleClose();
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup && popup.style.display !== "none") {
      hidePopup();
    }
  }, true);

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (
      popup &&
      popup.style.display !== "none" &&
      !popup.contains(t) &&
      !(t.matches && t.matches(EMAIL_SELECTORS))
    ) {
      hidePopup();
    }
  }, true);

  window.addEventListener("scroll", () => {
    if (popup && popup.style.display !== "none" && currentInput) {
      positionPopup(popup, currentInput);
    }
  }, { passive: true, capture: true });

  window.addEventListener("resize", () => {
    if (popup && popup.style.display !== "none" && currentInput) {
      positionPopup(popup, currentInput);
    }
  });
})();
