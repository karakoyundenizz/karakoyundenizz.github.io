#!/usr/bin/env node
/* content.js'i okuyup "yazılı sürüm" bölümünü index.html'e düz html olarak gömüyor

   ağaç JS ile çiziliyor, google ilk html'de sadece hero'yu görüyordu, 148 kelime.
   main.js aynı metni zaten üretiyordu ama sr-only ile saklıyordu, o da sayılmıyor.
   burda aynı metin build'de yazılıyor ve gerçekten sayfada duruyor.

   node tools/prerender.js
   content.js'e dokunduysan çalıştır, yoksa sayfanın altı bayat kalıyor */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const START = "<!-- PRERENDER:START — üretilmiş blok, elle düzenleme yok. kaynak: js/content.js -->";
const END = "<!-- PRERENDER:END -->";

// content.js düz bi window ataması, sandbox'ta çalıştırıp okuyoruz
function loadContent() {
  const src = fs.readFileSync(path.join(ROOT, "js", "content.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "js/content.js" });
  const C = sandbox.window.PORTFOLIO && sandbox.window.PORTFOLIO.CONTENT;
  if (!C || !C.sections) throw new Error("content.js window.PORTFOLIO.CONTENT vermedi");
  return C;
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// dışarı giden linkler yeni sekmede, kendi sayfalarım normal link kalıyor
function link(l) {
  const href = String(l.href || "");
  const external = /^https?:/i.test(href);
  const attrs = external ? ' target="_blank" rel="noopener"' : "";
  return `<a href="${esc(href)}"${attrs}>${esc(l.label)}</a>`;
}

function tagLabel(t) {
  return typeof t === "string" ? t : t.label;
}

function block(item, headingLevel) {
  const h = "h" + headingLevel;
  const out = [];
  out.push(`<article class="cv-item">`);
  out.push(`<${h}>${esc(item.title)}</${h}>`);
  if (item.subtitle) out.push(`<p class="cv-sub">${esc(item.subtitle)}</p>`);
  if (item.summary) out.push(`<p class="cv-sum">${esc(item.summary)}</p>`);
  if (item.stats && item.stats.length) {
    out.push(
      `<p class="cv-stats">` +
        item.stats.map((s) => `<strong>${esc(s.value)}</strong> ${esc(s.label)}`).join(" · ") +
        `</p>`
    );
  }
  if (item.bullets && item.bullets.length) {
    out.push(`<ul>` + item.bullets.map((b) => `<li>${esc(b)}</li>`).join("") + `</ul>`);
  }
  if (item.tags && item.tags.length) {
    out.push(
      `<p class="cv-tags">` +
        item.tags.map((t) => `<span>${esc(tagLabel(t))}</span>`).join("") +
        `</p>`
    );
  }
  if (item.links && item.links.length) {
    out.push(`<p class="cv-links">` + item.links.map(link).join(" · ") + `</p>`);
  }
  if (item.note) out.push(`<p class="cv-note">${esc(item.note)}</p>`);
  out.push(`</article>`);
  return out.join("\n");
}

// bu ikisi ilk bakışta açık dursun, gerisi katlanmış
const OPEN_BY_DEFAULT = new Set(["experience", "products"]);

// türkçe özet. site ingilizce ama aramaların çoğu türkiye'den türkçe geliyor
// çeviri gibi durmasın, normal konuşur gibi yazıyorum
const TR_SUMMARY = `Deniz Karakoyun — ODTÜ Bilgisayar Mühendisliği öğrencisiyim, 2027'de mezun oluyorum, Ankara'dayım.
İşletim sistemleri, low-level sistem programlama ve gömülü sistemler en sevdiğim alanlar;
donanıma ne kadar yakınsam o kadar iyi. Guild ve Phera Labs'in kurucu ortağı ve
geliştiricisiyim. Şu an KUARTIS'te C++17 ile ROS 2 tarafında GPS tester ve system health
üzerine çalışıyorum. Günlük işim C, C++, x86-64 assembly, Linux ve ROS 2.`;

function buildSection(C) {
  const out = [];
  out.push(START);
  out.push(`<section id="cv-text" aria-labelledby="cv-text-h">`);
  out.push(`<div class="cv-inner">`);
  out.push(`<h2 id="cv-text-h">The written version</h2>`);
  out.push(
    `<p class="cv-lede">The tree above is the fun way round. This is the same thing as plain text — every branch, every leaf, nothing hidden.</p>`
  );

  if (C.about) {
    out.push(`<div class="cv-about">`);
    if (C.about.subtitle) out.push(`<p class="cv-sub">${esc(C.about.subtitle)}</p>`);
    if (C.about.summary) out.push(`<p class="cv-sum">${esc(C.about.summary)}</p>`);
    if (C.about.bullets && C.about.bullets.length) {
      out.push(`<ul>` + C.about.bullets.map((b) => `<li>${esc(b)}</li>`).join("") + `</ul>`);
    }
    if (C.about.links && C.about.links.length) {
      out.push(`<p class="cv-links">` + C.about.links.map(link).join(" · ") + `</p>`);
    }
    out.push(`<p class="cv-tr" lang="tr">${esc(TR_SUMMARY.replace(/\s+/g, " ").trim())}</p>`);
    out.push(`</div>`);
  }

  C.sections.forEach((s) => {
    const items = (s.items || []).filter((i) => !i.hidden);
    if (!items.length) return;
    const open = OPEN_BY_DEFAULT.has(s.id) ? " open" : "";
    out.push(`<details class="cv-sec"${open}>`);
    out.push(
      `<summary><h3>${esc(s.label)}<span class="cv-count">${items.length}</span></h3></summary>`
    );
    out.push(`<div class="cv-sec-body">`);
    items.forEach((i) => out.push(block(i, 4)));
    out.push(`</div>`);
    out.push(`</details>`);
  });

  out.push(`</div>`);
  out.push(`</section>`);
  out.push(END);
  return out.join("\n");
}

function main() {
  const check = process.argv.includes("--check");
  const C = loadContent();
  const generated = buildSection(C);
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  const si = html.indexOf(START);
  const ei = html.indexOf(END);
  if (si === -1 || ei === -1) {
    throw new Error("index.html'de PRERENDER:START / PRERENDER:END işaretleri yok");
  }

  // --check yazmıyor, sadece bayat mı diye bakıyor
  if (check) {
    const current = html.slice(si, ei + END.length);
    if (current === generated) {
      console.log("prerender: index.html güncel");
      return;
    }
    console.error("prerender: index.html BAYAT — node tools/prerender.js çalıştır");
    process.exitCode = 1;
    return;
  }

  html = html.slice(0, si) + generated + html.slice(ei + END.length);
  fs.writeFileSync(indexPath, html);

  const words = generated
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ").length;
  const items = C.sections.reduce((n, s) => n + s.items.filter((i) => !i.hidden).length, 0);
  console.log(`prerender: ${C.sections.length} bölüm, ${items} kart, ~${words} kelime index.html'e yazıldı`);
}

main();
