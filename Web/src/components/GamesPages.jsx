import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { GamesWrapper, Pagination } from './GamesComponents';

export default function GamesPages() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const gamesWrapperRef = useRef(null);
  const [amountOfPages, setAmountOfPages] = useState(0);

  useEffect(() => {
    setLoading(true);

    axios
      .get('http://localhost:7070/games', {
        params: {
          page: page,
        },
      })
      .then((res) => {
        setGames(res.data.list);
        setAmountOfPages(res.data.amountOfPages);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);


  useLayoutEffect(() => {
    if (gamesWrapperRef.current) {
      gamesWrapperRef.current.scrollTop = gamesWrapperRef.current.scrollHeight;
    }
  }, [games]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="games-container">
      <h1 className="feature-title">FEATURED & RECOMMENDED</h1>
      <GamesWrapper gamesWrapperRef={gamesWrapperRef} games={games} />
      <Pagination page={page} amountOfPages={amountOfPages} handlePageChange={handlePageChange} />
    </div>
  );
}