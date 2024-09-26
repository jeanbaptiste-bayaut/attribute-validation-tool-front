import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ProductNavigation from './components/ProductNavigation/ProductNavigation';
import ProductDetails from './components/ProductDetails/ProductDetails';
import AttributeList from './components/AttributeList/AttributeList';
import ActionButtons from './components/ActionButtons/ActionButtons';

function App() {
  interface Product {
    product_id: string;
    product_name: string;
    product_style: string;
    product_description: string;
    image_url: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [attributeList, setAttributeList] = useState([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [attributeListToEdit, setattributeListToEdit] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImagesUrl = async () => {
    const result = await axios.get('http://localhost:8080/api/products');
    setProducts(result.data);
  };

  const getAttributesList = async (index: number) => {
    const productId = products[index].product_id;
    const result = await axios.get(
      `http://localhost:8080/api/attributes/${productId}`
    );
    setCheckedState(new Array(result.data.length).fill(true));
    setAttributeList(result.data);
  };

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    const inputFalse = updatedCheckedState.reduce(
      (list, currentState, index) => {
        if (!currentState) list.push(attributeList[index]);
        return list;
      },
      []
    );
    setattributeListToEdit(inputFalse);
  };

  const handleValidateButton = async () => {
    const productId = products[currentIndex].product_id;
    const result = await axios.patch(
      `http://localhost:8080/api/products/${productId}`
    );
    alert(result.data.message);
    getImagesUrl();
    setCurrentIndex(currentIndex + 1);
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

        const requestValueid = await axios.get(`
          http://localhost:8080/api/values/name/${attribute_id}/${value_name}
          `);

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
      } catch (error) {
        throw new Error(String(error));
      }
    });
    setCurrentIndex(currentIndex + 1);
    alert(
      `le produit ${products[currentIndex].product_style} - ${products[currentIndex].product_name} est envoyé pour correction`
    );
  };

  useEffect(() => {
    getImagesUrl();
  }, []);

  useEffect(() => {
    if (products.length > 0) getAttributesList(currentIndex);
  }, [products, currentIndex]);

  return (
    <>
      <p>{products.length} product(s) to validate</p>
      <div className="grid-container">
        <ProductDetails product={products[currentIndex]} />
        <AttributeList
          attributes={attributeList}
          checkedState={checkedState}
          handleOnChange={handleOnChange}
        />
        <ProductNavigation
          prevProduct={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          nextProduct={() =>
            setCurrentIndex((prev) => Math.min(products.length - 1, prev + 1))
          }
          currentIndex={currentIndex}
          totalProducts={products.length}
        />
        <ActionButtons
          onValidate={handleValidateButton}
          onFail={handleFailButton}
        />
      </div>
    </>
  );
}

export default App;
