"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import addData from "@/firebase/firestore/addData"; // Adjust the import path as necessary
import getData from "@/firebase/firestore/getData"; // Adjust the import path as necessary

function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [data, setData] = useState({ field1: "", field2: "" }); // Example data structure
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null); // State to store retrieved data

  React.useEffect(() => {
    if (user == null) router.push("/");
  }, [user]);

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await addData(
      "collectionName",
      "documentId",
      data
    ); // Replace with actual collection name and document ID

    if (error) {
      setError(error.message);
      setSuccess(null);
    } else {
      setSuccess("Data added successfully!");
      setError(null);
    }
  };

  const handleGetData = async () => {
    const { result, error } = await getData("collectionName", "documentId"); // Replace with actual collection name and document ID

    if (error) {
      setError(error.message);
      setRetrievedData(null);
    } else {
      setRetrievedData(result.data());
      setError(null);
    }
  };

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Only logged in users can view this page</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="field1">
            <p>Field 1</p>
            <input
              onChange={handleChange}
              required
              type="text"
              name="field1"
              id="field1"
              placeholder="Field 1"
            />
          </label>
          <label htmlFor="field2">
            <p>Field 2</p>
            <input
              onChange={handleChange}
              required
              type="text"
              name="field2"
              id="field2"
              placeholder="Field 2"
            />
          </label>
          <button type="submit">Add Data</button>
        </form>
        <button onClick={handleGetData}>Get Data</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {retrievedData && (
          <div>
            <h3>Retrieved Data:</h3>
            <pre>{JSON.stringify(retrievedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
