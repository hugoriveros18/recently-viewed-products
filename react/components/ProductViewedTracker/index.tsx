import React, { useEffect } from 'react'
import { canUseDOM } from 'vtex.render-runtime';
import { useProduct } from 'vtex.product-context';

const ProductViewedTracker = () => {

  //PRODUCT ID
  const { product: { productId } } = useProduct();

  //DOM VALIDATION
  const dataLocalStorage = canUseDOM
    ? window.localStorage.getItem('ProductViewedTracker')
    : null

  //EFFECTS
  useEffect(() => {
    if (dataLocalStorage) {
      let productsIdInLocalStorage = JSON.parse(dataLocalStorage)

      if (!productsIdInLocalStorage.includes(`${productId}`)) {
        productsIdInLocalStorage.push(productId)
      }
      window.localStorage.setItem('ProductViewedTracker', JSON.stringify(productsIdInLocalStorage))
    } else {
      window.localStorage.setItem('ProductViewedTracker', JSON.stringify([productId]))
    }
  }, [dataLocalStorage, productId])

  //JSX
  return (
    <></>
  )
}

export default ProductViewedTracker;
