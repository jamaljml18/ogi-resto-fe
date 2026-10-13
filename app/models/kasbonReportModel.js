export function buildKasbonMatrix(rows,month,year) {
  const monthName = new Intl.DateTimeFormat('id-ID',{ month:'long', timeZone:'Asia/Jakarta' })
    .format(new Date(Date.UTC(year,month-1,1)));
  return { monthName, daysInMonth:new Date(Date.UTC(year,month,0)).getUTCDate(), rows,users:rows,
    totalUsersCount:rows.length,
    totalKasbonAmount:rows.reduce((sum,row) => sum+row.totalKasbon,0),
    totalCashAmount:rows.reduce((sum,row) => sum+row.totalCash,0),
    usersWithKasbonCount:rows.filter(row => row.totalKasbon>0).length,
    unpaidKasbonAmount:rows.reduce((sum,row) => sum+(row.isPaid ? 0 : row.totalKasbon),0) };
}
