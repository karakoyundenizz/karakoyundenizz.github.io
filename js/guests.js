/* misafirler. duvar kağıtlarımdaki çizgi filmlere birer selam

   hiçbiri kopya değil, hepsi sitenin kendi çıkartma stilinde çizildi:
   günün burgerini yazan bıyıklı burger, durakta bekleyen dört palamut,
   bi de yuvadaki huysuz yumurta.
   üstüne gelince konuşuyorlar, tıklayınca sıradaki lafa geçiyorlar */

window.PORTFOLIO = window.PORTFOLIO || {};

(function () {
  var GUESTS = {
    burger: {
      label: "a mustached burger with a burger-of-the-day board",
      lines: [
        "burger of the day: the Segfault Slider",
        "burger of the day: Thread & Butter",
        "burger of the day: the Race Condiment",
        "burger of the day: Bun Pointer Exception",
        "burger of the day: the Mutex Melt",
      ],
      sprite:
        '<svg viewBox="0 0 140 112" aria-hidden="true">' +
        '<path d="M12 101 L 9 109 M45 100 L 49 108" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M11 59 L 45 57 L 49 101 L 7 103 Z" fill="#C08A55" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
        '<path d="M15.4 63.2 L 41.4 61.8 L 44.4 96.8 L 12 98.4 Z" fill="#35443F" stroke="#2B2119" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M17.6 68.6 C 20 66.6, 22 70.4, 24.4 68.2 C 26.6 66.4, 28.6 70, 31 68 C 33.2 66.2, 35.4 69.6, 38.6 67.4" fill="none" stroke="#FFFDF8" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M19 74.4 H 36.6" stroke="#F4B942" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M21.6 84.6 C 21.6 79.4, 34.6 79, 34.8 84.2 Z M21 87.4 H 35.6 M22.4 90.4 C 22.6 92.6, 34 92.4, 34.2 90.2" fill="none" stroke="#FFFDF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M25.6 82 L 26.2 82.6 M29.6 81.4 L 30.2 82" stroke="#FFFDF8" stroke-width="1.1" stroke-linecap="round"/>' +
        '<circle cx="28" cy="58.2" r="2.2" fill="#F4B942" stroke="#2B2119" stroke-width="1.5"/>' +
        '<path d="M82 94 V 103 M102 94 V 103" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M74.6 106.4 C 74.6 102.4, 80 101, 84.6 102.6 C 86.4 103.4, 86.6 106.4, 84.6 106.4 Z" fill="#8B1E3F" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M99.4 106.4 C 97.4 106.4, 97.6 103.4, 99.4 102.6 C 104 101, 109.4 102.4, 109.4 106.4 Z" fill="#8B1E3F" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<g class="burger-arm-l"><path d="M66 76 C 60 76, 56 73, 53 68.6" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/><circle cx="52.4" cy="67.4" r="3.3" fill="#FFFDF8" stroke="#2B2119" stroke-width="2"/></g>' +
        '<g class="burger-arm-r"><path d="M127.4 30 H 137 V 43 H 127.4 Z" fill="#D5DAE1" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/><path d="M130.6 33.4 V 39.6 M134 33.4 V 39.6" stroke="#2B2119" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/><path d="M132.2 43 V 62" stroke="#2B2119" stroke-width="3.2" stroke-linecap="round"/><path d="M118 76 C 124 76, 129 72, 131.6 65" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/><circle cx="132" cy="63.4" r="3.5" fill="#FFFDF8" stroke="#2B2119" stroke-width="2"/></g>' +
        '<path d="M64 84 H 120 C 122.4 84, 123.4 86, 122.6 88.4 C 121 93, 117 96, 111 96 H 73 C 67 96, 63 93, 61.4 88.4 C 60.6 86, 61.6 84, 64 84 Z" fill="#E2A55A" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
        '<path d="M66 91.4 C 70 93.4, 76 93.8, 84 93.8" fill="none" stroke="#C48743" stroke-width="2" stroke-linecap="round"/>' +
        '<rect x="59" y="72.6" width="66" height="13" rx="6.5" fill="#6E4429" stroke="#2B2119" stroke-width="2.8"/>' +
        '<path d="M66 77 H 71 M77 80.6 H 83 M92 77.4 H 97 M105 80.6 H 111 M114 77 H 118" stroke="#8B5A3C" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M60 67 H 124 L 119 73.6 L 112 68.6 L 104.6 79 L 97 69 L 88 73.6 L 79 69 L 71.6 76.6 L 65.6 69.6 Z" fill="#F4B942" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M58.6 66 C 58 61, 62.6 60, 65.4 63 C 67.6 59, 73 59.4, 75 63 C 77.6 59, 83.4 59.2, 85.6 63 C 88 59, 94 59, 96.4 63 C 99 59, 104.6 59.2, 107 63 C 109.4 59.4, 115 59.2, 117.4 63 C 120.4 60, 126 61, 125.4 66 C 125 69.6, 121 70.4, 118.6 68.4 C 116 71, 110.6 71, 108 68.4 C 105.4 71, 99.6 71, 97 68.4 C 94.4 71, 88.6 71, 86 68.4 C 83.4 71, 77.6 71, 75 68.4 C 72.4 71, 67 71, 64.6 68.4 C 62 70.4, 59 69.6, 58.6 66 Z" fill="#7BB661" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M62 61.6 C 62 38, 75 26, 92 26 C 109 26, 122 38, 122 61.6 C 122 63, 121 64, 119.6 64 H 64.4 C 63 64, 62 63, 62 61.6 Z" fill="#E9B266" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
        '<path d="M68.4 50 C 70 39.6, 77 33, 86 31.4" fill="none" stroke="#FFE2A8" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="M112 59.6 C 116.6 59.6, 118.6 57, 118.4 51" fill="none" stroke="#C99247" stroke-width="2.2" stroke-linecap="round"/>' +
        '<ellipse cx="92" cy="31.6" rx="2.6" ry="1.5" fill="#FFF4D6" stroke="#2B2119" stroke-width="1"/><ellipse cx="103" cy="34.4" rx="2.6" ry="1.5" transform="rotate(24 103 34.4)" fill="#FFF4D6" stroke="#2B2119" stroke-width="1"/><ellipse cx="80.6" cy="35" rx="2.6" ry="1.5" transform="rotate(-24 80.6 35)" fill="#FFF4D6" stroke="#2B2119" stroke-width="1"/><ellipse cx="111.6" cy="41.6" rx="2.4" ry="1.4" transform="rotate(50 111.6 41.6)" fill="#FFF4D6" stroke="#2B2119" stroke-width="1"/><ellipse cx="97" cy="37.6" rx="2.2" ry="1.3" transform="rotate(-10 97 37.6)" fill="#FFF4D6" stroke="#2B2119" stroke-width="1"/>' +
        '<path d="M77.6 41.8 L 84.6 40.4 M106.4 41.8 L 99.4 40.4" stroke="#2B2119" stroke-width="2.2" stroke-linecap="round"/>' +
        '<g class="burger-eye"><circle cx="83" cy="48.6" r="5.6" fill="#FFFDF8" stroke="#2B2119" stroke-width="2"/><circle cx="84.2" cy="49.2" r="2.2" fill="#2B2119"/></g>' +
        '<g class="burger-eye"><circle cx="101" cy="48.6" r="5.6" fill="#FFFDF8" stroke="#2B2119" stroke-width="2"/><circle cx="102.2" cy="49.2" r="2.2" fill="#2B2119"/></g>' +
        '<path d="M92 55.4 C 89 52.6, 82.6 53, 79.4 57.6 C 78.6 58.8, 79.6 60.2, 81 59.8 C 85.6 58.6, 89.6 59.6, 92 60.4 C 94.4 59.6, 98.4 58.6, 103 59.8 C 104.4 60.2, 105.4 58.8, 104.6 57.6 C 101.4 53, 95 52.6, 92 55.4 Z" fill="#2B2119" stroke="#2B2119" stroke-width="1.4" stroke-linejoin="round"/>' +
        "</svg>",
    },
    acorns: {
      label: "four acorn kids waiting at the bus stop",
      lines: [
        "oh my god, they pushed to main!",
        "…on a friday. you monsters!",
        "still waiting for the bus. the data bus",
      ],
      sprite:
        '<svg viewBox="0 0 194 100" aria-hidden="true">' +
        '<ellipse cx="18" cy="93" rx="7" ry="2.4" fill="#2B2119" opacity="0.22"/>' +
        '<path d="M18 27 V 92" stroke="#2B2119" stroke-width="5" stroke-linecap="round"/><path d="M18 28 V 91.4" stroke="#C9CED6" stroke-width="1.8" stroke-linecap="round"/>' +
        '<rect x="4" y="5" width="28" height="23" rx="5" fill="#12907E" stroke="#2B2119" stroke-width="2.6"/>' +
        '<rect x="9.6" y="10" width="16.8" height="10.4" rx="2.6" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.5"/><path d="M11 14.6 H 25 M15.6 10.6 V 14.4 M20.4 10.6 V 14.4" stroke="#2B2119" stroke-width="1.1" stroke-linecap="round"/><circle cx="13.6" cy="21.6" r="1.9" fill="#2B2119"/><circle cx="22.4" cy="21.6" r="1.9" fill="#2B2119"/>' +
        '<rect x="10.4" y="34" width="15.2" height="13" rx="2" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><path d="M13 38 H 23 M13 41 H 21 M13 44 H 23" stroke="#2B2119" stroke-width="1" stroke-linecap="round" opacity="0.55"/>' +
        '<ellipse cx="52.4" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><ellipse cx="63.6" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><circle cx="43.0" cy="75" r="3.5" fill="#8B1E3F" stroke="#2B2119" stroke-width="2"/><circle cx="73.0" cy="75" r="3.5" fill="#8B1E3F" stroke="#2B2119" stroke-width="2"/><path d="M44.6 61 C 43.2 76, 50.0 89, 58 89 C 66.0 89, 72.80000000000001 76, 71.4 61 Z" fill="#E3B778" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><path d="M68.0 70 C 68.4 77, 64.7 84, 60 86" fill="none" stroke="#C99B5C" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M42.2 61.6 C 42.2 50, 49.8 44.6, 58 44.6 C 66.2 44.6, 73.8 50, 73.8 61.6 Z" fill="#8B1E3F" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><rect x="40.8" y="57.6" width="34.4" height="6.4" rx="3.2" fill="#C4526F" stroke="#2B2119" stroke-width="2.2"/>' +
        '<path d="M50 53 C 52.6 49.4, 56 47.8, 59 47.6 M64.6 49.6 C 67 51.4, 68.6 53.6, 69.4 55.6" fill="none" stroke="#B0445F" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="58" cy="42.6" r="4.8" fill="#F4B942" stroke="#2B2119" stroke-width="2.2"/>' +
        '<g class="acorn-eye"><circle cx="52.4" cy="69" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="53.2" cy="69.5" r="1.7" fill="#2B2119"/></g><g class="acorn-eye"><circle cx="63.6" cy="69" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="64.4" cy="69.5" r="1.7" fill="#2B2119"/></g><path d="M54.6 77.4 C 56.6 79.60000000000001, 59.4 79.60000000000001, 61.4 77.4" fill="none" stroke="#2B2119" stroke-width="1.7" stroke-linecap="round"/>' +
        '<ellipse cx="88.4" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><ellipse cx="99.6" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><circle cx="79.0" cy="75" r="3.5" fill="#12907E" stroke="#2B2119" stroke-width="2"/><circle cx="109.0" cy="75" r="3.5" fill="#12907E" stroke="#2B2119" stroke-width="2"/><path d="M80.6 61 C 79.19999999999999 76, 86.0 89, 94 89 C 102.0 89, 108.80000000000001 76, 107.4 61 Z" fill="#E3B778" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><path d="M104.0 70 C 104.4 77, 100.7 84, 96 86" fill="none" stroke="#C99B5C" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M77.4 59 C 74.6 65, 75.4 72, 79.4 75 C 83 72, 84 66, 83.6 60 Z" fill="#0E7566" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/><path d="M110.6 59 C 113.4 65, 112.6 72, 108.6 75 C 105 72, 104 66, 104.4 60 Z" fill="#0E7566" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M78.2 61.6 C 78.2 50, 85.8 44.6, 94 44.6 C 102.2 44.6, 109.8 50, 109.8 61.6 Z" fill="#12907E" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><rect x="76.8" y="57.6" width="34.4" height="6.4" rx="3.2" fill="#7FD3C3" stroke="#2B2119" stroke-width="2.2"/>' +
        '<path d="M91 44.6 C 91 40.6, 97 40.6, 97 44.6" fill="#12907E" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<g class="acorn-eye"><circle cx="88.4" cy="69" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="89.2" cy="69.5" r="1.7" fill="#2B2119"/></g><g class="acorn-eye"><circle cx="99.6" cy="69" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="100.4" cy="69.5" r="1.7" fill="#2B2119"/></g>' +
        '<path d="M91 78 H 97" stroke="#2B2119" stroke-width="1.7" stroke-linecap="round"/>' +
        '<ellipse cx="124.4" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><ellipse cx="135.6" cy="91" rx="4.4" ry="2.6" fill="#2B2119"/><circle cx="115.0" cy="75" r="3.5" fill="#8B5A3C" stroke="#2B2119" stroke-width="2"/><circle cx="145.0" cy="75" r="3.5" fill="#8B5A3C" stroke="#2B2119" stroke-width="2"/>' +
        '<path d="M115.6 64 C 114 50, 122 43.6, 130 43.6 C 138 43.6, 146 50, 144.4 64 C 145.6 78, 138 89, 130 89 C 122 89, 114.4 78, 115.6 64 Z" fill="#4E9F3D" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M140.6 70 C 141 78, 136 85, 132 86.6" fill="none" stroke="#3B7F2E" stroke-width="2.4" stroke-linecap="round"/>' +
        '<circle cx="130" cy="62.6" r="11.6" fill="#F6E7C8" stroke="#2B2119" stroke-width="2.4"/><circle cx="130" cy="62.6" r="7.8" fill="#E3B778" stroke="#2B2119" stroke-width="1.8"/>' +
        '<g class="acorn-eye"><circle cx="126.4" cy="62.6" r="3.3" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.5"/><circle cx="126.9" cy="62.9" r="1.4" fill="#2B2119"/></g><g class="acorn-eye"><circle cx="133.6" cy="62.6" r="3.3" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.5"/><circle cx="134.1" cy="62.9" r="1.4" fill="#2B2119"/></g>' +
        '<path d="M127.4 75.4 V 81.6 M132.6 75.4 V 80" stroke="#2B2119" stroke-width="1.6" stroke-linecap="round"/>' +
        '<ellipse cx="161.6" cy="91.4" rx="4.4" ry="2.6" fill="#2B2119"/><ellipse cx="176.4" cy="91.4" rx="4.4" ry="2.6" fill="#2B2119"/><circle cx="149.0" cy="76" r="3.5" fill="#7E57A8" stroke="#2B2119" stroke-width="2"/><circle cx="189.0" cy="76" r="3.5" fill="#7E57A8" stroke="#2B2119" stroke-width="2"/><path d="M150.6 61 C 149.2 76, 158.0 90, 169 90 C 180.0 90, 188.8 76, 187.4 61 Z" fill="#E3B778" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><path d="M184.0 70 C 184.4 77, 178.2 84, 171 86" fill="none" stroke="#C99B5C" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M148.2 61.6 C 148.2 50, 158.2 45.6, 169 45.6 C 179.8 45.6, 189.8 50, 189.8 61.6 Z" fill="#7E57A8" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><rect x="146.8" y="57.6" width="44.4" height="6.4" rx="3.2" fill="#F6E7C8" stroke="#2B2119" stroke-width="2.2"/>' +
        '<path d="M158 53.6 C 161.4 50, 166 48.6, 170 48.6" fill="none" stroke="#9B78C2" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="169" cy="43.6" r="4.4" fill="#F4B942" stroke="#2B2119" stroke-width="2.2"/>' +
        '<g class="acorn-eye"><circle cx="163" cy="69.4" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="163.8" cy="69.9" r="1.7" fill="#2B2119"/></g><g class="acorn-eye"><circle cx="175" cy="69.4" r="4.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="175.8" cy="69.9" r="1.7" fill="#2B2119"/></g>' +
        '<path d="M164.4 78 C 167 79.6, 171 79.6, 173.6 78 M162 82.6 C 166 85, 172 85, 176 82.6" fill="none" stroke="#2B2119" stroke-width="1.6" stroke-linecap="round"/>' +
        "</svg>",
    },
    nest: {
      label: "a grumpy egg in the goldfinch's nest",
      lines: [
        "victory shall be mine. after i hatch",
        "what the deuce are you looking at?",
        "blast! still an egg",
      ],
      sprite:
        '<svg viewBox="0 0 96 66" aria-hidden="true">' +
        '<path d="M10 40 L 2 34.6 M86 40 L 94 35.6 M13 47 L 5.6 47.6 M83.6 47 L 90.6 49" stroke="#2B2119" stroke-width="4.4" stroke-linecap="round"/>' +
        '<path d="M10 40 L 2.4 34.9 M86 40 L 93.6 35.9 M13 47 L 6 47.6 M83.6 47 L 90.2 48.9" stroke="#C08A55" stroke-width="1.8" stroke-linecap="round"/>' +
        '<ellipse cx="48" cy="36" rx="40" ry="9.4" fill="#6E4429" stroke="#2B2119" stroke-width="2.8"/>' +
        '<g class="egg"><ellipse cx="57" cy="25" rx="18.6" ry="14.6" transform="rotate(-9 57 25)" fill="#FBF0DC" stroke="#2B2119" stroke-width="2.8"/>' +
        '<path d="M70.6 27 C 69.6 32, 66 35.6, 61 37" fill="none" stroke="#E2D2B4" stroke-width="2.6" stroke-linecap="round"/>' +
        '<circle cx="43.6" cy="19.6" r="1.2" fill="#C9B38E"/><circle cx="68.6" cy="15.4" r="1.3" fill="#C9B38E"/><circle cx="46" cy="31" r="1.1" fill="#C9B38E"/><circle cx="60.6" cy="12.4" r="1" fill="#C9B38E"/>' +
        '<g class="egg-eye"><circle cx="51.4" cy="24.4" r="4.8" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="52.8" cy="25.6" r="1.8" fill="#2B2119"/><path d="M46.4 23.6 C 46.8 20.4, 49 19.4, 51.4 19.4 C 53.8 19.4, 56 20.4, 56.4 23.6 Z" fill="#EADBC0" stroke="#2B2119" stroke-width="1.8" stroke-linejoin="round"/></g>' +
        '<g class="egg-eye"><circle cx="64" cy="22.6" r="4.8" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="65.4" cy="23.8" r="1.8" fill="#2B2119"/><path d="M59 21.8 C 59.4 18.6, 61.6 17.6, 64 17.6 C 66.4 17.6, 68.6 18.6, 69 21.8 Z" fill="#EADBC0" stroke="#2B2119" stroke-width="1.8" stroke-linejoin="round"/></g>' +
        '<path d="M45.6 15.6 L 54 18 M70.4 13 L 62 16.4" stroke="#2B2119" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M55.4 32 C 57.4 30.4, 60 30.2, 62.4 31.4" fill="none" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round"/></g>' +
        '<path d="M8 36 C 9 54, 26 63, 48 63 C 70 63, 87 54, 88 36 C 78 42.6, 62 45, 48 45 C 34 45, 18 42.6, 8 36 Z" fill="#D8A85A" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
        '<path d="M14 45.6 C 26 52, 44 53.6, 60 50.6 M22 54.6 C 36 59, 58 59, 74 53 M30 47.6 C 44 50, 62 49, 80 43.6 M18 50.6 C 24 54.6, 30 56.6, 38 57.6" fill="none" stroke="#8B5A3C" stroke-width="1.9" stroke-linecap="round"/>' +
        '<path d="M12.6 41.6 C 20 46, 30 47.6, 40 48 M56 55.6 C 64 54.6, 72 52, 79 47.6" fill="none" stroke="#F3D79B" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M27 43.6 C 22 38, 22.6 33, 27.6 30.6 C 31 35, 31 40, 27 43.6 Z" fill="#7BB661" stroke="#2B2119" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M27.4 42.4 C 27 38.6, 27.2 35.6, 27.6 32.6" fill="none" stroke="#2B2119" stroke-width="1.1" stroke-linecap="round" opacity="0.5"/>' +
        "</svg>",
    },
  };

  // id: burger | acorns | nest. yeri çağıran veriyor (masaüstü
  // sahnesi piksel, telefon css), burası sadece düğmeyi kuruyor
  function build(id, parent) {
    var g = GUESTS[id];
    if (!g || !parent) return null;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "guest guest-" + id;
    btn.setAttribute("aria-label", g.label);
    btn.innerHTML = '<span class="guest-bubble" aria-hidden="true"></span>' + g.sprite;
    var bubble = btn.firstChild;
    var turn = 0;
    var timer = 0;
    bubble.textContent = g.lines[0];
    btn.addEventListener("click", function () {
      bubble.textContent = g.lines[turn % g.lines.length];
      turn++;
      // aynı anda tek kişi konuşsun, telefonda balonlar üst üste biniyor
      var others = document.querySelectorAll(".guest.talking");
      for (var i = 0; i < others.length; i++) others[i].classList.remove("talking");
      btn.classList.remove("talking");
      void btn.offsetWidth; // reflow, yoksa zıplama baştan başlamıyor
      btn.classList.add("talking");
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove("talking"); }, 2800);
    });
    parent.appendChild(btn);
    return btn;
  }

  window.PORTFOLIO.GUESTS = { build: build };
})();
