import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

function QuoteListPage() {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [quotesPerPage, setQuotesPerPage] = useState(12); // User-defined quotes per page (default 12)
  const navigate = useNavigate();

  const fetchQuotes = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://assignment.stage.crafto.app/getQuotes?limit=${quotesPerPage}&offset=${offset}`,
        {
          headers: { Authorization: token },
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch quotes:", response.statusText);
        setHasMore(false);
        return;
      }

      const data = await response.json();
      const quotesArray = Array.isArray(data) ? data : data.data || []; // Adjust based on API response

      if (quotesArray.length === 0) {
        setHasMore(false);
      } else {
        setQuotes((prev) => [...prev, ...quotesArray]);
        setOffset((prev) => prev + quotesPerPage);
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuotes([]);
    setOffset(0);
    setHasMore(true);
    fetchQuotes();
  }, [quotesPerPage]);

  return (
    <div className="p-4 px-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Quotes</h1>

      {/* Quotes Per Page Dropdown */}
      <div className="mb-4 flex justify-end items-center">
        <label className="mr-2 text-sm">Quotes Per Page:</label>
        <select
          value={quotesPerPage}
          onChange={(e) => setQuotesPerPage(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
        </select>
      </div>

      {/* Infinite Scroll Component */}
      <InfiniteScroll
        dataLength={quotes.length}
        next={fetchQuotes}
        hasMore={hasMore}
        loader={<p className="text-center text-gray-500">Loading...</p>}
        endMessage={
          <p className="text-center text-gray-500">No more quotes to load.</p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote, index) => (
            <div
              key={`${quote.id}-${index}`}
              className="bg-white rounded-lg shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <div className="h-60 overflow-hidden relative group">
                  {quote.mediaUrl ? (
                    <img
                      src={quote.mediaUrl}
                      alt={quote.text}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {quote.text}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-lg font-semibold mb-2">{quote.text}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>
                    Posted by:{" "}
                    <span className="font-semibold">{quote.username}</span>
                  </p>
                  <p>{new Date(quote.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <button
        onClick={() => navigate("/create-quote")}
        className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center justify-center text-base"
      >
        Create Quote
      </button>
    </div>
  );
}

export default QuoteListPage;
