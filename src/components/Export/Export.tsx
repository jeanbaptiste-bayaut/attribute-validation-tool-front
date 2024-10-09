import './Export.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}-${date}-${year}`;
}

function Export() {
  const [stylesWithAttributesToEdit, setStylesWithAttributesToEdit] = useState(
    []
  );
  const [stylesWithDescriptionsComment, setStylesWithDescriptionsComment] =
    useState([]);
  const getStylesWithAttributesToEdit = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/export/attributes`
    );
    setStylesWithAttributesToEdit(result.data);
  };
  const getStylesWithDescriptionsComment = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/export/descriptions`
    );
    setStylesWithDescriptionsComment(result.data);
  };

  const [currentDate] = useState(getDate());

  useEffect(() => {
    getStylesWithAttributesToEdit();
    getStylesWithDescriptionsComment();
  }, []);

  return (
    <div>
      <h1>Export</h1>
      <div className="export-container">
        <div className="export-attributes">
          <h2>Export list of attributes to edit</h2>
          <CSVLink
            data={stylesWithAttributesToEdit}
            filename={`at-attributes-export${currentDate}.csv`}
            separator={';'}
          >
            Download me
          </CSVLink>
        </div>
        <div className="export-descriptions">
          <h2>Export list of descriptions to comment</h2>
          <CSVLink
            data={stylesWithDescriptionsComment}
            filename={`at-descriptions-export${currentDate}.csv`}
            separator={';'}
          >
            Download me
          </CSVLink>
        </div>
      </div>
    </div>
  );
}

export default Export;
