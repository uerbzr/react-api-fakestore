import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filtersToApply, setFiltersToApply] = useState([]);
  //const [basket, setBasket] = useState([]);
  const API_URL = "https://fakestoreapi.com";

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    if (filtersToApply.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        filtersToApply.includes(product.category)
      );
      setFilteredProducts(filtered);
    }
  }, [filtersToApply]);
  const [basketItems, setBasketItems] = useState([]);

  const trashHandler = () => {
    setBasketItems([]);
  };
  const Basket = ({ cartItems, trashHandler }) => {
    return (
      <>
        <h2>
          Basket {basketItems.reduce((n, { quantity }) => n + quantity, 0)}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={trashHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
            </svg>
          </button>
        </h2>
        <ul>
          {basketItems.map((p) => (
            <li key={p.item.id}>
              <strong>{p.item.title}</strong> X {p.quantity} £
              {p.item.price.toFixed(2)}=£
              {(p.item.price * p.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </>
    );
  };
  const isInBasket = (item) => {
    return basketItems.findIndex((cItem) => cItem.item.id === item.id) !== -1;
  };
  const addToBasket = (item) => {
    if (isInBasket(item)) {
      const itemIndex = basketItems.findIndex(
        (cItem) => cItem.item.id === item.id
      );
      const newBasketItems = [...basketItems];
      newBasketItems[itemIndex].quantity += 1;
      setBasketItems(newBasketItems);
      return;
    }
    const cartItem = { item: item, quantity: 1 };
    setBasketItems((cartItems) => [...cartItems, cartItem]);
  };
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const isChecked = event.target.checked;
    setFiltersToApply((prevSelected) =>
      isChecked
        ? [...prevSelected, category]
        : prevSelected.filter((c) => c !== category)
    );
  };

  const Filters = () => {
    let categories = products.map((a) => a.category);
    categories = [...new Set(categories)];
    return (
      <div className="form-check col-md-2">
        <h2>Filters</h2>
        {categories.map((category) => (
          <div key={category}>
            <input
              className="form-check-input"
              type="checkbox"
              id={category}
              value={category}
              checked={filtersToApply.includes(category)}
              onChange={handleCategoryChange}
            />
            <label className="form-check-label" htmlFor={category}>
              {category}
            </label>
          </div>
        ))}
        <input
          type="button"
          className=""
          value="Clear"
          onClick={clearfilters}
        />
      </div>
    );
  };
  const clearfilters = () => {
    setFiltersToApply([]);
  };

  const Total = ({ basketItems }) => {
    const total = basketItems.reduce(
      (sum, basketItem) => (sum += basketItem.item.price * basketItem.quantity),
      0
    );
    return (
      <div className="total-section">
        <div>
          <h3>Total</h3>
        </div>
        <div>
          <span className="total-number">£{total.toFixed(2)}</span>
        </div>
      </div>
    );
  };
  const Products = ({ products, addToCart, isInCart }) => {
    return (
      <div className="row justify-content-center text-center">
        {products.length === 0 && <p>No products found</p>}
        {products.map((p) => (
          <div key={p.id} className="card col-md-4 col-lg-3">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <h5 className="card-title">{p.title}</h5>
                </li>
                <li className="list-group-item card-image-placeholder">
                  <img
                    className="card-img-top"
                    src={p.image}
                    alt={p.descrition}
                  />
                </li>
                <li className="list-group-item">
                  <p className=" card-text">{p.description}</p>
                  <span className="card-price">£{p.price.toFixed(2)}</span>
                </li>
              </ul>

              <a
                href="#"
                onClick={() =>
                  addToCart({
                    key: p.id,
                    id: p.id,
                    description: p.description,
                    price: p.price,
                    title: p.title,
                  })
                }
                className="btn btn-success"
              >
                Add
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <Basket basketItems={basketItems} trashHandler={trashHandler} />
        <Total basketItems={basketItems} />
        <Filters />
      </div>
      <div className="row">
        <p
          style={{
            color: isFetching ? "red" : "green pull-right",
          }}
        >
          Ready:{" "}
          {isFetching
            ? "fetching"
            : `${filteredProducts.length} products found`}
        </p>
      </div>

      <Products
        products={filteredProducts}
        addToCart={addToBasket}
        isInCart={isInBasket}
      />
    </div>
  );
}

export default App;
