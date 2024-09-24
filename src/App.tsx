/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([
    {
      product_id: 0,
      product_style: '',
      product_name: '',
      product_description: '',
      image_url: '',
    },
  ]);
  const [attributeList, setAttributeList] = useState([
    {
      attribute_name: '',
      value_name: '',
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImagesUrl = async () => {
    const result = await axios.get('http://localhost:8080/api/products');
    setProducts(result.data);
  };

  const getAttributesList = async (index: number) => {
    setAttributeList([]);

    const productId = products[index].product_id;

    const result = await axios.get(
      `http://localhost:8080/api/attributes/${productId}`
    );
    result.data.map((description: { product_description: string }) => {
      description.product_description = description.product_description.replace(
        /: /g,
        '<br>'
      );
    });
    setAttributeList(result.data);
  };

  useEffect(() => {
    getImagesUrl();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      getAttributesList(currentIndex);
    }
  }, [products, currentIndex]);

  // Fonction pour afficher le produit suivant
  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Fonction pour afficher le produit précédent
  const prevProduct = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleValidateButton = async () => {
    const productId = products[currentIndex].product_id;
    const result = await axios.patch(
      `http://localhost:8080/api/products/${productId}`
    );

    if (!result) {
      console.log("le produit n'a pas été validé");
    }
    alert(result.data.message);
    getImagesUrl();
    nextProduct();
  };

  return (
    <>
      <div>
        <p>{products.length} product(s) to validate</p>
      </div>
      <div className="grid-container">
        <div className="bottom">
          <div className="previous">
            <button onClick={prevProduct} disabled={currentIndex === 0}>
              Précédent
            </button>
          </div>
          <div className="buttons">
            <button onClick={handleValidateButton}>Validate</button>
            <button>Fail</button>
          </div>
          <div className="next">
            <button
              onClick={nextProduct}
              disabled={currentIndex === products.length - 1}
            >
              Suivant
            </button>
          </div>
        </div>
        <div className="image">
          <img
            src={products[currentIndex].image_url}
            alt={products[currentIndex].product_style}
          />
        </div>
        <div className="attributes">
          <ul>
            {attributeList.map((attribute, index) => (
              <li key={index} className="attribute-list-container">
                <span>{attribute.attribute_name}</span>
                <span>{attribute.value_name}</span>
                <button>edit</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="title-description">
          <div className="title">
            <h2>{products[currentIndex].product_name}</h2>
            <h3>{products[currentIndex].product_style}</h3>
          </div>
          <div className="description">
            <p>{products[currentIndex].product_description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
