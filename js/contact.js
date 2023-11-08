"use strict";
const dateOne = document.querySelector(".date-one");
const dateTwo = document.querySelector(".date-two");
setInterval(() => {
  const dateJs = new Date();
  dateOne.textContent = `${dateJs.getDate()}/${
    dateJs.getMonth() + 1
  }/${dateJs.getFullYear()}`;
  dateTwo.textContent = `${dateJs.getHours()}:${String(
    dateJs.getMinutes()
  ).padStart(2, 0)}:${String(dateJs.getSeconds()).padStart(2, 0)}`;
}, 1000);
