import React, { useState } from "react";

export default function Documents() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div>
      <h2>📂 Document Management</h2>
      <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
      <button onClick={upload}>Upload</button>
    </div>
  );
}