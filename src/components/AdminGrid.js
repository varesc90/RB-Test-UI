import React, { useState, useEffect, useMemo } from 'react'
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import styled from 'styled-components'

const TextField = styled.input`
  height: 32px;
  width: 300px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField id="search" type="text" placeholder="Short-Code/Origin Url" aria-label="Search Input" value={filterText}
               onChange={onFilter}/>
  </>
)

const AdminGrid = (props) => {
  const [data, setData] = useState(undefined)
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('created_at')
  const [order, setOrder] = useState('desc')

  const handlePageChange = page => {
    fetchData(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchData(page, newPerPage)
    setPerPage(newPerPage)
  }
  const handleSort = (column, sortDirection) => {
    // simulate server sort

    // instead of setTimeout this is where you would handle your API call.
    fetchData(1, null, null, column.selector, sortDirection)
    setSortBy(column.selector)
    setOrder(sortDirection)
  }

  const fetchData = (page = null, newPerPage = null, searchTerm = null, newSortBy = null, newOrder = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + props.token
    }
    const encodedSearchTerm = encodeURIComponent(searchTerm !== null ? searchTerm : filterText)
    axios.get(`http://localhost/api/urls?page=${page}&perPage=${newPerPage !== null ? newPerPage : perPage}&searchTerm=${encodedSearchTerm}&sortBy=${newSortBy !== null ? newSortBy : sortBy}&order=${newOrder !== null ? newOrder : order}`, { headers }).then((res) => {
      setData(res.data.data.urls.data)
      setTotalRows(res.data.data.urls.total)
      if (newPerPage) {
        setPerPage(newPerPage)
      }
    })
  }

  useEffect(() => {
    if (!data) {
      fetchData(1)
    }
  })

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + props.token
  }

  const subHeaderComponentMemo = React.useMemo(() => {

    const onFilter = (e) => {
      setFilterText(e.target.value)
      fetchData(1, perPage, e.target.value)
    }
    return <FilterComponent onFilter={onFilter}
                            filterText={filterText}/>
  }, [filterText, resetPaginationToggle])

  const handleDelete = (value) => {

    axios.delete('http://localhost/api/urls/' + value, { headers }).then((res) => {
      fetchData()
    })
  }

  const columns = useMemo(() => [
    {
      name: 'Short Code',
      selector: 'code',

    },
    {
      name: 'Full Url',
      selector: 'origin',

    },
    {
      name: 'Expiry',
      selector: 'expiry',
      sortable: true,
    },
    {
      name: 'Number of hits',
      selector: 'hit',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: 'created_at',
    },
    {
      cell: (row) => <Button variant="contained" onClick={() => handleDelete(row.id)} color="danger">Delete</Button>,
      selector: 'id',
      button: true,
    }
  ])
  return (<Container>
    <DataTable
      title="URLS"
      data={data}
      columns={columns}
      subHeader
      pagination
      subHeaderComponent={subHeaderComponentMemo}
      paginationServer
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
      onSort={handleSort}
      sortServer
    />
  </Container>)

}

export default AdminGrid