function getNthDate(nthDate) {
  let date = new Date();
  return new Date(date.setDate(date.getDate() + nthDate));
}
let a = getNthDate(6);
console.log(a.toLocaleDateString(), "getNthDate");
// console.log(removeTime(new Date()));
console.log(new Date());



