import { useEffect, useState } from 'react';
import axios from 'axios';
import './ControlPage.scss';
import ProductNavigation from '../../components/ProductNavigation/ProductNavigation';
import ProductDetails from '../../components/ProductDetails/ProductDetails';
import AttributeList from '../../components/AttributeList/AttributeList';
import ActionButtons from '../../components/ActionButtons/ActionButtons';

function ControlPage() {
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
  const [brands, setBrands] = useState([{ brand_name: '' }]);
  const [seasons, setSeasons] = useState([{ season_name: '' }]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');

  const getImagesUrl = async (brand: string, season: string) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/products/${brand}/${season}`
    );
    setProducts(result.data);
  };

  const getBrands = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/brands`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setBrands(result.data);
  };

  const getSeasons = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/seasons`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setSeasons(result.data);
  };

  const handleFilterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    getImagesUrl(selectedBrand, selectedSeason);
  };

  const handleChangeSelectBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleChangeSelectSeason = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSeason(e.target.value);
  };

  const getAttributesList = async (index: number) => {
    const productId = products[index].product_id;
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attributes/${productId}`
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
      `${import.meta.env.VITE_API_URL}/api/products/${productId}`
    );
    alert(result.data.message);
    getImagesUrl(selectedBrand, selectedSeason);
    setCurrentIndex(currentIndex + 1);
  };

  const handleFailButton = async () => {
    const productId = products[currentIndex].product_id;
    attributeListToEdit.forEach(async (attribute) => {
      const { attribute_name, value_name } = attribute;

      try {
        const requestAttributeId = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/attributes/name/${attribute_name}`
        );

        const attribute_id = requestAttributeId.data.id;

        if (!attribute_id) {
          throw new Error(
            `l'attribut n'a pas été trouvé pour ${attribute_name}`
          );
        }

        const requestValueid = await axios.get(`
          ${
            import.meta.env.VITE_API_URL
          }/api/values/name/${attribute_id}/${value_name}
          `);

        const value_id = requestValueid.data.id;

        if (!value_id) {
          throw new Error(`la valeur n'a pas été trouvé pour ${value_name}`);
        }

        const result = await axios.patch(
          `${
            import.meta.env.VITE_API_URL
          }/api/attributes/status/${productId}/${attribute_id}/${value_id}`
        );

        if (!result) {
          throw new Error(
            `le produit ${productId} n'a pas été mis à jour pour les valeurs ${attribute_name} ${value_name}`
          );
        }
        getImagesUrl(selectedBrand, selectedSeason);
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
    getBrands();
    getSeasons();
  }, []);

  useEffect(() => {
    if (products.length > 0) getAttributesList(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, currentIndex]);

  return (
    <>
      <header>
        <div>
          <form onSubmit={handleFilterSubmit} className="filter-form">
            <select name="brand" onChange={handleChangeSelectBrand}>
              <option defaultValue="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.brand_name} value={brand.brand_name}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
            <select name="season" onChange={handleChangeSelectSeason}>
              <option defaultValue="">Select a season</option>
              {seasons.map((season) => (
                <option key={season.season_name} value={season.season_name}>
                  {season.season_name}
                </option>
              ))}
            </select>
            <button type="submit">Filter</button>
          </form>
        </div>
        <p>{products.length} product(s) to validate</p>
      </header>

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

export default ControlPage;
