import React, { useRef, useState } from "react";

type FileUploaderProps = {
  onFilesChange: (files: File[]) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ القيود
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // 2MB
  const maxFiles = 5;

  const validateFiles = (selectedFiles: File[]) => {
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`❌ الملف ${file.name} غير مسموح. الرجاء رفع صور فقط (JPG, PNG, WEBP).`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`❌ حجم الصورة ${file.name} يتجاوز ${(maxSize / 1024 / 1024).toFixed(1)}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = validateFiles(Array.from(selectedFiles));

    setFiles((prev) => {
      let merged = [...prev];

      for (const newFile of fileArray) {
        const exists = merged.some((f) => f.name === newFile.name && f.size === newFile.size);
        if (!exists) {
          if (merged.length < maxFiles) {
            merged.push(newFile);
          } else {
            alert(`يمكنك رفع ${maxFiles} صور كحد أقصى.`);
            break;
          }
        }
      }

      onFilesChange(merged);
      return merged;
    });

    // reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (name: string, size: number) => {
    const updated = files.filter((file) => !(file.name === name && file.size === size));
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: "2px dashed #aaa",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <p>
        اسحب الملفات هنا أو{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
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
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
        {files.map((file) => (
          <div key={file.name + file.size} style={{ position: "relative", margin: "10px" }}>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
            />
            <button
              onClick={() => handleRemove(file.name, file.size)}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
