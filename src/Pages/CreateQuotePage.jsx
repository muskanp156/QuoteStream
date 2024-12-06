import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuotePage() {
  const [quoteText, setQuoteText] = useState("");
  const [username, setUsername] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle image file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload image function
const uploadImage = async () => {
  if (!file) {
    setError("Please select an image file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://crafto.app/crafto/v1.0/media/assignment/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Image uploaded successfully:", data); // Debugging response

      // Check if the response contains an array and extract the mediaUrl
      if (data && Array.isArray(data) && data.length > 0 && data[0].url) {
        setMediaUrl(data[0].url); // Access the 'url' property of the first item in the array
        setError(""); // Clear any previous error message
        console.log("Uploaded Media URL:", data[0].url); // Debugging mediaUrl
      } else {
        // If the response structure is not as expected, log it
        console.error("Unexpected response structure:", data);
        setError("Failed to retrieve media URL.");
      }
    } else {
      throw new Error("Failed to upload image.");
    }
  } catch (error) {
    setError(error.message);
    console.error("Error uploading image:", error); // Debugging error
  }
};


  // Handle form submission for creating quote
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    console.log("Form submitted!"); // Debugging

    // Validate form inputs
    if (!quoteText || !username || !mediaUrl) {
      setError("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    // Get token from localStorage
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debugging token

    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    // Log mediaUrl before making the request
    console.log("Using mediaUrl: ", mediaUrl); // Debugging mediaUrl

    // Prepare request body
    const requestBody = {
      text: quoteText,
      mediaUrl: mediaUrl,
    };

    console.log("Request Body:", requestBody); // Debugging request body

    try {
      const response = await fetch(
        "https://assignment.stage.crafto.app/postQuote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        setLoading(false);
        const responseData = await response.json();
        console.log("Quote created successfully:", responseData); // Debugging response
        navigate("/quotes"); // Redirect after successful quote creation
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData); // Debugging API error response
        throw new Error(errorData.message || "Failed to create quote.");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error("Error creating quote:", error); // Debugging error
    }
  };

  return (
    <div className="p-4 px-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Create a New Quote</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="quoteText"
            className="block text-sm font-semibold mb-2"
          >
            Quote Text
          </label>
          <textarea
            id="quoteText"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-semibold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-semibold mb-2"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="imageUpload"
            className="w-full p-3 border border-gray-300 rounded-md"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button
          type="button"
          onClick={uploadImage}
          className="w-full py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 mb-4"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Quote"}
        </button>
      </form>
    </div>
  );
}

export default CreateQuotePage;
