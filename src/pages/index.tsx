import React, { useState, ChangeEvent, useEffect } from "react";
import { format, set } from "date-fns";

function formatt(value: string) {
  const today = new Date();
  return (
    format(today, "yyyy-MM-dd_HH-mm-ss_") + value.replace(/\s/g, "_") + ".xml"
  );
}

function App() {
  const [filename, setFilename] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  const [copiedFileName, setCopiedFileName] = useState<boolean>();
  const [copiedFileContent, setCopiedFileContent] = useState<boolean>();
  const [downloadedFile, setDownLoadedFile] = useState<boolean>();

  const handleCopyFilename = () => {
    navigator.clipboard.writeText(filename).then(() => {
      setCopiedFileName(true);
    });
  };

  const handleCopyFileContent = () => {
    navigator.clipboard.writeText(fileContent).then(() => {
      setCopiedFileContent(true);
    });
  };

  const handleCopyToXml = () => {
    const blob = new Blob([fileContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownLoadedFile(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilename = formatt(e.target.value);
    setFilename(newFilename);
    setCopiedFileName(false);
    setFileContent(`<databaseChangeLog logicalFilePath="${newFilename}"
                    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-2.0.xsd"> 

  <changeSet id="1" author="adminuser">
    <preConditions onFail="MARK_RAN">
      <sqlCheck expectedResult="0">
      </sqlCheck>
    </preConditions>
    <sql splitStatements="true">  
    </sql>
  </changeSet>
</databaseChangeLog>
    `);
    setCopiedFileContent(false);
    setDownLoadedFile(false);
  };

  return (
    <div className="bg-slate-400">
      <div className="flex flex-col mx-auto 2xl:w-4/5 h-screen  2xl:p-16 py-16 px-3 gap-6">
        <div className="flex justify-between">
          <input
            className="p-4 w-1/2 h-10 border-2 border-gray-300 rounded-md"
            type="text"
            placeholder="Enter what the patch does: e.g. add task to notify admin users"
            onChange={handleInputChange}
          />
          {fileContent && (
            <button
              className="bg-yellow-100 hover:bg-yellow-200 rounded-md px-2"
              onClick={handleCopyToXml}
            >
              {downloadedFile ? "Downloaded ✅" : "Download File"}
            </button>
          )}
        </div>

        {fileContent && (
          <>
            <div className="bg-slate-200 p-4 rounded-lg">
              <div className="flex justify-between mb-4">
                <p>Filename:</p>
                <button
                  className="bg-yellow-100 hover:bg-yellow-200 rounded-md px-2"
                  onClick={handleCopyFilename}
                >
                  {copiedFileName ? "Copied ✅" : "Copy File Name"}
                </button>
              </div>

              <pre className="bg-slate-300 p-4 rounded-lg">{filename}</pre>
            </div>
            {/* {copySuccess && <p className="text-green-500">{copySuccess}</p>} */}

            {/* <button onClick={handleCopyFilename}>Copy Filename</button> */}

            <div className="bg-slate-200 p-4 rounded-lg">
              <div className="flex justify-between mb-4">
                <p>File Content:</p>
                <button
                  className="bg-yellow-100 hover:bg-yellow-200 rounded-md px-2"
                  onClick={handleCopyFileContent}
                >
                  {copiedFileContent ? "Copied ✅" : "Copy File Content"}
                </button>
              </div>

              <pre className="bg-slate-300 p-4 rounded-lg">{fileContent}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
