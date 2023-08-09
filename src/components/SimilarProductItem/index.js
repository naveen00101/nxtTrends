// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {
    imageUrl,
    title,
    price,
    rating,
    brand,
    // description,
    // totalReviews,
    // availability,
  } = item
  return (
    <div className="similar-product">
      <div className="top-sec">
        <div className="image-box">
          <img
            src={imageUrl}
            alt={`similar product ${title}`}
            className="similar-image"
          />
        </div>
        <p className="similar-title">{title}</p>
        <p className="similar-brand">{`by ${brand}`}</p>
      </div>
      <div className="bottom-sec">
        <p className="similar-price">{price}</p>
        <div className="similar-rating-box">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
