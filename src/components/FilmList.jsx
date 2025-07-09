import React, { useEffect } from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Poster',
    dataIndex: 'poster',
    key: 'poster',
    render: (text, record) => (
      <img src={text} alt={record.title} style={{ width: 50, height: 50 }} />
    ),
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: text => <span>{text}</span>,
  },
];

const api = `https://www.omdbapi.com/?apikey=20f8bd72&s=a`;

const FilmList = () => {
  const [films, setFilms] = React.useState([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  async function fetchFilms() {
    const res = await fetch(api);
    const data = await res.json();
    const transformedData = (data.Search || []).map(item => ({
      key: item.imdbID,
      poster: item.Poster,
      title: item.Title,
      year: item.Year,
      type: item.Type,
    }));
    setFilms(transformedData);
  }

  return (
    <>
      <h2>Film List</h2>
      <Table columns={columns} dataSource={films} />
    </>
  );
};

export default FilmList;
