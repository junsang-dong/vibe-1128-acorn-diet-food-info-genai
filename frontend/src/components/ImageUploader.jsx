import { useState, useRef } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = ({ onAnalysisStart, onAnalysisComplete, onError }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onError('지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 업로드 가능합니다.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    onAnalysisStart();

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onAnalysisComplete(response.data);
      } else {
        onError(response.data.error || '분석에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        onError(error.response.data.message || '서버 오류가 발생했습니다.');
      } else if (error.request) {
        onError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        onError('이미지 업로드 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <p>다른 이미지 선택</p>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📸</div>
            <h3>음식 사진을 업로드하세요</h3>
            <p>클릭하거나 드래그 앤 드롭으로 이미지를 업로드</p>
            <div className="upload-info">
              <span>지원 형식: JPG, PNG, WEBP</span>
              <span>최대 크기: 10MB</span>
            </div>
          </div>
        )}
      </div>

      <div className="upload-tips">
        <h4>📌 촬영 팁</h4>
        <ul>
          <li>음식이 잘 보이도록 위에서 촬영해주세요</li>
          <li>조명이 밝은 곳에서 촬영하면 더 정확합니다</li>
          <li>여러 음식이 있다면 각각 촬영하는 것을 추천합니다</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;

