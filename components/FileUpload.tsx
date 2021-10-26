import React, { useState } from "react";
import { Upload } from "tus-js-client";
import axios from "axios";
interface Props {}

const FileUpload = (props: Props) => {
  const [progress, setProgress] = useState(0);

  const onFileChange = (e: any) => {
    var file = e.target.files[0];
    if(file == undefined)
      return;

      setProgress(0);
    const upload = new Upload(file, {
      endpoint: "http://10.10.1.112:6006/files",
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwic3ViIjoiNjE3MjFmYmNkYjBkYWE1Zjc4NWNhYzhlIiwiaWF0IjoxNjM1MjA2MjkxLCJleHAiOjE2MzUyNDk0OTF9.0slrkPZ9lQker4XX2udzsapoSN6dxyRbJzjS15ubARQ",
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
        setProgress(parseInt(percentage));
      },
      onSuccess: function () {
        console.log("Success upload %s from %s", file.name);
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  };

  const  onclick =()=>{
    const trainId = "6177b0a91fabda60e878e917";
    const res = axios.request({
      url : `http://10.10.1.112:6006/files/modelfiles/${trainId}`,
      method: 'GET',
      params :{
        accessToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwic3ViIjoiNjE3MjFmYmNkYjBkYWE1Zjc4NWNhYzhlIiwiaWF0IjoxNjM1MjA2MjkxLCJleHAiOjE2MzUyNDk0OTF9.0slrkPZ9lQker4XX2udzsapoSN6dxyRbJzjS15ubARQ"
      },
      responseType: 'blob'
    })
    .then((response) => {
        const ss = response.headers["file-name"];
        let blob = new Blob([response.data]);
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = ss;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
    });
  }
  return (
    <div className="text-center text-2xl p-6">
      <input type="file" name="file" accept=".zip" id="" onChange={onFileChange} />
      <progress max="100" value={progress}/>
      <button onClick={onclick}/>
    </div>
  );
};

export default FileUpload;