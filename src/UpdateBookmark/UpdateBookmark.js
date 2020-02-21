import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class UpdateBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(`${config.API_ENDPOINT}/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(result => {
        console.log('RESULT', result.description)
        this.setState({
          id: result.id,
          title: result.title,
          url: result.url,
          description: result.description,
          rating: result.rating
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  };

  handleSubmit = e => {
    e.preventDefault()
    const bookmarkId = this.props.match.params.id;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating }
    this.setState({ error: null })
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return error => Promise.reject(error)
        }
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  onChangeTitle = (e) =>{
    this.setState({
      title:e.target.value
    })
  }

  onChangeDescription = (e) =>{
    this.setState({
      description:e.target.value
    })
  }

  onChangeUrl = (e) =>{
    this.setState({
      url:e.target.value
    })
  }

  onChangeRating = (e) =>{
    this.setState({
      rating: Number(e.target.value)
    })
  }

  resetFields = (nu) => {
    this.setState({
      id: nu.id ||'',
      title:nu.title || '',
      url: nu.url ||'',
      description: nu.description ||'',
      rating: nu.rating || ''
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error, title, url, description, rating } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Update a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              defaultValue={title}
              onChange={this.onChangeTitle}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              defaultValue={url}
              onChange={this.onChangeUrl}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={this.onChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              defaultValue={rating}
              onChange={this.onChangeRating}
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default UpdateBookmark;
