const moment = require("moment");
const orderModule = require("../model/orderModule");

async function getFirstMonthOrders() {
  const startDate = moment().subtract(1, "months").startOf("month");
  const endDate = moment().subtract(1, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);
  console.log(totalSale, "totalSale11111111111111");
  return totalSale;
}

async function getSecondMonthOrders() {
  const startDate = moment().subtract(2, "months").startOf("month");
  const endDate = moment().subtract(2, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}
async function getThirdMonthOrders() {
  const startDate = moment().subtract(3, "months").startOf("month");
  const endDate = moment().subtract(3, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}
async function getFourthMonthOrders() {
  const startDate = moment().subtract(4, "months").startOf("month");
  const endDate = moment().subtract(4, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}
async function getFifthMonthOrders() {
  const startDate = moment().subtract(5, "months").startOf("month");
  const endDate = moment().subtract(5, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}
async function getSixthMonthOrders() {
  const startDate = moment().subtract(6, "months").startOf("month");
  const endDate = moment().subtract(6, "months").endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}
async function getCurrentMonthOrders() {
  const startDate = moment().startOf("month");
  const endDate = moment().endOf("month");
  const orders = await orderModule.find({
    $and: [{ createdAt: { $gt: startDate } }, { createdAt: { $lt: endDate } }],
  });
  const totalSale = orders.reduce((total, order) => {
    total += order.total;
    return total;
  }, 0);

  return totalSale;
}



async function pieChartDetails() {
  const sixthMonData = await getSixthMonthOrders();
  const fifthMonData = await getFifthMonthOrders();
  const fourthMonData = await getFourthMonthOrders();
  const thirdMonData = await getThirdMonthOrders();
  const secondMonData = await getSecondMonthOrders();
  const firstMonData = await getFirstMonthOrders();
  const currentMonData = await getCurrentMonthOrders();
  

  const allData = [

    sixthMonData,
    fifthMonData,
    fourthMonData,
    thirdMonData,
    secondMonData,
    firstMonData,
    currentMonData,
  ];
  return allData;
}

module.exports = { pieChartDetails };
