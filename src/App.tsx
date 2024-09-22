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
      attribute_name: '',
      value_name: '',
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

  const getAttributesList = async () => {
    setAttributeList([]);
    console.log(products[currentIndex].product_id);

    const productId = products[currentIndex].product_id;

    const result = await axios.get(
      `http://localhost:8080/api/attributes/${productId}`
    );
    result.data.map((description: { product_description: string }) => {
      description.product_description = description.product_description.replace(
        /: /g,
        '<br>'
      );
    });
    console.log(result.data);

    setAttributeList(result.data);
  };

  useEffect(() => {
    getImagesUrl();
  }, []);

  // Fonction pour afficher le produit suivant
  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      getAttributesList();
    }
  };

  // Fonction pour afficher le produit précédent
  const prevProduct = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Si les produits ne sont pas encore chargés
  if (products.length === 0) {
    return <div>Chargement des produits...</div>;
  }

  return (
    <>
      <div className="grid-container">
        <div className="bottom">
          <div className="previous">
            <button onClick={prevProduct} disabled={currentIndex === 0}>
              Précédent
            </button>
          </div>
          <div className="buttons">
            <button>Validate</button>
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
                <button>Update</button>
                <button>Validate</button>
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
