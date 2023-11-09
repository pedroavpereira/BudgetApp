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

  colorMap.set("Housing","#F02B5F")
  colorMap.set("Transportation","#6066E6");
  colorMap.set("Groceries","#6AEC7E");
  colorMap.set("Food","#FFFB72");
  colorMap.set("Utilities","#EE29E2");
  colorMap.set("Subscriptions","#FE23A3");
  colorMap.set("Misc","#1BFBDB");
  colorMap.set("other", "#BBBFC1");
  colorMap.set("Investing", "#95a5a6");

  return colorMap;
}


   