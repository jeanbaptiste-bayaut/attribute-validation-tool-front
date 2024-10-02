import './Upload.scss';
import axios from 'axios';
import { useState } from 'react';
import { CSVLink } from 'react-csv';

function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Met à jour l'état du fichier
      console.log('Selected file:', selectedFile);
    }
  };

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    file: File | null
  ) => {
    e.preventDefault();

    if (!file) {
      alert('No file selected');
      return;
    }

    console.log('file', file);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post(
        `http://localhost:8080/upload/${endpoint}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('File uploading ...');

      if (response) {
        alert(`${endpoint} file uploaded successfully`);
      }
    } catch (error) {
      console.log('Error uploading the file:', error);
      alert(`Error uploading the ${endpoint} file`);
      if (error instanceof Error) {
        throw new Error(
          `Error uploading the ${endpoint} file: ${error.message}`
        );
      }
    }
  };

  return (
    <>
      <h1>Upload data</h1>
      <div className="upload-container">
        <form
          id="products"
          className="products"
          encType="multipart/form-data"
          onSubmit={(e) => handleUpload(e, 'products', file)}
        >
          <CSVLink
            data={[
              ['style', 'name', 'image_url', 'description'],
              [
                'ELBSF00180',
                'SBXE PREVENT PO Y',
                'https://s3.amazonaws.com/images.boardriders.com/bi/element/large/elbsf00180_ghe0.png',
                'description',
              ],
            ]}
            filename={`import-products-template.csv`}
            className="download"
            separator={';'}
          >
            Downlaod Products template
          </CSVLink>
          <label htmlFor="products" className="label-products">
            Upload products
          </label>
          <input
            type="file"
            className="file-products"
            id="products-csv"
            name="products-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-products">Upload</button>
        </form>
        <form
          id="descriptions"
          className="descriptions"
          onSubmit={(e) => handleUpload(e, 'descriptions', file)}
        >
          <label htmlFor="descriptions" className="label-descriptions">
            Upload descriptions
          </label>
          <input
            type="file"
            className="file-descriptions"
            id="descriptions-csv"
            name="descriptions-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-descriptions">Upload</button>
          <CSVLink
            data={[
              ['style', 'name', 'image_url', 'description'],
              [
                'ELBSF00180',
                'SBXE PREVENT PO Y',
                'https://s3.amazonaws.com/images.boardriders.com/bi/element/large/elbsf00180_ghe0.png',
                'description',
              ],
            ]}
            filename={`import-descriptions-template.csv`}
            className="download"
            separator={';'}
          >
            Downlaod Descriptions template
          </CSVLink>
        </form>
        <form
          id="attributes"
          className="attributes"
          onSubmit={(e) => handleUpload(e, 'attributes', file)}
        >
          <CSVLink
            data={[['name'], ['parent_type'], ['category'], ['fit']]}
            filename={`import-attributes-template.csv`}
            className="download"
            separator={';'}
          >
            Downlaod Attributes template
          </CSVLink>
          <label htmlFor="attributes" className="label-attributes">
            Upload attributes
          </label>
          <input
            type="file"
            className="file-attributes"
            id="attributes-csv"
            name="attributes-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-attributes">Upload</button>
        </form>
        <form
          id="values"
          className="values"
          onSubmit={(e) => handleUpload(e, 'attributes/values', file)}
        >
          <CSVLink
            data={[
              ['attribute', 'value1', 'value2', 'value3', 'value4'],
              ['category', 'accessories', 'clothing', 'snow'],
              ['parent_type', 'bag', 'backpack', 'beanie', 'belt'],
            ]}
            filename={`import-values-template.csv`}
            className="download"
            separator={';'}
          >
            Downlaod Values template
          </CSVLink>
          <label htmlFor="values" className="label-values">
            Upload values
          </label>
          <input
            type="file"
            className="file-values"
            id="values-csv"
            name="values-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-values">Upload</button>
        </form>
        <form
          id="products-attributes"
          className="products-attributes"
          onSubmit={(e) => handleUpload(e, 'products/attributes/values', file)}
        >
          <CSVLink
            data={[
              [
                'style',
                'division_1',
                'category_1',
                'gender_1',
                'parent_type_1',
                'subtype_1',
                'subtype_2',
                'fit_1',
              ],
              [
                'ELBSF00180',
                'element',
                'clothing',
                'men',
                't-shirt',
                'short_sleeve',
                'long_sleeve',
              ],
              [
                'ELBSF00181',
                'element',
                'clothing',
                'men',
                'short',
                'hybrid',
                'side_pocket',
                'regular',
              ],
            ]}
            filename={`import-assignment-template.csv`}
            className="download"
            separator={';'}
          >
            Assign attributes template
          </CSVLink>
          <label
            htmlFor="products-attributes"
            className="label-products-attributes"
          >
            Assign attributes to product
          </label>
          <input
            type="file"
            className="file-products-attributes"
            id="products-attributes-csv"
            name="products-attributes-csv"
            accept=".csv"
            required
            onChange={handleFileChange}
          />
          <button className="button-products-attributes">Upload</button>
        </form>
      </div>
    </>
  );
}

export default Upload;
