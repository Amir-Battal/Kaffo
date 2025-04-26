import React, { useRef, useState } from 'react';

type FileUploaderProps = {
  onFilesChange: (files: File[]) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const fileArray = Array.from(selectedFiles);
    const updatedFiles = [...files, ...fileArray];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); 
    console.log(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (name: string, size: number) => {
    const updated = files.filter(file => !(file.name === name && file.size === size));
    setFiles(updated);
    onFilesChange(updated);
  };
  


  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #aaa',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <p>
        اسحب الملفات هنا أو 
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => inputRef.current?.click()}
        >
          اخترها من الجهاز
        </span>
      </p>

      <input
        type="file"
        ref={inputRef}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '15px' }}>
        {files.map(file => (
          <div key={file.name} style={{ position: 'relative', margin: '10px' }}>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
            <button
              onClick={() => handleRemove(file.name, file.size)}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20,
                cursor: 'pointer',
              }}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
