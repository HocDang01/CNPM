import React, { useState } from 'react';
import '../css/Configure.css';

const Configure = () => {
  const [defaultPages, setDefaultPages] = useState(10);
  const [defaultDate, setDefaultDate] = useState('');
  const [fileTypes, setFileTypes] = useState(['pdf', 'docx']);
  const [newFileType, setNewFileType] = useState('');

  const handleSave = () => {
    console.log('Configuration Saved:');
    console.log('Default Pages:', defaultPages);
    console.log('Default Date:', defaultDate);
    console.log('Permitted File Types:', fileTypes);
    alert('Configuration saved successfully!');
  };

  const addFileType = () => {
    if (newFileType && !fileTypes.includes(newFileType)) {
      setFileTypes([...fileTypes, newFileType]);
      setNewFileType('');
    }
  };

  const removeFileType = (type) => {
    setFileTypes(fileTypes.filter((fileType) => fileType !== type));
  };

  return (
    <div className="configure-container">
      <div className="configure-content">
        <h2>Cấu hình hệ thống</h2>

        <div className="configure-item">
          <label>Số trang mặc định:</label>
          <input
            type="number"
            value={defaultPages}
            onChange={(e) => setDefaultPages(Number(e.target.value))}
            className="configure-input"
          />
        </div>

        <div className="configure-item">
          <label>Ngày mặc định phát giấy:</label>
          <input
            type="date"
            value={defaultDate}
            onChange={(e) => setDefaultDate(e.target.value)}
            className="configure-input"
          />
        </div>

        <div className="configure-item-file">
          <label>Loại file chấp nhận:</label>
          <div style={{ flex: 1 }}>
            <ul className="file-types-list">
              {fileTypes.map((type, index) => (
                <li key={index} className="file-type-item">
                  {type}
                  <button
                    onClick={() => removeFileType(type)}
                    className="remove-button"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Thêm loại file"
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              className="configure-input"
            />
            <button onClick={addFileType} className="add-button">
              Thêm
            </button>
          </div>
        </div>

        <button onClick={handleSave} className="save-button">
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
};

export default Configure;
