import { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Gallery from './components/Gallery'
import SearchBar from './components/SearchBar'
import AlbumView from './components/AlbumView'
import ArtistView from './components/ArtistView'
import { DataContext } from './context/DataContext'
import { SearchContext } from './context/SearchContext'
import { Fragment } from 'react/cjs/react.production.min'

function App() {
    let [search, setSearch] = useState('')
    let [message, setMessage] = useState('Search for Music!')
    let [data, setData] = useState([])
    let searchInput = useRef('')

    const API_URL = 'https://itunes.apple.com/search?term='

    useEffect(() => {
        if(search) {
            const fetchData = async () => {
                document.title = `${search} Music`
                const response = await fetch(API_URL + search)
                const resData = await response.json()
                if (resData.results.length > 0) {
                    return setData(resData.results)
                } else {
                    return setMessage('Not Found')
                }
            }
            fetchData()
        }
    }, [search])
    
    const handleSearch = (e, term) => {
        e.preventDefault()
        setSearch(term)
    }

    return (
        <div>
          {message}
          <Router>
            <Routes>
              <Route path='/' element={
                <Fragment>
                  <SearchContext.Provider value={{term: searchInput, handleSearch: handleSearch}}>
                    <SearchBar />
                  </SearchContext.Provider>
                  <DataContext.Provider value={data}>
                    <Gallery />
                  </DataContext.Provider>
                </Fragment>
              }/>
              <Route path='/album/:id' element={<AlbumView/>}></Route>
              <Route path='/artist/:id' element={<ArtistView/>}></Route>
            </Routes>
          </Router>
        </div>
    );
}

export default App;