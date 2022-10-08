import React, { Component } from 'react'
import { getMovies } from '../services/fakeMovieService'
import MovieTable from './moviesTable'
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate'
import ListGroup from './common/listGroup'
import { getGenres } from '../services/fakeGenreService'
import _, { filter } from 'lodash'

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: 'title', order: 'asc' },
  }

  componentDidMount() {
    const genres = [{ _id: '', name: 'All Genres' }, ...getGenres()]
    this.setState({ movies: getMovies(), genres: genres })
  }

  deleteButton = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id)
    this.setState({ movies })
  }

  heartButton = (movie) => {
    const movies = [...this.state.movies]
    const index = movies.indexOf(movie)
    movies[index] = { ...movies[index] }
    movies[index].liked = !movies[index].liked
    this.setState({ movies })
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page })
  }

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1 })
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn })
  }

  getPagedData = () => {
    const {
      currentPage,
      sortColumn,
      pageSize,
      selectedGenre,
      movies: allMovies,
    } = this.state
    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const movies = paginate(sorted, currentPage, pageSize)
    return { totalCount: filtered.length, data: movies }
  }

  render() {
    const { length: count } = this.state.movies
    const { currentPage, sortColumn, pageSize } = this.state
    if (count === 0) {
      return <p>There are no movies in the database</p>
    }

    const { totalCount, data: movies } = this.getPagedData()

    return (
      <div className="row m-4">
        <div className="col-2">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <p>Showing {totalCount} movies in the database</p>
          <MovieTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.heartButton}
            onDelete={this.deleteButton}
            onSort={this.handleSort}
          />
          <Pagination
            itemCounts={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    )
  }
}

export default Movies
