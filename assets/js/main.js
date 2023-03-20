async function getProducts() {
  try {
    const data = await fetch(
      "https://ecommercebackend.fundamentos-29.repl.co/"
    );

    const res = await data.json();

    window.localStorage.setItem("products", JSON.stringify(res));

    return res;
  } catch (error) {
    console.log(error);
  }
}

function printProducts(db) {
  const productsHTML = document.querySelector(".products");

  let html = "";

  for (const product of db.products) {
    const buttonAdd = product.quantity
      ? `<i class='bx bx-plus'id='${product.id}' ></i>`
      : "<span class='soldOut'> Sold Out </span>";

    html += `
        <div class="product">
            <div class="product_img">
              <img src="${product.image}" alt="imagen">
            </div>
       
            <div class="product_info">
                <h4 class="product-title" id="0${product.id}">${product.name} 
                  <p><b>stock</b>: ${product.quantity}</p>
                </h4>
                <h3>$
                  ${product.price}
                  ${buttonAdd}
                </h3>
            </div>
        </div>
        `;
  }

  productsHTML.innerHTML = html;
}

function handleShowCart() {
  const iconCartHTML = document.querySelector(".bx-cart-add");
  const closeCart = document.querySelector(".close_cart");
  const cartHTML = document.querySelector(".cart");
  const openMenu = document.querySelector(".bx-menu-alt-left");
  const mobileMenu = document.querySelector(".mobile_menu");
  const moon = document.querySelector(".bx-moon");

  let count = 0;
  iconCartHTML.addEventListener("click", function () {
    cartHTML.classList.toggle("cart_show");
  });
  closeCart.addEventListener("click", function () {
    cartHTML.classList.toggle("cart_show");
  });
  openMenu.addEventListener("click", function () {
    const menu = document.querySelector(".mobile_menu");
    menu.classList.toggle("mobile_menu-show");
  });
  mobileMenu.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("home-link") ||
      event.target.classList.contains("products-link")
    ) {
      mobileMenu.classList.toggle("mobile_menu-show");
    }
  });
  moon.addEventListener("click", function () {
    const body = document.querySelector("body");
    body.classList.toggle("dark-mode");
  });
}

function addToCartFromProducts(db) {
  const productsHTML = document.querySelector(".products");
  productsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);

      const productFind = db.products.find((product) => product.id === id);

      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount)
          return alert("no hay disponibilidad");
        db.cart[productFind.id].amount++;
      } else {
        db.cart[productFind.id] = { ...productFind, amount: 1 };
      }

      window.localStorage.setItem("cart", JSON.stringify(db.cart));

      printProductsInCart(db);
      printTotal(db);
      handlePrintAmountProducts(db);
    }
    showProductModal(e, db);
  });
}

function showProductModal(event, db) {
  if (event.target.classList.contains("product-title")) {
    const id = Number(event.target.id);
    const product = db.products.find((product) => product.id === id);
    loadProductModal(product);
  }
}

function loadProductModal(product) {
  const modal = document.querySelector(".modal");
  const buttonAdd = product.quantity
      ? `<i class='bx bx-plus plus_modal' id='00${product.id}'></i>`
      : "<span class='soldOut'> Sold Out </span>";
  const html = `
        <div class="modal_container">
          <i class='bx bx-x-circle close_modal'></i>
          <img src="${product.image}" alt="">
          <h3 class="modal_container_name">${product.name}</h3>
          <p class="modal_container_description">${product.description}</p>
          <div class="modal_info">  
            <h3 class="modal_container_price">$${product.price}
              ${buttonAdd}
            </h3>
            <p class="modal_container_stock">Stock:${product.quantity}</p>
          </div>  
        </div>
  `;
  modal.innerHTML = html;
  modal.classList.toggle("modal_show");
  const closeModal = document.querySelector(".bx-x-circle");

  closeModal.addEventListener("click", function () {
    modal.classList.toggle("modal_show");
  });
}

function addProductsFromModal(db) {
  const cartProducts = document.querySelector(".modal");

  cartProducts.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);
      const productFind = db.products.find((product) => product.id === id);
      console.log(e.target, productFind);
      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount)
          return alert("no hay disponibilidad");
        db.cart[id].amount++;
      } else {
        db.cart[productFind.id] = { ...productFind, amount: 1 };
      }
    }

    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printProductsInCart(db);
    printTotal(db);
    handlePrintAmountProducts(db);
  });
}

function printProductsInCart(db) {
  const cartProducts = document.querySelector(".cart_products");

  let html = "";

  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product];

    html += `
        <div class="cart_product">
            <div class="cart_product--img">
                <img src="${image}" alt="imagen">
            </div>
            <div class="cart_product--body">
                <h4>${name}  $${price}</h4>
                <p>Stock: ${quantity}</p>

                <div class="cart_product--body-op" id='${id}'>
                    <i class='bx bxs-checkbox-minus'></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bxs-trash'></i>
                  
                </div>
            </div>
        </div>
      `;
  }
  cartProducts.innerHTML = html;
}

function handlePtoductsInCart(db) {
  const cartProducts = document.querySelector(".cart_products");

  cartProducts.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.parentElement.id);
      const productFind = db.products.find((product) => product.id === id);
      if (productFind.quantity === db.cart[productFind.id].amount)
        return alert("no hay disponibilidad");
      db.cart[id].amount++;
    }

    if (e.target.classList.contains("bxs-checkbox-minus")) {
      const id = Number(e.target.parentElement.id);
      if (db.cart[id].amount === 1) {
        const response = confirm("estas seguro de eliminar este producto?");
        if (!response) return;
        delete db.cart[id];
      } else {
        db.cart[id].amount--;
      }
    }

    if (e.target.classList.contains("bxs-trash")) {
      const id = Number(e.target.parentElement.id);
      const response = confirm("seguro me quieres eliminar?");
      if (!response) return;
      delete db.cart[id];
    }

    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printProductsInCart(db);
    printTotal(db);
    handlePrintAmountProducts(db);
  });
}

function printTotal(db) {
  const infoTotal = document.querySelector(".info_total");
  const infoAmount = document.querySelector(".info_amount");

  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in db.cart) {
    const { amount, price } = db.cart[product];
    totalProducts += price * amount;
    amountProducts += amount;
  }

  infoTotal.textContent = amountProducts + " units";
  infoAmount.textContent = "$" + totalProducts + " .00";
}

function handleTotal(db) {
  const btnBuy = document.querySelector(".btn_buy");

  btnBuy.addEventListener("click", function () {
    if (!Object.values(db.cart).length) return alert("vas a comprar?");

    const response = confirm("seguro que quieres comprar?");
    if (!response) return;

    const currentProducts = [];

    for (const product of db.products) {
      const productCart = db.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }

    db.products = currentProducts;
    db.cart = {};

    window.localStorage.setItem("products", JSON.stringify(db.products));
    window.localStorage.setItem("cart", JSON.stringify(db.cart));

    printTotal(db);
    printProductsInCart(db);
    printProducts(db);
    handlePrintAmountProducts(db);
  });
}

function handlePrintAmountProducts(db) {
  const amountProducts = document.querySelector(".amountProducts");

  let amount = 0;

  for (const product in db.cart) {
    amount += db.cart[product].amount;
  }

  amountProducts.textContent = amount;
}

function filterByClothes(db) {
  db["productsAll"] = [...db.products];
  document.querySelectorAll("[data-filter]").forEach((element) => {
    if (element.getAttribute("data-filter") === "all") {
      element.classList.add("filter-active");
    }
    element.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-filter");

      if (filterValue !== "all") {
        const newDb = db.productsAll.filter(
          (product) => product.category === filterValue
        );
        db.products = newDb;
      } else {
        db.products = [...db.productsAll];
      }
      filterActive(filterValue);
      printProducts(db);
    });
  });
}

function filterActive(filterValue) {
  document.querySelectorAll("[data-filter]").forEach((item) => {
    if (item.getAttribute("data-filter") !== filterValue) {
      item.classList.remove("filter-active");
    } else {
      item.classList.add("filter-active");
    }
  });
}

async function main() {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  };

  window.addEventListener('load', () => {
    const contenedor_loader = document.querySelector('.cont')
    contenedor_loader.style.opacity = 0
    contenedor_loader.style.visibility = 'hidden'
  })

  printProducts(db);
  handleShowCart();
  addToCartFromProducts(db);
  printProductsInCart(db);
  handlePtoductsInCart(db);
  printTotal(db);
  handleTotal(db);
  handlePrintAmountProducts(db);
  filterByClothes(db);
  addProductsFromModal(db);
}

main();
