import { Input } from 'antd';
import React, { useState } from 'react';

const {Search} = Input;

interface SearchProps {
    onSearch: (search: string) => void;
}

const SearchInput: React.FunctionComponent<SearchProps> =
    ({
        onSearch
    }) => {
        const [searchTerm, setSearchTerm] = useState("");

        const handleSearch = (value: string) => {
            setSearchTerm(value);
            onSearch(value);
        }

        return (
            <Search
                placeholder="Search"
                allowClear
                enterButton
                onSearch={handleSearch}
                value={searchTerm}
            />
        );
    };

export default SearchInput;

