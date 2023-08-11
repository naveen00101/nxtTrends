// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: '',
    apiStatus: apiStatusConstants.inProgress,
    noOfItems: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    console.log(this.props)

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    console.log(data)
    console.log(response)
    if (response.ok === true) {
      const similarProducts = data.similar_products.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        style: eachItem.style,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
        availability: eachItem.availability,
      }))
      const formattedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: 'In Stock',
        similarProducts,
      }

      this.setState({
        productData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increaseNoOfItems = () => {
    this.setState(prevState => ({noOfItems: prevState.noOfItems + 1}))
  }

  decreaseNoOfItems = () => {
    const {noOfItems} = this.state

    if (noOfItems !== 1) {
      this.setState(prevState => ({noOfItems: prevState.noOfItems - 1}))
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-con">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  redirectToShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="image-failure"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <button
        className="continue-shopping"
        type="button"
        onClick={this.redirectToShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetails = () => {
    const {productData, noOfItems} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productData

    return (
      <div>
        <div className="product-main-container">
          <div className="product-img-container">
            <img src={imageUrl} alt="product" className="product-main-img" />
          </div>

          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">{`Rs ${price}/-`}</p>
            <div className="h-con">
              <div className="rating-box">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="text">{`${totalReviews} Reviews`}</p>
            </div>

            <p className="description text">{description}</p>
            <div className="h-con">
              <p className="check-text">Available:</p>
              <p className="text">{availability}</p>
            </div>

            <div className="h-con">
              <p className="check-text">Brand:</p>
              <p className="text">{brand}</p>
            </div>

            <hr className="line" />
            <div className="items-count-container">
              <button
                data-testid="minus"
                type="button"
                className="count-btn"
                onClick={this.decreaseNoOfItems}
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="num-text">{noOfItems}</p>
              <button
                data-testid="plus"
                type="button"
                className="count-btn"
                onClick={this.increaseNoOfItems}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="button" className="add-cart-btn">
              Add To Cart
            </button>
          </div>
        </div>
        <div className="similar-products-sec">
          <h1>Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(eachItem => (
              <SimilarProductItem item={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getRenderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.getRenderView()}
      </div>
    )
  }
}

export default ProductItemDetails
