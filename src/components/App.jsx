import { useState, useEffect } from "react";
import "./App.css";
import { SearchBar } from "./SearchBar/SearchBar";
import { fetchImages } from "../Services/Api";
import { ImageGalleryList } from "./ImageGalleryList/ImageGalleryList";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";

const ITEMS_PER_PAGE = 12;

export const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentHitsOnPage, setCurrentHitsOnPage] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = (query) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMoreClick = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (!query) {
      return;
    }
    const makeImagesArray = (data) => {
      return data.map(({ id, largeImageURL, tags, webformatURL }) => {
        return { id, largeImageURL, tags, webformatURL };
      });
    };

    const getImagesData = async () => {
      try {
        setLoading(true);
        const { hits, totalHits } = await fetchImages(page, query);
        if (totalHits === 0) {
          alert("Nothing found with such query");
          setLoading(false);
          setCurrentHitsOnPage(null);
          return;
        }

        const images = makeImagesArray(hits);
        setImages((prevState) => {
          return [...prevState, ...images];
        });
        if (page > 1) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
        setCurrentHitsOnPage(hits.length);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getImagesData();
  }, [page, query]);

  return (
    <div className="App">
      <SearchBar onSubmit={handleFormSubmit} />

      {images.length > 0 && !error && (
        <>
          <ImageGalleryList images={images} />
          {currentHitsOnPage && currentHitsOnPage < ITEMS_PER_PAGE && (
            <p className="Message">End of search results</p>
          )}
        </>
      )}
      {currentHitsOnPage === ITEMS_PER_PAGE && !loading && (
        <Button onClick={handleLoadMoreClick} />
      )}
      {loading && <Loader />}
      {error && (
        <h2 className="Message">Something went wrong, please try again</h2>
      )}
    </div>
  );
};
