// ===== ตั้งค่าร้าน (แก้ตรงนี้ได้) =====
window.SHOP = {
  name: 'C.HANA Velvet Bloom',
  lineId: 'cning4413',
  lineUrl: 'https://line.me/ti/p/~cning4413',
  dataUrl: 'data/products.csv',
  imageDir: 'images/'
};
window.FIELDS = ['code','name','name_en','category','price','size','colors','materials','description','images','flags','status','sort'];

// CSV parser (รองรับเครื่องหมายคำพูด, ขึ้นบรรทัดใหม่ในช่อง, BOM)
window.parseCSV = function (text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); f = ''; if (row.some(v => v !== '')) rows.push(row); row = [];
    } else f += c;
  }
  row.push(f); if (row.some(v => v !== '')) rows.push(row);
  const head = (rows.shift() || []).map(h => h.trim());
  return rows.map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
};
window.toCSV = function (list) {
  const esc = v => { v = v == null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return '﻿' + [FIELDS.join(','), ...list.map(p => FIELDS.map(k => esc(p[k])).join(','))].join('\n') + '\n';
};
window.normalize = function (p) {
  const o = {}; FIELDS.forEach(k => o[k] = p[k] || '');
  o.imgs = o.images ? o.images.split('|').map(s => s.trim()).filter(Boolean) : [];
  o.flagList = o.flags ? o.flags.split('|').map(s => s.trim()).filter(Boolean) : [];
  o.priceNum = parseFloat(String(o.price).replace(/[^\d.]/g, '')) || 0;
  o.hidden = /^(hide|hidden|ซ่อน)$/i.test(o.status);
  return o;
};
window.loadProducts = async function () {
  let r = await fetch(SHOP.dataUrl + '?v=' + Date.now());
  if (!r.ok) r = await fetch('products.csv?v=' + Date.now()); // สำรอง: กรณีไฟล์อยู่นอกโฟลเดอร์ data
  if (!r.ok) throw new Error('โหลดข้อมูลสินค้าไม่ได้');
  return parseCSV(await r.text()).map(normalize).sort((a, b) => (+a.sort || 999) - (+b.sort || 999));
};
window.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
window.FLAG_LABEL = { new: 'มาใหม่', featured: 'แนะนำ', custom: 'สั่งทำได้' };
