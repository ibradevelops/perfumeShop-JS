"use strict";
import { API_KEY } from "../API.JS";
let productsArray = [];
const searchInput = document.querySelector("#search-input");
const products = document.querySelectorAll(".product");
const productList = document.querySelector(".product__list");
const sortBtn = document.querySelector(".sort-btn");
const select = document.querySelector("select");
const options = document.querySelectorAll("option");
const closeIcon = document.querySelector(".close-icon");
const notification = document.querySelector("#notification");
const noResult = document.querySelector("#no-result");
//
(function () {
  async function fetching() {
    try {
      const response = await fetch(API_KEY);
      const items = await response.json();
      items.forEach((item) => {
        loadItems(item);
      });
      sortBtn.addEventListener("click", () => {
        startSorting();
        select.selectedIndex === 0
          ? cheapToExpensive(items)
          : expensiveToCheap(items);
        addFunctionalityToItems(document.querySelectorAll(".product"));
      });
      searchInput.addEventListener("input", () => {
        searchInputFiltering();
      });
      addFunctionalityToItems(document.querySelectorAll(".product"));
      document.querySelector(".spinner").classList.add("hide");
    } catch (err) {
      console.error(err.message);
      noResult.textContent = "Something went wrong 😕. Please try again.";
      const reloadBtn = document.createElement("button");
      reloadBtn.classList.add("catch-reload-btn");
      reloadBtn.textContent = "Reload";
      productList.append(reloadBtn);
      noResult.classList.remove("hide");
      productList.classList.add("catch");
      reloadBtn.addEventListener("click", () => {
        location.reload();
      });
    }
  }
  renderSpinner();
  fetching();
  //
  function addFunctionalityToItems(items) {
    items.forEach((item) => {
      choosingItem(item);
    });
  }
  //
  function searchInputFiltering() {
    const searchInputValue = searchInput.value.toLowerCase().trim();
    searchInputValue
      ? closeIcon.classList.remove("hide")
      : closeIcon.classList.add("hide");
    closeIcon.setAttribute("title", "Delete");
    const allProducts = document.querySelectorAll(".product");

    allProducts.forEach((product) => {
      const productName = product
        .querySelector(".product-name")
        .textContent.toLowerCase();
      if (!productName.includes(searchInputValue)) {
        product.style.display = "none";
      } else {
        product.style.display = "flex";
      }
    });
    if (Array.from(allProducts).every((val) => val.style.display === "none")) {
      noResult.classList.remove("hide");
    } else {
      noResult.classList.add("hide");
    }
    closeIcon.addEventListener("click", () => {
      noResult.classList.add("hide");
      searchInput.value = "";
      !closeIcon.classList.contains("hide") && closeIcon.classList.add("hide");
      allProducts.forEach((product) => {
        product.style.display = "flex";
      });
    });
  }
  //
  function cheapToExpensive(parametar) {
    const cheapToExpensive = parametar
      .slice()
      .sort((a, b) => a.productPriceObj - b.productPriceObj);
    cheapToExpensive.forEach((item) => {
      loadItems(item);
    });
    //###############################
    fixingLostProducts("#item-7");
    //################################
  }
  //
  function expensiveToCheap(parametar) {
    const cheapToExpensive = parametar
      .slice()
      .sort((a, b) => b.productPriceObj - a.productPriceObj);
    cheapToExpensive.forEach((item) => {
      loadItems(item);
    });
    //###############################
    fixingLostProducts("#item-2");
  }
  //
  function fixingLostProducts(parametar) {
    const lastItemChp = JSON.parse(localStorage.getItem("product"));
    if (lastItemChp === null) return;
    const item = document.querySelector(parametar);
    const itemInput = item.querySelector("input");
    const itemDelBtn = item.querySelector(".remove-btn");
    const itemBtnAdd = item.querySelector(".add-btn");
    const itemAddToCart = item.querySelector(".add-to-cart");
    const itemImg = item.firstElementChild.src;
    const itemFound = lastItemChp.find((val) => val.itemImageObj === itemImg);
    if (itemFound) {
      [itemInput, itemDelBtn, itemBtnAdd, itemAddToCart].map((val) => {
        val.style.pointerEvents = "none";
        val.style.opacity = 0.5;
      });
      itemInput.value = itemFound.productQuantityObj;
    }
  }
  //
  function startSorting() {
    noResult.classList.add("hide");
    searchInput.value = "";
    !closeIcon.classList.contains("hide") && closeIcon.classList.add("hide");
    document.querySelectorAll(".product").forEach((p) => {
      p.remove();
    });
  }
  //
  function loadItems(parametar) {
    const { id, productImgObj, productNameObj, productPriceObj } = parametar;
    const word = productNameObj.slice(" ");
    const firstRowOfWord = word.split(" ").slice(0, 2).join(" ");
    const secondRowOfWord = word.split(" ").slice(2).join(" ");
    const arrayFromLocalStorage =
      JSON.parse(localStorage.getItem("product")) || [];
    const comparingBoolean = arrayFromLocalStorage.map(
      (val) => val.itemPriceObj === productPriceObj
    );
    if (comparingBoolean.includes(true)) {
      comparingBoolean.fill(true);
    }
    const html = `
      <div class="product" id="item-${id}">
          <img src=${productImgObj.slice(3)} />
          <div class="product-name">
            ${firstRowOfWord}
            <br/>
            ${secondRowOfWord}
          </div>
          <span class="product-bio">
            <div class="quantity">
              <button class="remove-btn" ${comparingItems(
                comparingBoolean
              )}>-</button>
              <input type="number" ${comparingItems(comparingBoolean)}/>
              <button class="add-btn" ${comparingItems(
                comparingBoolean
              )}>+</button>
            </div>
            <div class="price">$${productPriceObj}</div>
          </span>
          <div class="add-to-cart" ${comparingItems(
            comparingBoolean
          )}>Add to cart</div>
        </div>
      `;
    const pStyle = document.querySelectorAll(".product");
    Array.from(pStyle).map((val) => {
      const valNameImg = val.firstElementChild.src;
      if (
        arrayFromLocalStorage.find((obj) => obj.itemImageObj === valNameImg)
      ) {
        const inputStyle = val.querySelector("input");
        inputStyle.value = arrayFromLocalStorage.find(
          (val) => val.itemImageObj === valNameImg
        ).productQuantityObj;
        const btnAddStyle = val.querySelector(".add-btn");
        const btnDelStyle = val.querySelector(".remove-btn");
        const btnToCartStyle = val.querySelector(".add-to-cart");
        [btnAddStyle, btnDelStyle, inputStyle, btnToCartStyle].map((i) => {
          i.style.opacity = 0.5;
          i.style.pointerEvents = "none";
        });
      }
    });
    productList.insertAdjacentHTML("beforeend", html);
  }
  //
  function choosingItem(parametar) {
    const addBtn = parametar.querySelector(".add-btn");
    const delBtn = parametar.querySelector(".remove-btn");
    const productInput = parametar.querySelector("input");
    const addToCart = parametar.querySelector(".add-to-cart");
    addBtn.addEventListener("click", function () {
      const productInputValue = Number(productInput.value);
      productInput.value = productInputValue + 1;
    });
    delBtn.addEventListener("click", function () {
      const productInputValue = Number(productInput.value);
      productInput.value = productInputValue - 1;
      if (productInputValue === 0) {
        productInput.value = 0;
      }
    });
    addToCart.addEventListener("click", function (e) {
      if (!productInput.value || productInput.value == 0) return;
      const itemImage = e.target.closest(".product").firstElementChild.src;
      const itemName = e.target
        .closest(".product")
        .querySelector(".product-name")
        .textContent.trim()
        .replaceAll("            ", "")
        .replaceAll("\n", " ")
        .replaceAll("  ", " ");
      const itemPrice = Number(
        e.target
          .closest(".product")
          .querySelector(".price")
          .textContent.slice(1)
      );
      notification.textContent = `
      🧴 ${productInput.value} pieces of ${itemName} has been added to your cart 🛒
          `;
      notification.classList.add("notif");
      notification.classList.remove("hide");
      setTimeout(() => {
        notification.classList.add("hide");
      }, 3500);
      productsArray.push({
        itemImageObj: itemImage,
        itemNameObj: itemName,
        itemPriceObj: itemPrice,
        productQuantityObj: +productInput.value,
        totalPriceObj: itemPrice * +productInput.value,
      });
      [addBtn, delBtn, productInput, addToCart].map((val) => {
        val.disabled = true;
        val.style.pointerEvents = "none";
        val.style.opacity = 0.5;
      });
      localStorage.setItem("product", JSON.stringify(productsArray));
    });
  }
  //
  function comparingItems(parametar) {
    return parametar.at(-1) ? "disabled" : "enabled";
  }
  //
  function renderSpinner() {
    const spinner = document.createElement("div");
    spinner.setAttribute("class", "spinner");
    productList.append(spinner);
  }
})();
// Window loading...
this.addEventListener("load", () => {
  setTimeout(() => {
    productsArray = JSON.parse(localStorage.getItem("product")) || [];
    const inputAfterLoad = document.querySelectorAll('input[type="number"]');
    const btnAddAfterLoad = document.querySelectorAll(".add-btn");
    const btnDelAfterLoad = document.querySelectorAll(".remove-btn");
    stopAct(inputAfterLoad);
    stopAct(btnAddAfterLoad);
    stopAct(btnDelAfterLoad);
    // btnToCartAfterLoadg not working properly - fixed
    // const btnToCartAfterLoad = document.querySelectorAll(".add-to-cart");
    // stopAct(btnToCartAfterLoad);
    function stopAct(parametar) {
      parametar.forEach((val) => {
        if (val.disabled) {
          val.style.opacity = 0.5;
          val.style.pointerEvents = "none";
        }
      });
    }
    const products = document.querySelectorAll(".product");
    products.forEach((val) => {
      const pr = +val
        .querySelector(".product-bio")
        .lastElementChild.textContent.slice(1);
      const inp = val
        .querySelector(".product-bio")
        .firstElementChild.querySelector("input");
      if (inp.disabled) {
        inp.value = productsArray.find(
          (val) => val.itemPriceObj === pr
        ).productQuantityObj;
        // For btnCart
        const btnCart = inp.closest(".product").lastElementChild;
        btnCart.style.opacity = 0.5;
        btnCart.style.pointerEvents = "none";
      }
    });
  }, 300);
});
