/* ============================================================
   VestCasaMoro — interactions, data & rendering
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Fallback data (usado se a API não responder) ---------- */
  const FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23F5EFE6'/%3E%3Ctext x='200' y='205' font-family='Georgia' font-size='22' fill='%23C8A96B' text-anchor='middle'%3EVestCasaMoro%3C/text%3E%3C/svg%3E";

  const FALLBACK_DATA = [
    {
      id: "sala", tab: "Sala", icon: "🛋️", nome: "Sala de Estar",
      descricao: "Conforto e elegância para o seu espaço favorito", total: 24,
      imagem: "assets/Imagens Ambientes/Sala de estar.jpeg",
      produtos: [],
    },
    {
      id: "cozinha", tab: "Cozinha", icon: "🍳", nome: "Cozinha",
      descricao: "Praticidade e estilo para o coração da casa", total: 18,
      imagem: "assets/Imagens Ambientes/Cozinha.jpeg",
      produtos: [],
    },
    {
      id: "quarto", tab: "Quarto", icon: "🛏️", nome: "Quarto",
      descricao: "Aconchego e tranquilidade para seu descanso", total: 31,
      imagem: "assets/Imagens Ambientes/Quarto.png",
      produtos: [],
    },
    {
      id: "banheiro", tab: "Banheiro", icon: "🛁", nome: "Banheiro",
      descricao: "Sofisticação nos detalhes do seu spa particular", total: 15,
      imagem: "assets/Imagens Ambientes/Banheiro.png",
      produtos: [],
    },
  ];

  /* ---------- Render ambientes (abas + painéis) ---------- */
  const ambTabsEl   = document.getElementById("amb-tabs");
  const ambPanelsEl = document.getElementById("amb-panels");

  const revealAmbCards = (panel) => {
    panel.querySelectorAll(".amb-card").forEach((card, i) => {
      card.classList.remove("visible");
      void card.offsetWidth;
      setTimeout(() => card.classList.add("visible"), i * 80);
    });
  };

  const setActiveAmbTab = (id) => {
    ambTabsEl.querySelectorAll(".amb-tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.tab === id)
    );
    ambPanelsEl.querySelectorAll(".amb-panel").forEach((p) => {
      const isActive = p.dataset.panel === id;
      p.classList.toggle("active", isActive);
      if (isActive) revealAmbCards(p);
    });
  };

  function renderAmbientes(data) {
    if (!ambTabsEl || !ambPanelsEl) return;

    ambTabsEl.innerHTML = data
      .map(
        (a, i) => `
      <button class="amb-tab${i === 0 ? " active" : ""}" data-tab="${a.id}" role="tab" aria-selected="${i === 0}">
        <span>${a.icon}</span> ${a.tab}
      </button>`
      )
      .join("");

    ambPanelsEl.innerHTML = data
      .map(
        (a, i) => `
      <div class="amb-panel${i === 0 ? " active" : ""}" data-panel="${a.id}">
        <div class="amb-banner">
          <img src="${a.imagem}" alt="${a.nome}" loading="lazy" onerror="this.closest('.amb-banner').classList.add('no-image'); this.remove();" />
          <div class="amb-banner-content">
            <h3 class="amb-banner-name">${a.nome}</h3>
            <p class="amb-banner-desc">${a.descricao}</p>
            <span class="amb-badge">✦ ${a.total} produtos disponíveis</span>
          </div>
        </div>
        <p class="amb-label">Destaques para ${a.tab === "Sala" ? "a Sala" : a.tab === "Cozinha" ? "a Cozinha" : a.tab === "Quarto" ? "o Quarto" : "o Banheiro"}</p>
        <div class="amb-grid">
          ${a.produtos
            .map(
              (p, pi) => {
                const imgId = `vc-img-${a.id}-${pi}`;
                const hasVariants = p.variantes && p.variantes.length > 0;
                const mainSrc = p.foto || FALLBACK;
                const varSection = hasVariants
                  ? `<div class="var-section">
                      <p class="var-meta">Cor: <strong class="var-color-name" id="vcn-${imgId}">Padrão</strong></p>
                      <div class="var-btns" role="group" aria-label="Selecionar variação">
                        <button class="var-thumb active"
                          data-imgid="${imgId}" data-foto="${p.foto || ""}"
                          aria-selected="true" aria-label="Padrão" title="Padrão">
                          <img src="${p.foto || FALLBACK}" alt="Padrão" onerror="this.src='${FALLBACK}'" loading="lazy" />
                        </button>
                        ${p.variantes.map((v) =>
                          `<button class="var-thumb"
                            data-imgid="${imgId}" data-foto="${v.foto || ""}"
                            aria-selected="false" aria-label="${v.cor}" title="${v.cor}">
                            <img src="${v.foto || FALLBACK}" alt="${v.cor}" onerror="this.src='${FALLBACK}'" loading="lazy" />
                          </button>`
                        ).join("")}
                      </div>
                    </div>`
                  : "";
                const productData = JSON.stringify({
                  nome: p.nome || "",
                  preco: p.preco || "",
                  foto: p.foto || "",
                  tag: p.tag || "",
                  descricao: p.descricao || "",
                  variantes: p.variantes || []
                });
                return `
                <div class="amb-card" data-product="${productData.replace(/"/g, "&quot;")}">
                  <div class="amb-card-media">
                    <img id="${imgId}" src="${mainSrc}" alt="${p.nome}" onerror="this.src='${FALLBACK}'" />
                    ${p.tag ? `<span class="amb-card-tag">✦ ${p.tag}</span>` : ""}
                  </div>
                  ${varSection}
                  <div class="amb-card-body">
                    <p class="amb-card-name">${p.nome}</p>
                    <p class="amb-card-price">${p.preco}</p>
                  </div>
                </div>`;
              }
            )
            .join("")}
        </div>
      </div>`
      )
      .join("");

    ambTabsEl.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".amb-tab");
      if (btn) setActiveAmbTab(btn.dataset.tab);
    });

    ambPanelsEl.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".var-thumb");
      if (!btn) return;

      // Fade out → swap src → fade in
      const img = document.getElementById(btn.dataset.imgid);
      if (img) {
        img.style.opacity = "0";
        setTimeout(() => {
          img.src = btn.dataset.foto || FALLBACK;
          img.style.opacity = "1";
        }, 180);
      }

      // Atualiza estado ativo
      const group = btn.closest(".var-btns");
      group.querySelectorAll(".var-thumb").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Atualiza nome da cor exibido
      const label = document.getElementById("vcn-" + btn.dataset.imgid);
      if (label) label.textContent = btn.getAttribute("title");
    });

    ambPanelsEl.addEventListener("keydown", (ev) => {
      const btn = ev.target.closest(".var-thumb");
      if (!btn || !["ArrowLeft", "ArrowRight"].includes(ev.key)) return;
      ev.preventDefault();
      const thumbs = [...btn.closest(".var-btns").querySelectorAll(".var-thumb")];
      const idx = thumbs.indexOf(btn);
      const next = ev.key === "ArrowRight" ? thumbs[idx + 1] : thumbs[idx - 1];
      if (next) { next.focus(); next.click(); }
    });

    const ambSection = document.getElementById("ambientes");
    const ambObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const active = ambPanelsEl.querySelector(".amb-panel.active");
            if (active) revealAmbCards(active);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ambSection) ambObserver.observe(ambSection);
  }

  // Carrega produtos.json; usa fallback embutido se falhar
  fetch("/produtos.json")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => renderAmbientes(data))
    .catch(() => renderAmbientes(FALLBACK_DATA));

  /* ---------- Comparativo Antes & Depois (slider de arraste) ---------- */
  const compareEl = document.getElementById("compare");
  if (compareEl) {
    const divider    = document.getElementById("compare-divider");
    const handle     = document.getElementById("compare-handle");
    const imgAfter   = compareEl.querySelector(".compare-after");
    const labelBefore = document.getElementById("compare-label-before");
    const labelAfter  = document.getElementById("compare-label-after");

    let dragging = false;

    const setComparePosition = (pct) => {
      const clamped = Math.min(100, Math.max(0, pct));
      imgAfter.style.clipPath = `inset(0 0 0 ${clamped}%)`;
      divider.style.left = clamped + "%";
      handle.style.left  = clamped + "%";
      labelBefore.style.opacity = clamped < 16 ? Math.max(0, clamped / 16) : 1;
      labelAfter.style.opacity  = clamped > 84 ? Math.max(0, (100 - clamped) / 16) : 1;
    };

    const comparePctFromEvent = (clientX) => {
      const rect = compareEl.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    const startCompareDrag = (clientX) => {
      dragging = true;
      compareEl.classList.remove("is-settling");
      compareEl.classList.add("dragging");
      handle.classList.remove("pulse");
      setComparePosition(comparePctFromEvent(clientX));
    };

    const moveCompareDrag = (clientX) => {
      if (!dragging) return;
      setComparePosition(comparePctFromEvent(clientX));
    };

    const endCompareDrag = () => {
      if (!dragging) return;
      dragging = false;
      compareEl.classList.remove("dragging");
      compareEl.classList.add("is-settling");
      setTimeout(() => compareEl.classList.remove("is-settling"), 520);
    };

    compareEl.addEventListener("mousedown", (e) => { startCompareDrag(e.clientX); e.preventDefault(); });
    window.addEventListener("mousemove", (e) => moveCompareDrag(e.clientX));
    window.addEventListener("mouseup", endCompareDrag);

    compareEl.addEventListener("touchstart", (e) => startCompareDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener("touchmove", (e) => { if (dragging) moveCompareDrag(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", endCompareDrag);
    window.addEventListener("touchcancel", endCompareDrag);

    setComparePosition(100);

    const compareObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            handle.classList.add("pulse");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    compareObserver.observe(compareEl);
  }

  /* ---------- Lazy loading ---------- */
  const lazyLoad = () => {
    const imgs = document.querySelectorAll("img.lazy:not([data-init])");
    if (!("IntersectionObserver" in window)) {
      imgs.forEach((img) => loadImg(img));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            loadImg(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "200px" }
    );
    imgs.forEach((img) => {
      img.setAttribute("data-init", "1");
      io.observe(img);
    });
  };
  function loadImg(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.onload = () => img.classList.add("loaded");
    img.onerror = () => {
      img.src = FALLBACK;
      img.classList.add("loaded");
    };
  }

  /* ---------- Atribui data-reveal às seções ---------- */
  const assignReveals = () => {
    document.querySelectorAll(".benefit").forEach((el, i) => {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", i % 2 === 0 ? "left" : "right");
    });
    const nl = document.getElementById("newsletter");
    if (nl) {
      const box = nl.querySelector(".bg-beige");
      if (box && !box.hasAttribute("data-reveal")) box.setAttribute("data-reveal", "scale");
    }
  };

  /* ---------- Observer unificado (reveal + data-reveal) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  const observeReveals = () => {
    document.querySelectorAll(".reveal:not([data-observed]), [data-reveal]:not([data-observed])").forEach((el) => {
      el.setAttribute("data-observed", "1");
      revealObserver.observe(el);
    });
  };

  /* ---------- Mobile menu ---------- */
  const toggle     = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
    );
  }

  /* ---------- Vídeo hero: remove cobertura quando pronto ---------- */
  const heroCover = document.getElementById("hero-cover");
  const heroVideo = document.querySelector(".hero-bg-image");
  if (heroCover && heroVideo) {
    const revealHero = () => heroCover.classList.add("hidden-cover");
    if (heroVideo.readyState >= 3) {
      revealHero();
    } else {
      heroVideo.addEventListener("canplay", revealHero, { once: true });
      setTimeout(revealHero, 2500);
    }
  }

  /* ---------- Efeitos de rolagem (header, parallax, progresso) ---------- */
  const header          = document.getElementById("header");
  const heroEl          = document.getElementById("hero");
  const heroImg         = document.querySelector(".hero-bg-image");
  const heroContent     = document.getElementById("hero-content");
  const scrollIndicator = document.getElementById("scroll-indicator");
  const progressBar     = document.getElementById("scroll-progress");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let scrollTicking = false;

  const applyScrollEffects = () => {
    const y = window.scrollY;

    if (header && heroEl) {
      const heroEnd = heroEl.offsetTop + heroEl.offsetHeight - 80;
      header.classList.toggle("header-scrolled", y > heroEnd);
    }

    if (scrollIndicator) {
      scrollIndicator.classList.toggle("hide", y > 80);
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = pct.toFixed(2) + "%";
    }

    if (!reduceMotion && heroEl) {
      const heroH = heroEl.offsetHeight;
      const p = Math.min(1, Math.max(0, y / heroH));

      if (heroImg) {
        const shift = p * heroH * 0.18;
        heroImg.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.06)`;
      }

      if (heroContent) {
        const drift = p * -80;
        const fade  = Math.max(0, 1 - p / 0.75);
        heroContent.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
        heroContent.style.opacity   = fade.toFixed(3);
      }
    }

    scrollTicking = false;
  };

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(applyScrollEffects);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  applyScrollEffects();

  /* ---------- Newsletter ---------- */
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("newsletter-msg");
      msg.classList.remove("opacity-0");
      form.reset();
      setTimeout(() => msg.classList.add("opacity-0"), 4000);
    });
  }

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Modal de produto ---------- */
  const pModal       = document.getElementById("product-modal");
  const pImg         = document.getElementById("pmodal-img");
  const pTag         = document.getElementById("pmodal-tag");
  const pTitle       = document.getElementById("pmodal-title");
  const pPrice       = document.getElementById("pmodal-price");
  const pDesc        = document.getElementById("pmodal-desc");
  const pVarWrap     = document.getElementById("pmodal-var-wrap");
  const pVarBtns     = document.getElementById("pmodal-var-btns");
  const pCorNome     = document.getElementById("pmodal-cor-nome");
  const pWa          = document.getElementById("pmodal-wa");
  const pAddCart     = document.getElementById("pmodal-add-cart");
  const pClose       = document.getElementById("pmodal-close");
  const WA_NUMBER    = "5567981566712";

  function buildWaMsg(nome, preco, cor, fotoSrc) {
    const corLinha  = cor && cor !== "Padrão" ? `\n🎨 Cor: ${cor}` : "";
    const fotoUrl   = fotoSrc && !fotoSrc.startsWith("data:")
      ? (fotoSrc.startsWith("http") ? fotoSrc : `${window.location.origin}/${fotoSrc.replace(/^\//, "")}`)
      : null;
    const fotoLinha = fotoUrl ? `\n📷 Foto: ${fotoUrl}` : "";
    return `Olá! Tenho interesse neste produto:\n\n🛍️ *${nome}*${corLinha}\n💰 ${preco}${fotoLinha}\n\nPoderia me dar mais informações?`;
  }

  function openModal(product) {
    const { nome, preco, foto, tag, descricao, variantes } = product;

    pImg.src = foto || FALLBACK;
    pImg.alt = nome;
    pTag.textContent = tag ? `✦ ${tag}` : "";
    pTitle.textContent = nome;
    pPrice.textContent = preco;
    pDesc.textContent = descricao;
    pCorNome.textContent = "Padrão";

    let corAtual  = "Padrão";
    let fotoAtual = foto;

    const updateWaLink = () => {
      pWa.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg(nome, preco, corAtual, fotoAtual))}`;
    };
    updateWaLink();

    // Botão adicionar ao carrinho
    if (pAddCart) {
      pAddCart.textContent = "Adicionar ao carrinho";
      pAddCart.classList.remove("added");
      pAddCart.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0" stroke-linecap="round" stroke-linejoin="round"/></svg> Adicionar ao carrinho`;
      pAddCart.onclick = () => {
        const added = addToCart({ nome, preco, cor: corAtual, foto: fotoAtual });
        if (added) {
          pAddCart.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg> Adicionado!`;
          pAddCart.classList.add("added");
          setTimeout(closeModal, 900);
        } else {
          pAddCart.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg> Já está no carrinho`;
          pAddCart.classList.add("added");
        }
      };
    }

    // Variantes
    pVarBtns.innerHTML = "";
    if (variantes && variantes.length > 0) {
      pVarWrap.hidden = false;

      const mkBtn = (src, label, active) => {
        const btn = document.createElement("button");
        btn.className = "pmodal-var-btn" + (active ? " active" : "");
        btn.setAttribute("aria-label", label);
        btn.setAttribute("title", label);
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.innerHTML = `<img src="${src || FALLBACK}" alt="${label}" onerror="this.src='${FALLBACK}'" />`;
        btn.addEventListener("click", () => {
          pImg.style.opacity = "0";
          setTimeout(() => { pImg.src = src || FALLBACK; pImg.style.opacity = "1"; }, 180);
          pVarBtns.querySelectorAll(".pmodal-var-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          pCorNome.textContent = label;
          corAtual  = label;
          fotoAtual = src;
          updateWaLink();
        });
        return btn;
      };

      pVarBtns.appendChild(mkBtn(foto, "Padrão", true));
      variantes.forEach(v => pVarBtns.appendChild(mkBtn(v.foto, v.cor, false)));
    } else {
      pVarWrap.hidden = true;
    }

    pModal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => pModal.classList.add("pmodal-open"));
  }

  function closeModal() {
    pModal.classList.remove("pmodal-open");
    document.body.style.overflow = "";
    pModal.addEventListener("transitionend", () => { pModal.hidden = true; }, { once: true });
  }

  if (pModal) {
    pClose.addEventListener("click", closeModal);
    pModal.addEventListener("click", (e) => { if (e.target === pModal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pModal.hidden) closeModal(); });
  }

  // Abre modal ao clicar no card (ignora clique em botão de variante)
  if (ambPanelsEl) {
    ambPanelsEl.addEventListener("click", (e) => {
      if (e.target.closest(".var-thumb")) return;
      const card = e.target.closest(".amb-card[data-product]");
      if (!card) return;
      try {
        openModal(JSON.parse(card.dataset.product));
      } catch (_) {}
    });
  }

  /* ---------- Carrinho ---------- */
  const cartFab     = document.getElementById("cart-fab");
  const cartPanel   = document.getElementById("cart-panel");
  const cartClose   = document.getElementById("cart-close");
  const cartItems   = document.getElementById("cart-items");
  const cartEmpty   = document.getElementById("cart-empty");
  const cartFooter  = document.getElementById("cart-footer");
  const cartBadge   = document.getElementById("cart-badge");
  const cartCount   = document.getElementById("cart-count");
  const cartWaBtn   = document.getElementById("cart-wa-btn");

  let cart = [];

  function buildCartWaMsg() {
    const linhas = cart.map((item, i) => {
      const cor  = item.cor && item.cor !== "Padrão" ? `\n   🎨 Cor: ${item.cor}` : "";
      const foto = item.foto && !item.foto.startsWith("data:")
        ? `\n   📷 ${item.foto.startsWith("http") ? item.foto : window.location.origin + "/" + item.foto.replace(/^\//, "")}`
        : "";
      return `${i + 1}. 🛍️ *${item.nome}*\n   💰 ${item.preco}${cor}${foto}`;
    });
    return `Olá! Tenho interesse nos seguintes produtos:\n\n${linhas.join("\n\n")}\n\nPoderia me dar mais informações?`;
  }

  function renderCart() {
    const total = cart.length;
    cartBadge.textContent = total;
    cartCount.textContent = total;
    cartFab.hidden = total === 0;
    cartEmpty.style.display = total === 0 ? "flex" : "none";
    cartFooter.hidden = total === 0;

    cartItems.innerHTML = "";
    cart.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img class="cart-item-img" src="${item.foto || FALLBACK}" alt="${item.nome}" onerror="this.src='${FALLBACK}'" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.nome}</p>
          ${item.cor && item.cor !== "Padrão" ? `<p class="cart-item-cor">Cor: ${item.cor}</p>` : ""}
          <p class="cart-item-price">${item.preco}</p>
        </div>
        <button class="cart-item-remove" aria-label="Remover ${item.nome}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
        </button>`;
      el.querySelector(".cart-item-remove").addEventListener("click", () => {
        cart.splice(i, 1);
        renderCart();
      });
      cartItems.appendChild(el);
    });

    if (cartWaBtn) {
      cartWaBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildCartWaMsg())}`;
    }
  }

  function addToCart(item) {
    const key = `${item.nome}__${item.cor}`;
    if (cart.find(c => `${c.nome}__${c.cor}` === key)) return false;
    cart.push(item);
    renderCart();
    cartFab.classList.remove("bump");
    void cartFab.offsetWidth;
    cartFab.classList.add("bump");
    return true;
  }

  function openCart() {
    cartPanel.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => cartPanel.classList.add("cart-open"));
  }

  function closeCart() {
    cartPanel.classList.remove("cart-open");
    document.body.style.overflow = "";
    cartPanel.addEventListener("transitionend", () => { cartPanel.hidden = true; }, { once: true });
  }

  if (cartFab)   cartFab.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartPanel) {
    cartPanel.addEventListener("click", e => { if (e.target === cartPanel) closeCart(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !cartPanel.hidden) closeCart(); });
  }

  renderCart();

  /* ---------- Init ---------- */
  lazyLoad();
  assignReveals();
  observeReveals();
})();
