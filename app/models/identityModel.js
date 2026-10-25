export function normalizeCompany(value) {
  const company = String(value || '').trim().replace(/\s+/g, ' ');
  return /^pt\.? (?:bmt|bright mobile (?:telecommunication|telecommuncation|telecommunications))$/i.test(company)
    ? 'PT BMT' : company;
}
export function identityPart(value) {
  return String(value || '').trim().toLocaleLowerCase('id-ID');
}
export function orderDailyIdentity(order) {
  return JSON.stringify([
    identityPart(order.user_name || order.userName),
    identityPart(normalizeCompany(order.company)),
    identityPart(order.division),
    order.order_date || order.orderDate || String(order.created_at || '').split('T')[0]
  ]);
}
export function uniqueIdentityValues(values) {
  const unique = new Map();
  for (const value of values) {
    const display = String(value || '').trim(), key = identityPart(display);
    if (key && !unique.has(key)) unique.set(key, display);
  }
  return [...unique.values()].sort((a,b) => a.localeCompare(b,'id'));
}
