export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];




export const budgetColours = ()=>{
  const colorMap = new Map();

  colorMap.set("Housing","#3498db")
  colorMap.set("Transportation","#2ecc71");
  colorMap.set("Groceries","#e74c3c");
  colorMap.set("Food","#9b59b6");
  colorMap.set("Utilities","#f1c40f");
  colorMap.set("Subscriptions","#e67e22");
  colorMap.set("Misc","#e91e63");
  colorMap.set("other", "#1abc9c");
  colorMap.set("Investing", "#95a5a6");

  return colorMap;
}


   