import './ProductDetails.css';

interface ProductDetailsProps {
  product: {
    product_name: string;
    product_style: string;
    product_description: string;
    image_url: string;
  } | null;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  if (!product) {
    // Si le produit n'est pas encore défini, on peut afficher un chargement ou rien
    return <div>Loading...</div>;
  }
  return (
    <div className="image-description">
      <div className="image">
        <img src={product.image_url} alt={product.product_style} />
      </div>
      <div className="title">
        <h2>{product.product_name}</h2>
        <h3>{product.product_style}</h3>
      </div>
      <div className="description">
        {product.product_description
          .replace(/([A-Z][a-zA-Z ]+):/g, ';$1:')
          .split(';')
          .map((line, index) => line && <p key={index}>{line}</p>)}
      </div>
    </div>
  );
};

export default ProductDetails;
