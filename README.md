# The Deniz Tree 🌳

Portfolyom. Framework yok, build adımı yok, bağımlılık yok. Html, css ve birkaç
js dosyası. CV bi ağaç: dallara hover, yapraklara tıkla.

## Çalıştırmak

`index.html`'i tarayıcıda aç, çalışıyor. Düzgün bi sunucu istersen

```bash
cd portfolio
python3 -m http.server 8080
```

## İçeriği değiştirmek

Sitedeki her şey [`js/content.js`](js/content.js) içinde. Renderer'larda tek
satır metin yok, o yüzden dokunman gereken tek dosya bu.

- `hidden: true` yazınca item siliniyormuş gibi kayboluyor ama duruyor
- `dx` / `dy` yaprak kötü bi yere düştüyse oynatıyor
- "about me" kartı en yukardaki `about` objesi
- hero şeridi (isim, tagline, chipler, butonlar) `index.html`'de düz html

## Deep linkler

- `?open=products` bi dalı açıyor. education, experience, products, projects, skills, beyond
- `?open=products&item=guild` kartı da açıyor
- `?theme=night`, `?rain=1`, `?game=1` de var

## Görseller

Dosyayı `assets/img/` içine at, `content.js`'te item'a `media` girişi ekle.
Olmayan dosyalar sessizce atlanıyor, fotoğraf gelmeden slotu hazırlayabilirsin.
Fotoğraflar webp, şeffaflık gerekiyorsa png.

## Deploy

Klasör kendi kendine yetiyor, bütün yollar göreceli, olduğu gibi yükleniyor.
Şu an GitHub Pages'te: push et, bi iki dakika bekle, bitti.

## Dosyalar

```
index.html   hero, svg ikon sprite, noscript
css/         base (token+hero), tree (sahne+animasyon), panel (kart+vine), game
js/          content (bütün metin), layout (ağaç matematiği), tree (masaüstü),
             mobile (telefon akordeonu), panel (kartlar), atmosphere (rüzgar),
             theme (gece gündüz), game (bisiklet), main (boot)
assets/      fonts, img, cv
```
