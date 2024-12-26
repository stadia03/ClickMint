import React, { useRef } from "react";
import axios from "axios";
import { BACKEND_URL, CLOUDFRONT_URL } from "../utils";
import { useUserStore } from "../store";

interface UploadProps {
  onUploadComplete: (url: string) => void; // Callback for parent component
}

const Upload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file selection dialog
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      // Step 1: Request presigned URL from backend
      const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          address: useUserStore.getState().address,
          fileType: file.type,
        },
      });

      const presignedUrl = response.data.preSignedUrl;
      const formData = new FormData();
      formData.set("bucket", response.data.fields["bucket"]);
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"]);
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
      formData.set("key", response.data.fields["key"]);
      formData.set("Policy", response.data.fields["Policy"]);
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
      formData.append("file", file);

      // Step 2: Upload the file to the presigned URL
      await axios.post(presignedUrl, formData);

      // Step 3: Notify parent with the CloudFront URL
      onUploadComplete(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className="bg-purple-900 hover:bg-purple-950 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
      >
        Upload File
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Upload;
