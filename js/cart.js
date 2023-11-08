"use strict";
let productsFromLS = JSON.parse(localStorage.getItem("product")) || [];
const hero = document.querySelector(".hero");
const placeForProducts = document.querySelector(".place-for-products");
const inputs = document.querySelectorAll("input");
const totalAll = document.querySelector("#total-all");
const deleteAllBtn = document.querySelector("#del-all-btn");
const continueBtn = document.querySelector("#continue-btn");
const spinner = document.querySelector(".spinner");
totalAll.classList.add("hide");
deleteAllBtn.classList.add("hide");
totalAllFun();
//
if (productsFromLS.length > 0) {
  productsFromLS.map((entry) => {
    const {
      itemImageObj: itemImage,
      itemNameObj: itemName,
      itemPriceObj: itemPrice,
      productQuantityObj: productQuantity,
      totalPriceObj: totalPrice,
    } = entry;
    const html = `
    <div class="product-cart-item">
      <img src="${itemImage}">
      <div class="product-cart-name">${itemName}</div>
      <span>
      <p class="product-cart-price">$${itemPrice}</p>
      <p class="product-cart-quantity">${productQuantity} pieces</p>
      </span>
      <p class="product-cart-item-total">Total of this item:  
      $${totalPrice}</p>
      <button class="product-cart-del-btn">Remove item</button>
    </div>
    `;
    placeForProducts.insertAdjacentHTML("beforeend", html);
    totalAll.classList.remove("hide");
    //
    const removeBtn = document.querySelectorAll(".product-cart-del-btn");
    removeBtn.forEach((b) => {
      b.addEventListener("click", function (e) {
        const productCart = e.target.closest(".product-cart-item");
        productCart.remove();
        const closestPrice = +productCart
          .querySelector(".product-cart-price")
          .textContent.slice(1);
        productsFromLS = productsFromLS.filter(
          (val) => val.itemPriceObj !== closestPrice
        );
        localStorage.setItem("product", JSON.stringify(productsFromLS));
        totalAllFun();
        if (productsFromLS.length === 0) {
          deleteAllBtn.classList.add("hide");
          totalAll.textContent = "";
        }
      });
    });
  });
  //
  deleteAllBtn.classList.remove("hide");
  deleteAllBtn.addEventListener("click", this.greatReset.bind());
  //
  continueBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const [inp1, inp2, inp3, inp4, inp5] = inputs;
    if (!inp1.value || !inp2.value || !inp3.value || !inp4.value || !inp5.value)
      return;
    const firstPartName = inp1.value.slice(0, 1).toUpperCase();
    const secondPartName = inp1.value.slice(1).toLowerCase();
    const nameUserValue = (firstPartName + secondPartName).trim();
    const thankUser = document.createElement("h1");
    const lastBtn = document.createElement("button");
    lastBtn.textContent = "Okay";
    lastBtn.classList.add("btn-styling");
    thankUser.innerHTML = `Thank you, ${nameUserValue}. <br/> Your purchase was accepted ✅.`;
    thankUser.classList.add("thank-user");
    hero.innerHTML = "";
    thankUser.classList.add("hide");
    lastBtn.classList.add("hide");
    spinner.classList.remove("hide");
    document.querySelector("body").classList.add("center-spinner");
    setTimeout(() => {
      spinner.classList.add("hide");
      lastBtn.classList.remove("hide");
      thankUser.classList.remove("hide");
      document.querySelector("body").classList.remove("center-spinner");
    }, 2000);
    hero.classList.add("hero-styling");
    hero.append(thankUser);
    hero.append(lastBtn);
    lastBtn.addEventListener("click", function () {
      greatReset();
      location.href = "index.html";
    });
  });
}

function totalAllFun() {
  totalAll.textContent = `Total:  $${productsFromLS
    .map((val) => val.totalPriceObj)
    .reduce((acc, val) => acc + val, 0)}
    `;
}
function greatReset() {
  deleteAllBtn.classList.add("hide");
  totalAll.textContent = "";
  document
    .querySelectorAll(".product-cart-item")
    .forEach((val) => val.remove());
  productsFromLS = [];
  localStorage.clear();
}

