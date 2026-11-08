/* Black Friday · Cozinha Lucrativa — comportamento próprio da página
   (o motor sites-incriveis.js cuida das revelações, trilho, contadores e fundo) */
(function () {
  "use strict";

  /* ================= CONFIGURAÇÃO (preencha antes de publicar) ================= */
  var CHECKOUT_URL = "";                                  // link do checkout Hotmart do pacote
  var OFERTA_FIM = new Date("2026-11-30T23:59:59-03:00"); // fim real da Black Friday
  var UTM_PADRAO = { utm_source: "site", utm_medium: "landing-page", utm_campaign: "bf-2026-5-livros" };
  /* ============================================================================ */

  var doc = document;
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var brl = function (v) { return "R$\u00A0" + v.toFixed(2).replace(".", ","); };
  var $ = function (s, ctx) { return (ctx || doc).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };

  /* ---------- botões de compra ---------- */
  function montarCheckout(local) {
    var url = new URL(CHECKOUT_URL);
    var atual = new URLSearchParams(window.location.search);
    Object.keys(UTM_PADRAO).forEach(function (k) { url.searchParams.set(k, atual.get(k) || UTM_PADRAO[k]); });
    ["utm_content", "utm_term", "src"].forEach(function (k) { if (atual.get(k)) url.searchParams.set(k, atual.get(k)); });
    if (!atual.get("utm_content")) url.searchParams.set("utm_content", local);
    url.searchParams.set("sck", atual.get("sck") || "bf26-" + local);
    return url.toString();
  }
  if (CHECKOUT_URL) {
    $$(".js-comprar").forEach(function (a) { a.href = montarCheckout(a.dataset.local || "pagina"); });
  } else {
    console.info("[Cozinha Lucrativa] CHECKOUT_URL vazio: os botões levam ao fechamento da página.");
  }

  /* ---------- prazo real ---------- */
  var agora = new Date();
  if (agora > OFERTA_FIM) {
    $$(".js-aberta").forEach(function (el) { el.hidden = true; });
    $$(".js-encerrada").forEach(function (el) { el.hidden = false; });
    $$(".js-faltam").forEach(function (el) { el.textContent = "Black Friday encerrada"; });
  } else {
    var dias = Math.ceil((OFERTA_FIM - agora) / 86400000);
    var texto = dias <= 1 ? "último dia: até 23h59" : "faltam " + dias + " dias · até 30/11";
    $$(".js-faltam").forEach(function (el) { el.textContent = texto; });
  }

  /* ---------- vídeos da Denise ---------- */
  var videos = $$(".js-video");
  function pausarOutros(atual) {
    videos.forEach(function (v) {
      if (v !== atual && !v.paused && !v.muted) { v.pause(); }
      if (v !== atual && v.closest(".clipe")) v.closest(".clipe").classList.remove("tocando");
    });
  }
  var som = $(".js-som");
  if (som) {
    var vAbertura = som.parentNode.querySelector("video");
    if (reduzido) { vAbertura.removeAttribute("autoplay"); vAbertura.pause(); }
    som.addEventListener("click", function () {
      var ligar = vAbertura.muted || vAbertura.paused;
      if (ligar) {
        pausarOutros(vAbertura);
        vAbertura.muted = false; vAbertura.currentTime = 0; vAbertura.loop = false;
        vAbertura.play();
      } else {
        vAbertura.muted = true; vAbertura.loop = true;
      }
      som.setAttribute("aria-pressed", String(ligar));
      $(".som-texto", som).textContent = ligar ? "Som ligado" : "Ouvir a Denise";
    });
    vAbertura.addEventListener("ended", function () {
      vAbertura.muted = true; vAbertura.loop = true; vAbertura.play();
      som.setAttribute("aria-pressed", "false");
      $(".som-texto", som).textContent = "Ouvir a Denise";
    });
  }
  $$(".js-play").forEach(function (b) {
    var fig = b.closest(".clipe");
    var v = fig.querySelector("video");
    function tocar() {
      if (som && !som.parentNode.querySelector("video").muted) som.click();
      pausarOutros(v);
      v.muted = false; v.play(); fig.classList.add("tocando");
    }
    b.addEventListener("click", tocar);
    v.addEventListener("click", function () { if (v.paused) tocar(); else { v.pause(); fig.classList.remove("tocando"); } });
    v.addEventListener("ended", function () { fig.classList.remove("tocando"); v.currentTime = 0; });
  });

  /* ---------- caixinha kraft: 4 brigadeiros desenhados ---------- */
  var grupo = $(".js-brigadeiros");
  if (grupo) {
    var NS = "http://www.w3.org/2000/svg";
    var semente = 7;
    var rnd = function () { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; };
    var cores = ["#F6E7C8", "#E9B44C", "#7A4A2E", "#F2D6A2", "#C9853A"];
    [[136, 124], [284, 124], [136, 218], [284, 218]].forEach(function (c) {
      var g = doc.createElementNS(NS, "g");
      var petalas = "";
      for (var i = 0; i < 18; i++) {
        var a = (i / 18) * Math.PI * 2;
        petalas += (i ? "L" : "M") + (c[0] + Math.cos(a) * 46).toFixed(1) + " " + (c[1] + Math.sin(a) * 40).toFixed(1) +
          "L" + (c[0] + Math.cos(a + 0.17) * 42).toFixed(1) + " " + (c[1] + Math.sin(a + 0.17) * 36.5).toFixed(1);
      }
      var forma = doc.createElementNS(NS, "path");
      forma.setAttribute("d", petalas + "Z");
      forma.setAttribute("fill", "#FBF6EC"); forma.setAttribute("stroke", "#D9CDB8"); forma.setAttribute("stroke-width", "1.5");
      g.appendChild(forma);
      var bola = doc.createElementNS(NS, "circle");
      bola.setAttribute("cx", c[0]); bola.setAttribute("cy", c[1] - 4); bola.setAttribute("r", "32");
      bola.setAttribute("fill", "url(#brig)");
      g.appendChild(bola);
      for (var k = 0; k < 46; k++) {
        var ang = rnd() * Math.PI * 2, raio = Math.sqrt(rnd()) * 28;
        var r = doc.createElementNS(NS, "rect");
        var x = c[0] + Math.cos(ang) * raio, y = c[1] - 4 + Math.sin(ang) * raio;
        r.setAttribute("x", (x - 3).toFixed(1)); r.setAttribute("y", (y - 1).toFixed(1));
        r.setAttribute("width", "6"); r.setAttribute("height", "2"); r.setAttribute("rx", "1");
        r.setAttribute("fill", k % 4 === 0 ? cores[Math.floor(rnd() * cores.length)] : "#3A1E12");
        r.setAttribute("transform", "rotate(" + Math.round(rnd() * 180) + " " + x.toFixed(1) + " " + y.toFixed(1) + ")");
        g.appendChild(r);
      }
      var brilho = doc.createElementNS(NS, "ellipse");
      brilho.setAttribute("cx", c[0] - 10); brilho.setAttribute("cy", c[1] - 18); brilho.setAttribute("rx", "9"); brilho.setAttribute("ry", "5");
      brilho.setAttribute("fill", "#fff"); brilho.setAttribute("opacity", ".18");
      g.appendChild(brilho);
      grupo.appendChild(g);
    });
  }

  /* ---------- movimento-assinatura: teste do olhômetro ---------- */
  var CUSTO_CAIXA = 5.87, MINIMO = 15, FAIXA_MIN = 18, FAIXA_MAX = 24;
  var form = $(".js-palpite");
  if (form) {
    var faixa = $(".js-palpite-preco", form);
    var saida = $(".js-palpite-valor", form);
    var cupom = $(".js-cupom");
    function mostrarPalpite() {
      var v = parseFloat(faixa.value);
      saida.textContent = brl(v);
      faixa.style.setProperty("--p", ((v - faixa.min) / (faixa.max - faixa.min) * 100).toFixed(1) + "%");
    }
    faixa.addEventListener("input", mostrarPalpite);
    mostrarPalpite();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = parseFloat(faixa.value);
      var t;
      if (g < CUSTO_CAIXA) {
        t = "Com " + brl(g) + ", você paga para trabalhar: perde " + brl(CUSTO_CAIXA - g) + " em cada caixinha, e ainda falta a caixa.";
      } else if (g < MINIMO) {
        t = "Com " + brl(g) + ", sobram " + brl(g - CUSTO_CAIXA) + " antes da caixa. Cobre o custo, mas fica abaixo do mínimo que o livro calcula.";
      } else if (g < FAIXA_MIN) {
        t = brl(g) + " passa do mínimo. E o livro mostra que dá para ir até R$\u00A024 com a embalagem certa.";
      } else if (g <= FAIXA_MAX) {
        t = "Bom olho: " + brl(g) + " está na faixa do livro. Agora imagine acertar assim nas outras 24 receitas, sem chutar.";
      } else {
        t = brl(g) + " fica acima da faixa citada no livro. Pode vender, desde que embalagem e apresentação sustentem o valor. Isso também está lá.";
      }
      $(".js-veredito").textContent = t;
      $(".js-seu").textContent = brl(g);
      cupom.hidden = false;
      // reinicia a animação do cupom a cada conferência
      var papel = $(".cupom-papel", cupom);
      papel.style.animation = "none"; void papel.offsetWidth; papel.style.animation = "";
      cupom.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    });
  }

  /* ---------- pico: a balança do preço ---------- */
  var pico = $(".js-pico");
  if (pico) {
    var minis = $$(".mini", pico);
    var visorNum = $(".js-visor-num", pico);
    var prato = $(".js-prato", pico);
    var risco = $(".js-risco", pico);
    var adesivo = $(".js-adesivo", pico);
    var titulo = $(".js-pico-titulo", pico);
    var contaN = $(".js-pico-n", pico);
    var finalBox = $(".js-pico-final", pico);
    var PRECO = 47, N = minis.length;
    var janelas = minis.map(function (_, i) { var s = 0.04 + i * 0.11; return [s, s + 0.09]; });
    var ultimoN = -1, ultimoTitulo = "";

    function empilhar() {
      var h = minis[0].offsetHeight;
      minis.forEach(function (m, i) { m.style.bottom = (i * (h - 2)) + "px"; });
    }
    empilhar();
    window.addEventListener("resize", empilhar);

    var lim = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var faixaP = function (p, a, b) { return lim((p - a) / (b - a), 0, 1); };
    function queda(t) { // gravidade + quiquinho no fim
      if (t < 0.8) { var u = t / 0.8; return u * u; }
      var w = (t - 0.8) / 0.2; return 1 - Math.sin(w * Math.PI) * 0.06;
    }

    function setTitulo(t) { if (t !== ultimoTitulo) { titulo.textContent = t; ultimoTitulo = t; } }

    function render(p) {
      var alturaQueda = window.innerHeight * 0.9;
      var n = 0;
      minis.forEach(function (m, i) {
        var t = faixaP(p, janelas[i][0], janelas[i][1]);
        if (t >= 1) n++;
        m.style.opacity = t > 0 ? "1" : "0";
        m.style.transform = "translateY(" + (-(1 - queda(t)) * alturaQueda).toFixed(1) + "px) rotate(" + ((1 - t) * (i % 2 ? 6 : -6)).toFixed(2) + "deg)";
      });
      if (n !== ultimoN) {
        visorNum.textContent = String(n * PRECO);
        contaN.textContent = String(n);
        if (n > ultimoN && ultimoN >= 0 && !reduzido) {
          prato.classList.remove("afunda"); void prato.offsetWidth; prato.classList.add("afunda");
          setTimeout(function () { prato.classList.remove("afunda"); }, 140);
        }
        ultimoN = n;
      }
      if (p >= 0.68) setTitulo("Na Black Friday, os 5 saem por R$\u00A097.");
      else if (n === N) setTitulo("Os 5 separados: R$\u00A0235.");
      else if (n > 0) setTitulo("Separados, eles vão somando…");
      else setTitulo("Cada livro custa R$\u00A047.");

      var r = faixaP(p, 0.62, 0.70);
      risco.style.transform = "scaleX(" + r.toFixed(3) + ") rotate(-6deg)";

      var a = faixaP(p, 0.70, 0.78);
      var ease = 1 - Math.pow(1 - a, 3);
      var escala = a < 1 ? 2.4 - 1.5 * ease : 1;
      if (a > 0.85 && a < 1) escala = 0.92 + (a - 0.85) / 0.15 * 0.08; // "bate" e assenta
      adesivo.style.opacity = a > 0 ? Math.min(1, a * 3).toFixed(2) : "0";
      adesivo.style.transform = "scale(" + escala.toFixed(3) + ") rotate(" + (-30 + 22 * ease).toFixed(1) + "deg)";

      finalBox.classList.toggle("ativo", p >= 0.8);
    }

    if (reduzido) {
      render(1);
      minis.forEach(function (m) { m.style.transform = "none"; });
      adesivo.style.transform = "rotate(-8deg)";
    } else {
      var pendente = false;
      var ler = function () {
        pendente = false;
        var ret = pico.getBoundingClientRect();
        var percurso = pico.offsetHeight - window.innerHeight;
        var p = percurso > 0 ? lim(-ret.top / percurso, 0, 1) : 1; // mesmo cálculo do motor, sem depender da ordem dos eventos
        render(p);
      };
      var pedir = function () { if (!pendente) { pendente = true; requestAnimationFrame(ler); } };
      window.addEventListener("scroll", pedir, { passive: true });
      window.addEventListener("resize", pedir);
      render(0);
      setTimeout(pedir, 300);
    }
  }

  /* ---------- barra de compra no celular ---------- */
  var barra = $(".js-barra");
  if (barra && "IntersectionObserver" in window) {
    var visiveis = new Set();
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) visiveis.add(e.target); else visiveis.delete(e.target); });
      barra.classList.toggle("ativa", visiveis.size === 0 && new Date() <= OFERTA_FIM);
    });
    [".abertura", ".js-pico", ".fechamento", ".js-cupom"].forEach(function (s) { var el = $(s); if (el) io.observe(el); });
  }
})();
