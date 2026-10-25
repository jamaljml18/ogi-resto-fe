export function createOrderEditDraft(order, menus) {
  const byId = new Map(menus.map(menu => [menu.id, menu]));
  return (Array.isArray(order.items) ? order.items : []).filter(item => item && !item._meta).map((item, index) => {
    const matches = menus.filter(menu => menu.name.trim().toLocaleLowerCase('id-ID') === String(item.name || '').trim().toLocaleLowerCase('id-ID'));
    const menu = byId.get(item.id) || (matches.length === 1 ? matches[0] : null);
    return { key:index + 1, id:menu?.id || '', qty:String(item.qty || 1), originalName:item.name || '' };
  });
}
export function calculateOrderEdit(draft, menus) {
  const byId = new Map(menus.map(menu => [menu.id, menu]));
  const seen = new Set(); let total = 0, error = '';
  if (!draft.length || draft.length > 50) error = 'Pilih antara 1 dan 50 menu.';
  const lines = draft.map(line => {
    const menu = byId.get(line.id), qty = Number(line.qty);
    const valid = menu && menu.is_active !== false && Number.isSafeInteger(Number(menu.price)) && Number(menu.price) >= 0 && Number.isSafeInteger(qty) && qty >= 1 && qty <= 999;
    if (!valid) error = 'Pilih menu yang tersedia dan isi jumlah antara 1 dan 999.';
    if (seen.has(line.id) && line.id) error = 'Menu yang sama cukup dicatat sekali. Gabungkan jumlahnya.';
    seen.add(line.id);
    const subtotal = valid ? Number(menu.price) * qty : 0; total += subtotal;
    return { ...line, menu, qty, subtotal };
  });
  if (!Number.isSafeInteger(total) || total > 2147483647) error = 'Total pesanan melebihi batas yang didukung.';
  return { lines, total, error, items:lines.map(line => ({id:line.id,qty:line.qty,expectedPrice:Number(line.menu?.price)})) };
}
