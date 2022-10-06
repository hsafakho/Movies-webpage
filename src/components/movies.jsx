import React, { Component, useState } from 'react'
import { getMovies } from '../services/fakeMovieService'
import Like from './common/like'
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate'

class Movies extends Component {
  state = {
    movies: getMovies(),
    pageSize: 4,
    currentPage: 1,
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

  render() {
    const { length: count } = this.state.movies
    const { currentPage, pageSize, movies: allMovies } = this.state
    if (count === 0) {
      return <p>No more movies</p>
    }

    const movies = paginate(allMovies, currentPage, pageSize)

    return (
      <div>
        <p>Number of movies is {count}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.genre.name}</td>
                <td>{movie.numberInStock}</td>
                <td>{movie.dailyRentalRate}</td>
                <td>
                  <Like
                    liked={movie.liked}
                    onClick={() => this.heartButton(movie)}
                  />
                </td>
                <td>
                  <button
                    class="btn btn-danger"
                    onClick={() => this.deleteButton(movie)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemCounts="abc"
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    )
  }
}

export default Movies
