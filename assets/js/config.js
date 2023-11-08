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

  colorMap.set("Housing","Test")
  colorMap.set("Transportation","Color");
  colorMap.set("Groceries","Color");
  colorMap.set("Food","Color");
  colorMap.set("Utilities","Color");
  colorMap.set("Subscriptions","Color");
  colorMap.set("Misc","Color");
  colorMap.set("other", "lastColor");
  colorMap.set("Investing", "IColor")

  return colorMap;
}


   