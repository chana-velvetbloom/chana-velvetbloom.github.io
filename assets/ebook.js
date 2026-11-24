// สร้างหน้า eBook จากรายการสินค้า  renderEbook(el, products, {category, imgUrl})
window.renderEbook = function (el, products, opt = {}) {
  const imgUrl = opt.imgUrl || (f => SHOP.imageDir + encodeURIComponent(f));
  const list = products.filter(p => !p.hidden && p.code && p.name && (!opt.category || p.category === opt.category));
  const cats = [...new Set(list.map(p => p.category || 'อื่น ๆ'))];
  const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const money = p => p.priceNum ? '฿' + p.priceNum.toLocaleString('th-TH') : '';
  const cover = opt.coverImg || 'assets/hero.jpg';
  const pages = [];
  pages.push(`<section class="pg cover"><img class="hero" src="${cover}" alt=""><div class="fade"></div><img class="logo" src="assets/logo.png" alt="">
    <div class="tx"><h1>${opt.category ? esc(opt.category) : 'Handmade Velvet Wire Catalog'}</h1><p>งานลวดกำมะหยี่ทำมือ · ของตกแต่ง · ของขวัญ</p><div class="ed">ฉบับวันที่ ${today} · ${list.length} รายการ</div></div></section>`);
  pages.push(`<section class="pg about"><span class="pill">ยินดีต้อนรับ</span><h2>สวัสดีค่ะ จาก C.HANA</h2>
    <p>C.HANA Velvet Bloom ทำงานแฮนด์เมดจากลวดกำมะหยี่ ทั้งตุ๊กตา ดอกไม้ และของตกแต่ง ชอบชิ้นไหน ทักมาสอบถามได้เลยค่ะ</p>
    <div class="steps"><div class="st"><b>1</b>เลือกสินค้า<br>จดรหัสไว้</div><div class="st"><b>2</b>แอด LINE<br>ส่งรหัสสินค้า</div><div class="st"><b>3</b>สอบถามราคา<br>ขนาด และสั่งซื้อ</div></div>
    <div style="margin:3mm 0;padding:2.5mm 4mm;border-radius:3mm;background:#F5EFD6;color:#55683F;font-size:10.5pt;text-align:center">✿ ทุกชิ้นงาน<b>ปรับเปลี่ยนสี</b> หรือ<b> Custom </b>ตามที่ต้องการได้ · <b>เพิ่มไฟ LED</b> +20 บาท</div>
    <div class="qb"><img src="assets/line-qr.png" alt=""><div><div class="m" style="font-size:13pt;color:var(--g)">สั่งซื้อ / สอบถาม</div><div style="font-size:11pt;margin-top:1mm">LINE ID: <b>${esc(SHOP.lineId)}</b></div><div style="font-size:9pt;color:var(--mu)">สแกน QR เพื่อเพิ่มเพื่อน</div></div></div>
    <div class="ft"><span>C.HANA Velvet Bloom</span><span>02</span></div></section>`);
  // เลขหน้า: ปก 1, แนะนำ 2, เริ่มสินค้าหน้า 3 (ไม่มีสารบัญ)
  let pg = 3; const toc = [], body = [];
  cats.forEach((c, ci) => {
    const its = list.filter(p => (p.category || 'อื่น ๆ') === c);
    const id = String(ci + 1).padStart(2, '0');
    toc.push(`<div class="row"><span class="n">${id}</span><span>${esc(c)}<span class="s">${its.length} รายการ</span></span><span class="d">${String(pg).padStart(2, '0')}</span></div>`);
    const per = +opt.perPage || 12;
    for (let k = 0; k < its.length; k += per) {
      const hdr = k === 0 ? `<div class="gh"><div class="k">CATEGORY ${id}</div><h2>${esc(c)}</h2><p>${its.length} รายการ</p></div>` : `<div class="gh sm"><h2>${esc(c)} (ต่อ)</h2></div>`;
      const cards = its.slice(k, k + per).map(p => `<div class="cd"><img src="${p.imgs[0] ? imgUrl(p.imgs[0]) : 'assets/logo.png'}" alt="">
        <div class="b"><div class="c"><span>${esc(p.code)}</span>${p.flagList.includes('new') ? '<i>มาใหม่</i>' : p.flagList.includes('custom') ? '<i>สั่งทำได้</i>' : ''}</div>
        <h3>${esc(p.name)}</h3><p class="ds">${esc(p.description)}</p>
        ${money(p) ? `<div class="pr">${money(p)}</div>` : `<div class="pr ask">ราคา สอบถามทาง LINE</div>`}</div></div>`).join('');
      body.push(`<section class="pg">${hdr}<div class="cards n${per}">${cards}</div><div class="ft"><span>LINE: ${esc(SHOP.lineId)}</span><span>${String(pg).padStart(2, '0')}</span></div></section>`);
      pg++;
    }
  });
  pages.push(...body);
  pages.push(`<section class="pg back"><img class="logo" src="assets/logo.png" alt=""><h2>ขอบคุณที่แวะมาชมนะคะ</h2><p style="font-size:11pt;margin:2mm 0 0">สนใจชิ้นไหน ทักมาสอบถามได้เลยค่ะ<br>ทุกชิ้นปรับเปลี่ยนสี หรือ Custom งานได้ · เพิ่มไฟ LED +20 บาท</p><img class="qr" src="assets/line-qr.png" alt=""><div class="m" style="font-size:14pt">LINE ID: ${esc(SHOP.lineId)}</div></section>`);
  el.classList.add('eb');
  el.innerHTML = pages.join('');
  return { pages: pages.length, items: list.length };
};
// รอให้รูปโหลดครบก่อนพิมพ์
window.ebookReady = el => Promise.all([...el.querySelectorAll('img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
