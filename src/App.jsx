import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  const [products, setProducts] = useState([]);
  const [fiteredProducts, setFilteredProducts] = useState([]);

  //const [basket, setBasket] = useState([]);
  const API_URL = "https://fakestoreapi.com";

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setIsFetching(false);
        console.log(data);
      });
  }, []);
  const [basketItems, setBasketItems] = useState([]);
  const clearCartItems = () => {};
  const Basket = ({ cartItems }) => {
    return (
      <>
        <h2>Basket {cartItems ? cartItems.length : 0}</h2>
        <ul>
          {basketItems.map((p) => (
            <li key={p.item.id}>
              {p.item.title} x {p.quantity} £
              {(p.item.price * p.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </>
    );
  };
  const isInCart = (item) => {
    return basketItems.findIndex((cItem) => cItem.item.id === item.id) !== -1;
  };
  const addToBasket = (item) => {
    console.log("here", item);
    if (isInCart(item)) {
      const itemIndex = basketItems.findIndex(
        (cItem) => cItem.item.id === item.id
      );
      const newBasketItems = [...basketItems];
      newBasketItems[itemIndex].quantity += 1;
      setBasketItems(newBasketItems);
      console.log("item already in cart");
      return;
    }
    const cartItem = { item: item, quantity: 1 };
    setBasketItems((cartItems) => [...cartItems, cartItem]);
  };
  const Filters = () => {
    let categories = products.map((a) => a.category);
    categories = [...new Set(categories)];
    console.log(categories.sort((a, b) => a.length - b.length));
    return (
      <div>
        <h2>Filters</h2>
        {categories.map((category) => (
          <div key={category}>
            <input
              type="checkbox"
              id={category}
              value={category}
              onChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
    );
  };
  const Total = ({ basketItems }) => {
    console.log("basket", basketItems);
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
                <li className="list-group-item">
                  <img
                    className="card-img-top"
                    src={p.image}
                    alt={p.descrition}
                  />
                </li>
                <li className="list-group-item">
                  <p className=" card-text">{p.description}</p>
                  <span className="">£{p.price.toFixed(2)}</span>
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
        <Basket basketItems={basketItems} />
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
          {isFetching ? "fetching" : `${fiteredProducts.length} products found`}
        </p>
      </div>

      <Products
        products={fiteredProducts}
        addToCart={addToBasket}
        isInCart={isInCart}
      />
    </div>
  );
}

export default App;
