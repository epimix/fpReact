import React from 'react';
import { Button, Popconfirm, Space, Table, Input, message } from 'antd';
import { deletefilm } from '../services/film.servise';

const api = `https://www.omdbapi.com/?apikey=20f8bd72&s=`;

const FilmList = () => {
  const [films, setFilms] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchFilms = async (query) => {
    if (!query) return setFilms([]);
    setLoading(true);
    const res = await fetch(api + encodeURIComponent(query));
    const data = await res.json();
    const transformedData = (data.Search || []).map(item => ({
      key: item.imdbID,
      poster: item.Poster,
      title: item.Title,
      year: item.Year,
      type: item.Type,
    }));
    setFilms(transformedData);
    setLoading(false);
  };

  const handleSearch = (value) => {
    fetchFilms(value);
  };

  const onFilmDelete = (key) => {
    setFilms(films.filter(film => film.key !== key));
    message.success('Film deleted successfully!');
  };

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Popconfirm
            title="Delete the film"
            description={`Are you sure to delete ${record.title}?`}
            onConfirm={() => onFilmDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Film List</h2>
      <Input.Search
        placeholder="Введіть назву фільму"
        allowClear
        enterButton="Пошук"
        onSearch={handleSearch}
        style={{ width: 304, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={films} loading={loading} />
    </>
  );
};

export default FilmList;
