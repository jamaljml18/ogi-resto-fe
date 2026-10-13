export function summarizeCart(cart,menus) {
  const byId = new Map(menus.map(menu => [menu.id,menu]));
  const itemsList = Object.entries(cart).flatMap(([id,qty]) => {
    const item = byId.get(id);
    return item && qty > 0 ? [{id:item.id,name:item.name,price:Number(item.price),qty,subtotal:Number(item.price)*qty}] : [];
  });
  return {itemsList,totalItems:itemsList.reduce((sum,item) => sum+item.qty,0),
    totalPrice:itemsList.reduce((sum,item) => sum+item.subtotal,0)};
}
