export function jakartaIsoDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const value = type => parts.find(part => part.type === type).value;
  return value('year') + '-' + value('month') + '-' + value('day');
}
export function dateFromIso(iso) { return new Date(iso + 'T00:00:00+07:00'); }
export function addDays(iso,days) {return jakartaIsoDate(new Date(dateFromIso(iso).getTime()+days*86400000));}
export function dayName(iso) {
  return new Intl.DateTimeFormat('id-ID',{weekday:'long',timeZone:'Asia/Jakarta'}).format(dateFromIso(iso));
}
export function dateLabel(iso,includeYear = false) {
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',...(includeYear ? {year:'numeric'} : {}),timeZone:'Asia/Jakarta'}).format(dateFromIso(iso));
}
