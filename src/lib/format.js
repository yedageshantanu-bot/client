// Utility helpers
export const formatINR = (n) => {
  if (n === null || n === undefined) return "";
  return "₹" + Math.round(Number(n)).toLocaleString("en-IN");
};
