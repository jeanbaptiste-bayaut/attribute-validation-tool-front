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
  const [attributeListToEdit, setattributeListToEdit] = useState<
    { attribute_name: string; value_name: string }[]
  >([]);
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
    setCheckedState(new Array(result.data.length).fill(true));
    setAttributeList(result.data);
  };

  const [checkedState, setCheckedState] = useState<boolean[]>([]);

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const inputFalse = updatedCheckedState.reduce<
      { attribute_name: string; value_name: string }[]
    >((list, currentState, index) => {
      if (currentState === false) {
        return [...list, attributeList[index]];
      }
      console.log(list);

      return list;
    }, []);
    setattributeListToEdit(inputFalse);
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

  const handleFailButton = async () => {
    const productId = products[currentIndex].product_id;
    attributeListToEdit.forEach(async (attribute) => {
      const { attribute_name, value_name } = attribute;

      try {
        const requestAttributeId = await axios.get(
          `http://localhost:8080/api/attributes/name/${attribute_name}`
        );

        const attribute_id = requestAttributeId.data.id;

        if (!attribute_id) {
          throw new Error(
            `l'attribut n'a pas été trouvé pour ${attribute_name}`
          );
        }

        const requestValueid = await axios.get(
          `http://localhost:8080/api/values/name/${attribute_id}/${value_name}`
        );

        const value_id = requestValueid.data.id;

        if (!value_id) {
          throw new Error(`la valeur n'a pas été trouvé pour ${value_name}`);
        }

        const result = await axios.patch(
          `http://localhost:8080/api/attributes/status/${productId}/${attribute_id}/${value_id}`
        );

        if (!result) {
          throw new Error(
            `le produit ${productId} n'a pas été mis à jour pour les valeurs ${attribute_name} ${value_name}`
          );
        }
        getImagesUrl();
        nextProduct();
      } catch (error) {
        throw new Error(String(error));
      }
    });
    alert(
      `le produit ${products[currentIndex].product_style} - ${products[currentIndex].product_name} est envoyé pour correction`
    );
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
            <button onClick={handleFailButton}>Fail</button>
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
                <label className="switch">
                  <input
                    type="checkbox"
                    id={`switch-${index}`}
                    name={`${attribute.attribute_name}:${attribute.value_name}`}
                    value={`${attribute.attribute_name}:${attribute.value_name}`}
                    checked={checkedState[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <span className="slider"></span>
                </label>
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
            {products[currentIndex].product_description
              .replace(/([A-Z][a-zA-Z ]+):/g, ';$1:')
              .split(';')
              .map((line, index) => {
                if (line === '') {
                  return null;
                }
                return <p key={index}>{line}</p>;
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
