const cards = document.getElementById("cards");
const footer = document.getElementById("footer");
const boton = document.getElementById("botonSelecc");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;

const fragment = document.createDocumentFragment();
let carrito = {};

// Eventos
document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();

  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
    }
});
cards.addEventListener("click", (e) => {
  addCarrito(e);
  if (e.target.classList.contains("btn-dark")) {
    e.target.style.display = "none"
  }
});

// Traer productos
const fetchData = async () => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const data = await res.json();
  console.log(data);
  pintarCards(data);
};

// Consultar Item
const fetchItem = async (id) => {
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}`);
  const data = await res.json();
  return data;
};

// Pintar productos
const pintarCards = (data) => {
  data.forEach((item) => {
    templateCard.querySelector("h5").textContent = item.name;
    templateCard.querySelector("p").textContent = item.subregion;
    templateCard.querySelector("img").setAttribute("src", item.flag);
    templateCard.querySelector("button").dataset.id = item.alpha3Code;
    
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

// Agregar al carrito
const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    //console.log(e.target.dataset.id)
    setCarrito(e.target.dataset.id);
  }
  e.stopPropagation();
};

const setCarrito = async (item) => {
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${item}`);
  const producto = await res.json();
  //console.log(producto);
  if (carrito.hasOwnProperty(producto.alpha3Code)) {
    producto.cantidad = 1;
  }

  carrito[producto.alpha3Code] = { ...producto };

  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";

  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.numericCode;
    templateCarrito.querySelectorAll("span").textContent = producto.area;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.name;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.alpha3Code;
    templateCarrito.querySelectorAll("td")[2].textContent = producto.subregion;
    templateCarrito.querySelectorAll("td")[3].textContent = producto.capital;
    templateCarrito.querySelectorAll("td")[4].textContent = producto.area;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito))
};

const pintarFooter = () => {
  footer.innerHTML = "";

  //En el caso que el carrito este vacio
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío </th>
        `;
    return;
  }

  // sumar valores de areas de carrito
  const nArea = Object.values(carrito).reduce((acc, { area }) => acc + area, 0);

  //Renderizar los datos
  templateFooter.querySelectorAll("td")[0].textContent = Object.size(carrito);
  templateFooter.querySelector("span").textContent = nArea;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  //Boton Quitar
  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

/* Otras funciones */

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
