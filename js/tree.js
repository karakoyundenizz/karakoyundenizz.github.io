/* masaüstü renderer. 1600x880 sahnenin üstüne gerçek <button>lar
   dizilyor, altta tek bir svg dalları çiziyor */

window.PORTFOLIO = window.PORTFOLIO || {};

// hem masaüstü sahnesi hem telefondaki zemin bunları kullanıyor
window.PORTFOLIO.SPRITES = {
  // Ateş. çikolata kahve, alnından burnuna beyaz çizgi, kehribar gözler,
  // dili hep dışarda. gerçeği de böyle
  dog:
    '<svg viewBox="0 0 120 116" aria-hidden="true">' +
    '<g class="dog-tail"><path d="M34 98 C 18 99, 7 88, 13 71" fill="none" stroke="#2B2119" stroke-width="11" stroke-linecap="round"/><path d="M34 98 C 18 99, 7 88, 13 71" fill="none" stroke="#8B5A3C" stroke-width="5.4" stroke-linecap="round"/><path d="M11.6 76 C 11.4 74, 12 72.4, 13 71" fill="none" stroke="#FFF8EC" stroke-width="5.4" stroke-linecap="round"/></g>' +
    '<ellipse cx="41" cy="92" rx="19" ry="17" fill="#7A4C31" stroke="#2B2119" stroke-width="3"/>' +
    '<path d="M53 60 C 42 72, 38 92, 45 109 H 91 C 97 92, 95 72, 88 60 Z" fill="#8B5A3C" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M62 64 C 58 76, 59 88, 63 96 L 66 92 L 69 97.5 L 72.5 92.5 L 76 97 L 79 92 C 83 84, 83 74, 79 64 Z" fill="#FFF8EC"/>' +
    '<path d="M36 101 C 30 101, 28 109, 35 109.5 H 54 C 59 109, 58 101, 51 101 Z" fill="#FFF8EC" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
    '<path d="M41 105.5 V 109 M47 105.5 V 109" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M60 88 L 58.6 103 C 58 111, 88 111, 87.4 103 L 86 88" fill="#8B5A3C" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<path d="M58.8 100.5 C 57.6 111.4, 88.4 111.4, 87.2 100.5 C 80 103, 66 103, 58.8 100.5 Z" fill="#FFF8EC" stroke="#2B2119" stroke-width="2.8" stroke-linejoin="round"/>' +
    '<path d="M73 92 V 109" stroke="#2B2119" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M63.6 105.4 V 108.4 M68 105.6 V 108.8 M78 105.6 V 108.8 M82.4 105.4 V 108.4" stroke="#2B2119" stroke-width="1.7" stroke-linecap="round"/>' +
    '<path d="M52.5 62 C 60 69, 80 69, 88.5 62" fill="none" stroke="#2B2119" stroke-width="8.6" stroke-linecap="round"/>' +
    '<path d="M52.5 62 C 60 69, 80 69, 88.5 62" fill="none" stroke="#8B1E3F" stroke-width="3.6" stroke-linecap="round"/>' +
    '<g transform="rotate(-5 70 42)">' +
    '<path d="M49 25 C 35 24, 30 44, 39 58 C 47 56, 54 46, 54 34 Z" fill="#6E4429" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M91 25 C 105 24, 110 44, 101 58 C 93 56, 86 46, 86 34 Z" fill="#6E4429" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M39.6 33 C 37.6 40, 38.4 47, 41.4 52.6 M100.4 33 C 102.4 40, 101.6 47, 98.6 52.6" fill="none" stroke="#5A3722" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>' +
    '<path d="M70 15 C 88 15, 97 27, 96 40 C 95 54, 85 63, 70 63 C 55 63, 45 54, 44 40 C 43 27, 52 15, 70 15 Z" fill="#8B5A3C" stroke="#2B2119" stroke-width="3"/>' +
    '<path d="M50 28 C 53 21.6, 59 18.6, 64.6 18" fill="none" stroke="#A9744F" stroke-width="3" stroke-linecap="round" opacity="0.75"/>' +
    '<ellipse cx="70" cy="51" rx="14.5" ry="11" fill="#FFF8EC" stroke="#2B2119" stroke-width="2.6"/>' +
    '<path d="M70 16.8 C 67.4 24, 67.6 32, 63.5 40 C 61 44, 61 46, 62 47.4 C 66 43, 74 43, 78 47.4 C 79 46, 79 44, 76.5 40 C 72.4 32, 72.6 24, 70 16.8 Z" fill="#FFF8EC"/>' +
    '<path d="M66.4 57 C 65.6 65, 67.8 69.4, 71 69.4 C 74.4 69.4, 76.6 65, 75.4 57 Z" fill="#F08FA0" stroke="#2B2119" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M70.9 59.6 V 64.6" stroke="#C9627A" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M70 51.5 V 55 M70 55 C 67 59, 62.4 58.6, 60.6 55.6 M70 55 C 73 59, 77.6 58.6, 79.4 55.6" fill="none" stroke="#2B2119" stroke-width="2.1" stroke-linecap="round"/>' +
    '<path d="M62.6 45.6 C 62.6 41.4, 77.4 41.4, 77.4 45.6 C 77.4 49.4, 73.4 52, 70 52 C 66.6 52, 62.6 49.4, 62.6 45.6 Z" fill="#4A2F26" stroke="#2B2119" stroke-width="2"/>' +
    '<ellipse cx="67.2" cy="44.6" rx="2.4" ry="1.3" fill="#FFF8EC" opacity="0.55"/>' +
    '<circle cx="60.4" cy="51.6" r="0.9" fill="#C9A98C"/><circle cx="62.6" cy="54.6" r="0.9" fill="#C9A98C"/><circle cx="79.6" cy="51.6" r="0.9" fill="#C9A98C"/><circle cx="77.4" cy="54.6" r="0.9" fill="#C9A98C"/>' +
    '<g class="dog-eye"><circle cx="57.6" cy="36.6" r="6.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="2.4"/><circle cx="58.8" cy="37.2" r="3.7" fill="#E0A526"/><circle cx="59.2" cy="37.4" r="1.9" fill="#2B2119"/><circle cx="57.8" cy="35.8" r="1" fill="#FFFDF8"/></g>' +
    '<g class="dog-eye"><circle cx="82.4" cy="36.6" r="6.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="2.4"/><circle cx="83.2" cy="37.2" r="3.7" fill="#E0A526"/><circle cx="83.6" cy="37.4" r="1.9" fill="#2B2119"/><circle cx="82.2" cy="35.8" r="1" fill="#FFFDF8"/></g>' +
    '<path d="M51.6 27.4 C 54.6 24.6, 59.4 24.4, 62.6 26.6 M77.4 26.6 C 80.6 24.4, 85.4 24.6, 88.4 27.4" fill="none" stroke="#5A3722" stroke-width="2.4" stroke-linecap="round"/>' +
    '</g>' +
    "</svg>",
  // kafası eski bi tüplü monitör, yüzü ekranda. kol sadece el sallarken çıkıyor
  robot:
    '<svg viewBox="0 0 110 120" aria-hidden="true">' +
    '<g class="robot-figure">' +
    '<g class="robot-arm"><path d="M30 78 L 17 70 L 13 52" fill="none" stroke="#2B2119" stroke-width="8.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 78 L 17 70 L 13 52" fill="none" stroke="#9AA4AC" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="70" r="3.6" fill="#F4B942" stroke="#2B2119" stroke-width="2.2"/><path d="M7.4 47 C 6 40, 12 37, 15 41 M18.6 47 C 21.6 42, 18 36.6, 13.6 38" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/><circle cx="13" cy="50" r="4.2" fill="#8E979F" stroke="#2B2119" stroke-width="2.4"/></g>' +
    '<path d="M80 78 L 93 86 L 95 100" fill="none" stroke="#2B2119" stroke-width="8.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 78 L 93 86 L 95 100" fill="none" stroke="#9AA4AC" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M55 20 L 50.4 17.6 L 59.6 15 L 50.4 12.4 L 57 10" fill="none" stroke="#2B2119" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle class="robot-antenna" cx="57.6" cy="6.6" r="4.6" fill="#F4B942" stroke="#2B2119" stroke-width="2.6"/>' +
    '<rect x="46" y="60" width="18" height="9" fill="#7C858D" stroke="#2B2119" stroke-width="2.6"/>' +
    '<path d="M46 64.6 H 64" stroke="#2B2119" stroke-width="1.6" opacity="0.6"/>' +
    '<path d="M35 69 H 75 C 80 69, 83 72, 83 77 V 104 H 27 V 77 C 27 72, 30 69, 35 69 Z" fill="#AEB6BD" stroke="#2B2119" stroke-width="3.2" stroke-linejoin="round"/>' +
    '<path d="M76 71 C 79 72, 80.6 74, 80.6 77 V 104 H 73 V 71 Z" fill="#8E979F" opacity="0.7"/>' +
    '<circle cx="42" cy="82" r="6.4" fill="#FFFDF8" stroke="#2B2119" stroke-width="2.4"/>' +
    '<path d="M42 82 L 45.6 78.6" stroke="#8B1E3F" stroke-width="2" stroke-linecap="round"/><circle cx="42" cy="82" r="1.2" fill="#2B2119"/>' +
    '<circle cx="56" cy="78" r="2.5" fill="#8B1E3F" stroke="#2B2119" stroke-width="1.6"/><circle cx="63.4" cy="78" r="2.5" fill="#F4B942" stroke="#2B2119" stroke-width="1.6"/><circle cx="70.8" cy="78" r="2.5" fill="#5eead4" stroke="#2B2119" stroke-width="1.6"/>' +
    '<path d="M54 85.6 H 72 M54 89.6 H 72" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>' +
    '<rect x="19.4" y="33" width="9" height="14" rx="3" fill="#8E979F" stroke="#2B2119" stroke-width="2.6"/>' +
    '<rect x="81.6" y="33" width="9" height="14" rx="3" fill="#8E979F" stroke="#2B2119" stroke-width="2.6"/>' +
    '<rect x="26" y="19" width="58" height="42" rx="11" fill="#C3CCD3" stroke="#2B2119" stroke-width="3.2"/>' +
    '<path d="M76 21.4 C 80 22.6, 81.6 26, 81.6 30 V 50 C 81.6 54.6, 79.6 57.6, 75 58.6 Z" fill="#9AA4AC" opacity="0.75"/>' +
    '<path d="M33 23.4 H 62" stroke="#FFFDF8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>' +
    '<rect x="31.6" y="26" width="42" height="29" rx="7.5" fill="#1F2B35" stroke="#2B2119" stroke-width="2.6"/>' +
    '<path d="M36 51 L 47 29 H 53 L 42 51 Z" fill="#FFFDF8" opacity="0.08"/>' +
    '<g class="robot-eyes"><circle class="robot-eye" cx="44" cy="38.6" r="6" fill="#EFFFFB"/><circle class="robot-eye" cx="61" cy="38.6" r="6" fill="#EFFFFB"/><circle cx="42.6" cy="39.2" r="2.4" fill="#1F2B35"/><circle cx="59.6" cy="39.2" r="2.4" fill="#1F2B35"/></g>' +
    '<path class="robot-smile" d="M47.6 48.4 C 50.6 51, 54.6 51, 57.6 48.4" fill="none" stroke="#EFFFFB" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="78" cy="30" r="1.6" fill="#8B1E3F"/><path d="M76 37 H 80 M76 41 H 80 M76 45 H 80" stroke="#2B2119" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>' +
    '</g>' +
    '<g class="robot-bush">' +
    '<path d="M3 119 C -3 108, 4 97, 14 98 C 15 89, 28 85, 35 92 C 41 84, 55 86, 57 95 C 62 91, 70 92, 73 98 L 73 119 Z" fill="#4E9F3D" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M40 119 C 37 109, 45 101, 54 104 C 57 95, 71 93, 77 100 C 84 94, 97 97, 98 106 C 106 106, 110 113, 107 119 Z" fill="#7BB661" stroke="#2B2119" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M12 106 C 15 103, 19 103, 22 106 M26 99 C 29 96.6, 33 97, 35.6 100 M60 110 C 63 107.6, 67 108, 69.6 111 M82 104.6 C 85 102.6, 89 103, 91.6 106" fill="none" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>' +
    '<circle cx="47" cy="99" r="3.4" fill="#F4B942" stroke="#2B2119" stroke-width="1.8"/><circle cx="47" cy="99" r="1" fill="#2B2119"/>' +
    '<circle cx="89" cy="112" r="3" fill="#F6D5DE" stroke="#2B2119" stroke-width="1.8"/><circle cx="89" cy="112" r="0.9" fill="#8B1E3F"/>' +
    '<circle cx="20" cy="113" r="2.6" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.6"/>' +
    '</g>' +
    "</svg>",
  bike:
    '<svg viewBox="0 0 96 66" aria-hidden="true">' +
    '<g class="bike-wheel"><circle cx="19" cy="47" r="15" fill="#FFFDF8" stroke="#2B2119" stroke-width="3.2"/><circle cx="19" cy="47" r="10.8" fill="none" stroke="#2B2119" stroke-width="1.1" opacity="0.35"/><path d="M19 36.2 V57.8 M8.2 47 H29.8 M11.4 39.4 L26.6 54.6 M26.6 39.4 L11.4 54.6" stroke="#2B2119" stroke-width="1.2" opacity="0.45"/></g>' +
    '<g class="bike-wheel"><circle cx="76" cy="47" r="15" fill="#FFFDF8" stroke="#2B2119" stroke-width="3.2"/><circle cx="76" cy="47" r="10.8" fill="none" stroke="#2B2119" stroke-width="1.1" opacity="0.35"/><path d="M76 36.2 V57.8 M65.2 47 H86.8 M68.4 39.4 L83.6 54.6 M83.6 39.4 L68.4 54.6" stroke="#2B2119" stroke-width="1.2" opacity="0.45"/></g>' +
    '<path d="M35 25 L 33 16.6" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M19 47 L 35 25 L 62 24 L 44 47 Z M35 25 L 44 47 M62 24 L 76 47 M64 15.6 L 61.6 25" fill="none" stroke="#2B2119" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M19 47 L 35 25 L 62 24 L 44 47 Z M35 25 L 44 47 M62 24 L 76 47 M64 15.6 L 61.6 25" fill="none" stroke="#12907E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25 13 C 25 11.4, 26.4 10.6, 28 10.8 L 40 12.2 C 43 12.6, 43 17, 40 17 H 31 C 27.6 17, 25 15.4, 25 13 Z" fill="#8B1E3F" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M57.4 13.6 C 61 12, 66 12.4, 69.6 15.4 C 71.8 17.2, 72.4 19.6, 71.2 21.4" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M57.6 13.5 L 55.4 14.5" stroke="#2B2119" stroke-width="6" stroke-linecap="round"/><path d="M57.6 13.5 L 55.4 14.5" stroke="#F4B942" stroke-width="2.8" stroke-linecap="round"/>' +
    '<circle cx="44" cy="47" r="5.2" fill="#F4B942" stroke="#2B2119" stroke-width="2.2"/><circle cx="44" cy="47" r="1.4" fill="#2B2119"/>' +
    '<path d="M44 47 L 49.6 54.4 M46.8 55.4 H 53" stroke="#2B2119" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="19" cy="47" r="2.2" fill="#2B2119"/><circle cx="76" cy="47" r="2.2" fill="#2B2119"/>' +
    "</svg>",
  sun:
    '<svg viewBox="0 0 120 120" aria-hidden="true">' +
    '<g class="sun-rays" fill="none" stroke="#E9A820" stroke-width="5" stroke-linecap="round">' +
    '<path d="M60 6 V22 M60 98 V114 M6 60 H22 M98 60 H114 M22 22 L33 33 M87 87 L98 98 M98 22 L87 33 M33 87 L22 98"/>' +
    "</g>" +
    '<circle cx="60" cy="60" r="26" fill="#FBD46D" stroke="#2B2119" stroke-width="4"/>' +
    '<circle cx="52" cy="56" r="2.6" fill="#2B2119"/><circle cx="68" cy="56" r="2.6" fill="#2B2119"/>' +
    '<path d="M52 66 C 56 70, 64 70, 68 66" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
    "</svg>",
  moon:
    '<svg viewBox="0 0 120 120" aria-hidden="true">' +
    '<path d="M72 16 A46 46 0 1 0 104 64 A36 36 0 0 1 72 16 Z" fill="#F6E7B8" stroke="#2B2119" stroke-width="4" stroke-linejoin="round"/>' +
    // bi tane kapalı göz, sonra aşağı doğru uzayıp ısırığın ucuna
    // giden bi gülüş. düz gülücük denedim surat gibi durmadı
    '<path d="M52 50 C 56 55, 63 55, 67 50" fill="none" stroke="#2B2119" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M76 84 C 86 92, 99 85, 104 67" fill="none" stroke="#2B2119" stroke-width="2.8" stroke-linecap="round"/>' +
    // kraterler, suratın olmadığı yerlere
    '<circle cx="46" cy="30" r="4" fill="#EBD79F" stroke="#2B2119" stroke-width="1.8" opacity="0.85"/>' +
    '<circle cx="36" cy="86" r="3" fill="#EBD79F" stroke="#2B2119" stroke-width="1.6" opacity="0.7"/>' +
    "</svg>",
  stars:
    '<svg viewBox="0 0 1600 480" preserveAspectRatio="none" aria-hidden="true" fill="#FFE9A3">' +
    '<path class="star-tw1" d="M180 90 L184 102 L196 106 L184 110 L180 122 L176 110 L164 106 L176 102 Z"/>' +
    '<path class="star-tw2" d="M420 50 L423 59 L432 62 L423 65 L420 74 L417 65 L408 62 L417 59 Z"/>' +
    '<path class="star-tw1" d="M1150 70 L1153 79 L1162 82 L1153 85 L1150 94 L1147 85 L1138 82 L1147 79 Z"/>' +
    '<path class="star-tw2" d="M1340 150 L1344 162 L1356 166 L1344 170 L1340 182 L1336 170 L1324 166 L1336 162 Z"/>' +
    '<circle class="star-tw2" cx="300" cy="170" r="4"/>' +
    '<circle class="star-tw1" cx="560" cy="90" r="3.4"/>' +
    '<circle class="star-tw2" cx="760" cy="140" r="4.4"/>' +
    '<circle class="star-tw1" cx="950" cy="60" r="3"/>' +
    '<circle class="star-tw2" cx="1060" cy="190" r="3.6"/>' +
    '<circle class="star-tw1" cx="1470" cy="215" r="4"/>' +
    '<circle class="star-tw1" cx="90" cy="210" r="3.2"/>' +
    '<circle class="star-tw2" cx="1250" cy="240" r="3"/>' +
    "</svg>",
  // saka kuşu. iki kanadı var: biri kapalı (tünerken) biri açık (uçarken),
  // css hangisi lazımsa onu gösteriyor. davranışı js/bird.js'te
  bird:
    '<svg viewBox="0 0 76 66" aria-hidden="true">' +
    '<g class="bird-tail"><path d="M19 40 L 3 45 L 10 47.4 L 4 53 L 22 48 Z" fill="#2B2119" stroke="#2B2119" stroke-width="2.6" stroke-linejoin="round"/><path d="M8.6 46.4 L 12 45.6 M9 51 L 12.6 49.6" stroke="#FFFDF8" stroke-width="1.8" stroke-linecap="round"/></g>' +
    '<g class="bird-legs"><path d="M34 55 V 62 M30.4 63.4 L 34 62 L 38 63.4 M44 54.6 V 62 M40.4 63.4 L 44 62 L 48 63.4" fill="none" stroke="#2B2119" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<path d="M14 42 C 12 29, 23 19, 38 19 C 52 19, 60 28, 59 40 C 58 51, 48 57, 35 57 C 23 57, 15 51, 14 42 Z" fill="#C08A55" stroke="#2B2119" stroke-width="2.8"/>' +
    '<path d="M27 55.4 C 37 58.4, 54 54, 57.6 41 C 53 47, 45 50.4, 36 50 C 30 50, 24 52, 27 55.4 Z" fill="#FFF4E2"/>' +
    '<path d="M45.6 21.4 C 51 18, 57 19, 60.6 23" fill="none" stroke="#2B2119" stroke-width="2.8"/>' +
    '<circle cx="52" cy="22" r="12" fill="#FFFDF8" stroke="#2B2119" stroke-width="2.8"/>' +
    '<path d="M40.4 20 C 41 12.6, 48 9, 55 10.6 C 51.6 12.6, 49 16.4, 48.4 22 C 48 27, 46 31, 43 32.6 C 40.6 29.6, 39.8 24.6, 40.4 20 Z" fill="#2B2119"/>' +
    '<path d="M55 10.6 C 61 11.6, 64.4 16.6, 63.8 23 C 63 28.6, 59 32.4, 54 33.6 C 56.6 29, 57 23, 55.4 17.6 C 54.8 15, 54.6 12.6, 55 10.6 Z" fill="#D8392B"/>' +
    '<path d="M62 18.4 L 73.6 22.6 L 62 26.6 Z" fill="#F6DEC6" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M62.6 22.6 H 70" stroke="#2B2119" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>' +
    '<g class="bird-eye"><circle cx="57.4" cy="20" r="3.7" fill="#FFFDF8" stroke="#2B2119" stroke-width="1.8"/><circle cx="58.2" cy="20.2" r="1.7" fill="#2B2119"/></g>' +
    '<g class="bird-wing-folded"><path d="M20 35 C 25 26.6, 39 25.4, 47 32.6 C 46 43, 36 50, 16 48.6 C 16 43, 17.4 38.6, 20 35 Z" fill="#2B2119" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/><path d="M21.6 40 C 29 35.4, 38 34.6, 45 38 L 43 42.6 C 36.6 40.4, 29.6 41, 22 45.6 Z" fill="#F4C20D"/><path d="M18.6 46.6 L 22 45.8 M24.6 47.4 L 28 46.4" stroke="#FFFDF8" stroke-width="1.7" stroke-linecap="round"/></g>' +
    '<g class="bird-wing-fly"><path d="M27 34 C 19 22, 12 10, 2 5 C 7 9, 10 12, 11 15 C 7 14, 5 14, 4 14.6 C 9 16, 12 19, 14 22 C 10.6 21.6, 8.6 22, 7.6 22.8 C 13 24, 17 28, 21 35 C 25 39, 33 40, 39 36 Z" fill="#2B2119" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/><path d="M23.4 33 C 19 26, 15 20.4, 10.6 16.4 L 14 15.6 C 19 19.6, 24 25, 29.6 32.6 Z" fill="#F4C20D"/></g>' +
    "</svg>",
  leaf:
    '<svg viewBox="0 0 32 32" aria-hidden="true">' +
    '<path d="M16 3 C 26 8, 28 20, 16 29 C 4 20, 6 8, 16 3 Z" fill="#7BB661" stroke="#2B2119" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M16 8 V 24" stroke="#2B2119" stroke-width="1.8" stroke-linecap="round"/>' +
    "</svg>",
};

// tıklanan bulutun altına asılan yağmur (html.raining açıyor)
// bit yağıyor, 0 ve 1. süreler inline çünkü css animation kısayolu
// hepsini eziyor
window.PORTFOLIO.RAIN_HTML =
  '<span class="rain" aria-hidden="true">' +
  '<b class="puddle"></b>' +
  '<i class="drop" style="left:4%;animation-delay:0s;animation-duration:1.45s">0</i>' +
  '<i class="drop" style="left:17%;animation-delay:0.55s;animation-duration:1.75s">1</i>' +
  '<i class="drop" style="left:30%;animation-delay:0.2s;animation-duration:1.5s">1</i>' +
  '<i class="drop" style="left:43%;animation-delay:0.8s;animation-duration:1.8s">0</i>' +
  '<i class="drop" style="left:56%;animation-delay:0.4s;animation-duration:1.55s">1</i>' +
  '<i class="drop" style="left:69%;animation-delay:1s;animation-duration:1.65s">0</i>' +
  '<i class="drop" style="left:82%;animation-delay:0.1s;animation-duration:1.4s">0</i>' +
  '<i class="drop" style="left:94%;animation-delay:0.65s;animation-duration:1.7s">1</i>' +
  "</span>";

(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var HOVER_INTENT_MS = 90;
  var COLLAPSE_GRACE_MS = 300;

  var stage = null;
  var layoutResult = null;
  var openSection = null;
  var pinnedSection = null;
  var expandTimer = 0;
  var collapseTimer = 0;
  var groups = {}; // sectionId -> {branchBtn, leafGroup, edgeGroup, leafBtns}
  var perches = {}; // sectionId -> kuşun o daldaki tüneği

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function icon(name, cls) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", cls || "node-icon");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  // ucuz bi hash, her düğüm renderlar arası aynı açıda kalsın
  // Math.random() kullanıyordum her resizeda ağaç titriyordu
  function tilt(id, range) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
    return ((h / 997) * 2 - 1) * range;
  }

  function buildCloud(cls, parent) {
    var c = el("button", cls, parent);
    c.type = "button";
    c.setAttribute("aria-label", "Rain");
    c.setAttribute("aria-pressed",
      document.documentElement.classList.contains("raining") ? "true" : "false");
    c.title = "tap a cloud for rain";
    c.innerHTML = window.PORTFOLIO.RAIN_HTML;
    return c;
  }

  // üç derinlik katmanı, atmosphere.js dünyayı ağacın etrafında
  // kaydırıyor. ağaç hiç kıpırdamıyor
  // güneşin katmanı aria-hidden değil, o güneş gerçek bi buton
  function buildDecorations(parent, layout) {
    var S = window.PORTFOLIO.SPRITES;

    var sky = el("div", "deco deco-sky", parent);

    var toggle = el("button", "sun-toggle", sky);
    toggle.type = "button";
    toggle.innerHTML =
      '<span class="sun" aria-hidden="true">' + S.sun + "</span>" +
      '<span class="moon" aria-hidden="true">' + S.moon + "</span>";

    var stars = el("div", "stars", sky);
    stars.setAttribute("aria-hidden", "true");
    stars.innerHTML = S.stars;

    // bulutlar da buton, birine basınca yağmur başlıyor
    buildCloud("cloud cloud-1", sky);
    buildCloud("cloud cloud-2", sky);

    var hills = el("div", "deco deco-hills", parent);
    hills.setAttribute("aria-hidden", "true");
    el("div", "hill hill-back", hills);
    el("div", "hill hill-front", hills);

    var motes = el("div", "deco deco-motes", parent);
    motes.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 6; i++) {
      var p = el("div", "pollen pollen-" + (i + 1), motes);
      p.style.left = 12 + i * 15 + "%";
    }

    if (window.PORTFOLIO.THEME) window.PORTFOLIO.THEME.syncUi();
  }

  function buildBee(parent, layout) {
    var expBranch = null;
    layout.branches.forEach(function (b) {
      if (b.section.id === "experience") expBranch = b;
    });
    var anchor = expBranch || layout.branches[0];
    if (!anchor) return;

    var beeWrap = el("div", "bee-orbit", parent);
    beeWrap.setAttribute("aria-hidden", "true");
    // kuş geldiğinden beri biraz yukarıda ve solda dolanıyor, yoksa
    // Experience ya da Products'a konmuş kuşun üstünden geçiyordu
    beeWrap.style.left = anchor.x - 50 + "px";
    beeWrap.style.top = anchor.y - 185 + "px";
    var bee = el("div", "bee", beeWrap);
    bee.innerHTML =
      '<svg viewBox="0 0 60 48">' +
      '<ellipse class="bee-wing bee-wing-l" cx="22" cy="12" rx="9" ry="6" fill="#CDEFF7" stroke="#2B2119" stroke-width="2.4"/>' +
      '<ellipse class="bee-wing bee-wing-r" cx="36" cy="11" rx="9" ry="6" fill="#E3F6FB" stroke="#2B2119" stroke-width="2.4"/>' +
      '<ellipse cx="30" cy="28" rx="16" ry="12" fill="#F4B942" stroke="#2B2119" stroke-width="3"/>' +
      '<path d="M25 17 V39 M33 16.5 V39.5" stroke="#2B2119" stroke-width="3.4"/>' +
      '<circle cx="43" cy="25" r="2.4" fill="#2B2119"/>' +
      '<path d="M46 28 L52 27" stroke="#2B2119" stroke-width="2.4" stroke-linecap="round"/>' +
      "</svg>";
  }

  function buildDog(parent, layout) {
    var dog = el("button", "dog", parent);
    dog.type = "button";
    dog.setAttribute("aria-label", "Ateş the dog says woof");
    dog.style.left = layout.root.x + 126 + "px";
    dog.style.top = layout.root.y - 26 + "px";
    dog.innerHTML =
      '<span class="dog-bubble" aria-hidden="true">woof! hire my human</span>' +
      window.PORTFOLIO.SPRITES.dog;
    dog.addEventListener("click", function () {
      dog.classList.remove("barking");
      void dog.offsetWidth; // reflow, yoksa animasyon baştan başlamıyor
      dog.classList.add("barking");
    });
  }

  // küçük robot arkadaş çalının arkasından bakıyor 🤖
  function buildRobot(parent, layout) {
    var robot = el("button", "robot", parent);
    robot.type = "button";
    robot.setAttribute("aria-label", "a little robot friend");
    robot.style.left = layout.stageW - 250 + "px";
    robot.style.top = layout.stageH - 64 + "px";
    robot.innerHTML =
      '<span class="robot-bubble" aria-hidden="true">good news, everyone!</span>' +
      window.PORTFOLIO.SPRITES.robot;
    robot.addEventListener("click", function () {
      robot.classList.remove("cheering");
      void robot.offsetWidth;
      robot.classList.add("cheering");
    });
  }

  // misafirler (js/guests.js) tepelere dağılıyor, yuva gövdenin çatalında
  var NEST = { dx: 8, dy: 30, w: 104 };
  function buildGuests(parent, layout) {
    var G = window.PORTFOLIO.GUESTS;
    if (!G) return;
    [
      ["burger", 618, 806],
      ["acorns", 1152, 790],
      ["nest", layout.trunkTop.x + NEST.dx, layout.trunkTop.y + NEST.dy],
    ].forEach(function (g) {
      var btn = G.build(g[0], parent);
      btn.style.left = g[1] + "px";
      btn.style.top = g[2] + "px";
    });
  }

  // kuşun konabileceği yerler. her dalın üst kenarında bi tünek var,
  // bi de başlangıçta durduğu yer: yuvanın kenarı
  function buildBird(parent, layout) {
    var B = window.PORTFOLIO.BIRD;
    perches = {};
    if (!B) return;
    layout.branches.forEach(function (b) {
      var btn = groups[b.section.id].branchBtn;
      // sayaç sağ üstte, kuş sol tarafa konuyor ki üstüne binmesin
      var left = b.x < layout.root.x;
      var px = b.x - btn.offsetWidth * 0.2;
      var py = b.y - btn.offsetHeight / 2 + 2;
      perches[b.section.id] = B.addPerch(parent, px, py, left ? "right" : "left");
    });
    // yuva yoksa (guests.js yüklenmediyse) eski yerine, fotoğrafın omzuna
    var home = window.PORTFOLIO.GUESTS
      ? B.addPerch(parent, layout.trunkTop.x + NEST.dx - NEST.w / 2 + 8, layout.trunkTop.y + NEST.dy - 36, "right")
      : B.addPerch(parent, layout.root.x - 37, layout.root.y - 46 - 46, "right");
    // sahnenin üstünden süzülerek geliyor, ağaç büyümesini bitirince
    var sky = B.addPerch(parent, layout.root.x - 260, -70, "right");
    B.mount(home, sky);
  }

  // mini oyunu açan bisiklet çıkartması
  function buildBikeButton(parent, layout) {
    var btn = el("button", "game-launch", parent);
    btn.type = "button";
    btn.setAttribute("aria-label", "Play Deniz's bike ride — a tiny jumping game");
    btn.style.left = "440px";
    btn.style.top = layout.stageH - 52 + "px";
    btn.innerHTML =
      window.PORTFOLIO.SPRITES.bike +
      '<span class="game-launch-label" aria-hidden="true">play!</span>';
    btn.addEventListener("click", function () {
      if (window.PORTFOLIO.GAME) window.PORTFOLIO.GAME.open(btn);
    });
  }

  function buildRoot(parent, layout, content) {
    var btn = el("button", "node root", parent);
    btn.type = "button";
    btn.id = "node-root";
    btn.style.left = layout.root.x + "px";
    btn.style.top = layout.root.y - 46 + "px";
    btn.setAttribute("aria-label", "me! — about Deniz Karakoyun");
    btn.innerHTML =
      '<img class="root-photo" src="assets/img/me.webp" alt="" onerror="this.remove()">' +
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="62" r="44" fill="#F8C79A" stroke="#2B2119" stroke-width="5"/>' +
      '<path d="M22 55 C18 26 40 12 60 12 C80 12 102 26 98 55 C94 42 86 36 60 36 C34 36 26 42 22 55 Z" fill="#3A2A1E" stroke="#2B2119" stroke-width="5" stroke-linejoin="round"/>' +
      '<circle cx="45" cy="60" r="5" fill="#2B2119"/><circle cx="75" cy="60" r="5" fill="#2B2119"/>' +
      '<path d="M46 80 C52 88 68 88 74 80" fill="none" stroke="#2B2119" stroke-width="4.4" stroke-linecap="round"/>' +
      "</svg>" +
      '<span class="root-label">me!</span>';
    btn.addEventListener("click", function () {
      if (window.PORTFOLIO.PANEL) {
        window.PORTFOLIO.PANEL.openAbout(btn);
      }
    });
    return btn;
  }

  function buildBranch(parent, b) {
    var s = b.section;
    var btn = el("button", "node branch accent-" + s.accent, parent);
    btn.type = "button";
    btn.dataset.section = s.id;
    btn.id = "branch-" + s.id;
    btn.style.left = b.x + "px";
    btn.style.top = b.y + "px";
    btn.style.setProperty("--tilt", tilt(s.id, 2.5).toFixed(2) + "deg");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "group-" + s.id);
    btn.appendChild(icon(s.icon));
    var label = el("span", "node-label", btn);
    label.textContent = s.label;
    var count = el("span", "node-count", btn);
    count.textContent = s.items.filter(function (i) { return !i.hidden; }).length;
    count.setAttribute("aria-hidden", "true");
    return btn;
  }

  function buildLeaf(parent, leaf, index) {
    var it = leaf.item;
    var btn = el("button", "node leaf accent-" + leaf.section.accent + (it.flagship ? " flagship" : ""), parent);
    btn.type = "button";
    btn.dataset.section = leaf.section.id;
    btn.dataset.item = it.id;
    btn.style.left = leaf.x + "px";
    btn.style.top = leaf.y + "px";
    btn.style.setProperty("--i", index);
    btn.style.setProperty("--tilt", tilt(it.id, 3.5).toFixed(2) + "deg");
    if (it.flagship) {
      var star = el("span", "leaf-star", btn);
      star.textContent = "★";
      star.setAttribute("aria-hidden", "true");
    }
    // flagship meyveler gerçek logoyu takıyor gerisi çizilmiş ikonu
    // logo dosyası yoksa ikona geri dönüyoruz
    if (it.flagship && it.logo) {
      var mark = el("img", "leaf-mark", btn);
      mark.alt = "";
      mark.width = 20;
      mark.height = 20;
      mark.onerror = function () { btn.replaceChild(icon(it.icon, "node-icon leaf-icon"), mark); };
      mark.src = it.logo;
    } else {
      btn.appendChild(icon(it.icon, "node-icon leaf-icon"));
    }
    var label = el("span", "node-label", btn);
    label.textContent = it.node || it.title;
    // bu oturumda açılan yapraklar okundu işaretini tutuyor
    if (window.PORTFOLIO.PANEL && window.PORTFOLIO.PANEL.isVisited && window.PORTFOLIO.PANEL.isVisited(it.id)) {
      btn.classList.add("visited");
    }
    return btn;
  }

  function setOpen(sectionId) {
    if (openSection === sectionId) return;
    openSection = sectionId;
    Object.keys(groups).forEach(function (sid) {
      var g = groups[sid];
      var on = sid === sectionId;
      g.branchBtn.classList.toggle("open", on);
      g.branchBtn.classList.toggle("dim", sectionId !== null && !on);
      g.branchBtn.setAttribute("aria-expanded", on ? "true" : "false");
      g.leafGroup.classList.toggle("open", on);
      g.edgeGroup.classList.toggle("open", on);
    });
    if (stage) stage.dataset.open = sectionId || "";
    // kuş açılan dala konuyor. dal kapanınca olduğu yerde kalıyor
    if (sectionId && perches[sectionId] && window.PORTFOLIO.BIRD) {
      window.PORTFOLIO.BIRD.flyTo(perches[sectionId]);
    }
  }

  function expand(sectionId, pin) {
    clearTimeout(collapseTimer);
    if (pin) pinnedSection = sectionId;
    setOpen(sectionId);
  }

  function collapse(force) {
    if (pinnedSection && !force) return;
    pinnedSection = null;
    setOpen(null);
  }

  function scheduleExpand(sectionId) {
    clearTimeout(expandTimer);
    clearTimeout(collapseTimer);
    if (openSection === sectionId) return;
    expandTimer = setTimeout(function () {
      if (!pinnedSection) setOpen(sectionId);
    }, HOVER_INTENT_MS);
  }

  function scheduleCollapse() {
    clearTimeout(expandTimer);
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(function () { collapse(false); }, COLLAPSE_GRACE_MS);
  }

  // oklar dallarda geziyor, aşağı yapraklara giriyor, escape kapatıyor
  function handleKeydown(e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains("node")) return;
    var key = e.key;
    var branchBtns = layoutResult.branches.map(function (b) { return groups[b.section.id].branchBtn; });

    if (t.classList.contains("branch")) {
      var idx = branchBtns.indexOf(t);
      if (key === "ArrowRight" || key === "ArrowLeft") {
        e.preventDefault();
        var next = branchBtns[(idx + (key === "ArrowRight" ? 1 : branchBtns.length - 1)) % branchBtns.length];
        next.focus();
      } else if (key === "ArrowDown" || key === "ArrowUp") {
        e.preventDefault();
        expand(t.dataset.section, true);
        var leafBtns = groups[t.dataset.section].leafBtns;
        if (leafBtns.length) leafBtns[0].focus();
      } else if (key === "Escape") {
        collapse(true);
      }
    } else if (t.classList.contains("leaf")) {
      var sid = t.dataset.section;
      var leaves = groups[sid].leafBtns;
      var li = leaves.indexOf(t);
      if (key === "ArrowRight" || key === "ArrowLeft") {
        e.preventDefault();
        leaves[(li + (key === "ArrowRight" ? 1 : leaves.length - 1)) % leaves.length].focus();
      } else if (key === "ArrowUp") {
        e.preventDefault();
        groups[sid].branchBtn.focus();
      } else if (key === "Escape") {
        collapse(true);
        groups[sid].branchBtn.focus();
      }
    }
  }

  function render(rootEl) {
    var content = window.PORTFOLIO.CONTENT;
    layoutResult = window.PORTFOLIO.LAYOUT.compute(content);
    openSection = null;
    pinnedSection = null;
    groups = {};

    rootEl.innerHTML = "";
    stage = el("div", "stage", rootEl);
    stage.style.width = layoutResult.stageW + "px";
    stage.style.height = layoutResult.stageH + "px";
    stage.dataset.open = "";

    // svg alt katman. süsler düğümlerden sonra ekleniyor ki tab sırası
    // önce ağaca gelsin, z-index onları tekrar alta atıyor
    var svg = svgEl("svg", {
      class: "stage-svg",
      viewBox: "0 0 " + layoutResult.stageW + " " + layoutResult.stageH,
      "aria-hidden": "true",
    }, stage);

    var wobbleG = svgEl("g", { filter: "url(#wobble)" }, svg);

    svgEl("path", { class: "trunk-path", d: layoutResult.trunkPath, pathLength: 1 }, wobbleG);

    layoutResult.branches.forEach(function (b, i) {
      var p = svgEl("path", {
        class: "branch-path",
        d: b.path,
        pathLength: 1,
      }, wobbleG);
      p.style.setProperty("--bi", i);
    });

    // yaprak çizgileri turbulence filtresinin DIŞINDA duruyor
    // içine koyunca her frame filtreyi baştan hesaplıyor ve resmen
    // takılıyor. bunu bulmam çok sürdü
    var edgeGroups = {};
    layoutResult.branches.forEach(function (b) {
      edgeGroups[b.section.id] = svgEl("g", { class: "edge-group", "data-section": b.section.id }, svg);
    });
    var leafIndexPerSection = {};
    layoutResult.leaves.forEach(function (leaf) {
      var sid = leaf.section.id;
      var i = leafIndexPerSection[sid] = (leafIndexPerSection[sid] || 0);
      var p = svgEl("path", { class: "leaf-path", d: leaf.path, pathLength: 1 }, edgeGroups[sid]);
      p.style.setProperty("--i", i);
      leafIndexPerSection[sid] = i + 1;
    });

    // her dal butonunun hemen ardından kendi yaprak grubu geliyor
    // böylece tab sırası mantıklı: dalı aç, tab ile içine gir
    buildRoot(stage, layoutResult, content);

    var leavesBySection = {};
    layoutResult.leaves.forEach(function (leaf) {
      var sid = leaf.section.id;
      (leavesBySection[sid] = leavesBySection[sid] || []).push(leaf);
    });

    layoutResult.branches.forEach(function (b, bi) {
      var btn = buildBranch(stage, b);
      btn.style.setProperty("--bi", bi);

      var g = el("div", "leaf-group", stage);
      g.id = "group-" + b.section.id;
      g.setAttribute("role", "group");
      g.setAttribute("aria-label", b.section.label);

      var leafBtns = [];
      (leavesBySection[b.section.id] || []).forEach(function (leaf, i) {
        leafBtns.push(buildLeaf(g, leaf, i));
      });

      groups[b.section.id] = {
        branchBtn: btn,
        leafGroup: g,
        edgeGroup: edgeGroups[b.section.id],
        leafBtns: leafBtns,
      };
    });

    buildBee(stage, layoutResult);
    buildBird(stage, layoutResult);
    buildDog(stage, layoutResult);
    buildRobot(stage, layoutResult);
    buildGuests(stage, layoutResult);
    buildBikeButton(stage, layoutResult);
    buildDecorations(stage, layoutResult);

    // hepsi delegated, sahne çok sık baştan kuruluyor
    stage.addEventListener("mouseover", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node) return;
      if (node.classList.contains("branch")) scheduleExpand(node.dataset.section);
      else if (node.classList.contains("leaf")) { clearTimeout(collapseTimer); clearTimeout(expandTimer); }
    });
    stage.addEventListener("mouseout", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node || node.classList.contains("root")) return;
      var to = e.relatedTarget;
      if (to && to.closest && to.closest(".node.branch, .node.leaf")) return;
      if (openSection) scheduleCollapse();
      else clearTimeout(expandTimer);
    });
    stage.addEventListener("click", function (e) {
      var node = e.target.closest ? e.target.closest(".node") : null;
      if (!node) return;
      if (node.classList.contains("branch")) {
        var sid = node.dataset.section;
        if (pinnedSection === sid) { collapse(true); }
        else { expand(sid, true); }
      } else if (node.classList.contains("leaf")) {
        pinnedSection = node.dataset.section;
        var section = null, item = null;
        content.sections.forEach(function (s) {
          if (s.id === node.dataset.section) {
            section = s;
            s.items.forEach(function (it) { if (it.id === node.dataset.item) item = it; });
          }
        });
        if (item && window.PORTFOLIO.PANEL) window.PORTFOLIO.PANEL.open(item, section, node);
      }
    });
    stage.addEventListener("keydown", handleKeydown);

    // çift rAF. tek frameyle bazen animasyon atlanıyordu
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add("grown"); });
    });

    return stage;
  }

  window.PORTFOLIO.TREE = {
    render: render,
    expand: expand,
    collapse: collapse,
    getStage: function () { return stage; },
  };
})();
