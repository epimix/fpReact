import React from 'react'
import { Input, Space } from 'antd';

const api = `https://www.omdbapi.com/?apikey=20f8bd72&s=`;

const { Search } = Input;


const onSearch = (value, _e, info) =>
    console.log(info === null || info === void 0 ? void 0 : info.source, value);

//remake function 



export default function Home() {
    
    return (
        <Search
      placeholder="input film name"
      allowClear
      onSearch={onSearch}
      style={{ width: 304 }}
    />

        
    )
}
