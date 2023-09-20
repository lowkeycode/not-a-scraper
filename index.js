const container = document.querySelector(".card-container");

async function getData() {
  return fetch("./data.json")
    .then((res) => res.json())
    .then((data) => data);
}

function buildImages(imgArr) {
  let markup = ``;
  imgArr.forEach(
    (img) =>
      (markup += `
    <div class="img">
      <img src="${img.url}" alt="${img.altText}">
    </div>
    `)
  );
  return markup;
}

function displayProducts(productArr) {
  productArr.forEach((product) => {
    const discount = Math.round((product.originalPrice.value - product.currentPrice.value) / product.originalPrice.value * 100);
    const discountSearch = 30;
    if(discountSearch > discount) {
      return;
    };
    
    const markup = `
    <a href="https://canadiantire.ca${product.url}" target="_blank">
      <li class="card">
        <h3>${product.title}</h3>
        <p class="prices">Original Price - <span>$${
          product.originalPrice.value
        }</span></p>
        <p class="prices">Sale Price - <span>$${
          product.currentPrice.value
        }</span></p>
        <p ><span class="discount">${discount}% Off</span></p>
        <div class="img-container">
          ${buildImages(product.images)}
        </div>
      </li>
    </a>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

async function init() {
  const data = await getData();
  console.log(data)
  displayProducts(data.products);
}

init();
