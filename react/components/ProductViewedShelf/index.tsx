import React, { useEffect, useState } from 'react';
import { canUseDOM } from 'vtex.render-runtime';
import { useLazyQuery } from 'react-apollo';
import getListOfProducts from '../../grapql/getListOfProducts.graphql';
import { ProductViewedShelfSchema } from '../../schema/ProductViewedShelfSchema';
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';

type ProductViewedShelfProps = {
  ProductListContext: any
  productShelfTitle: string
  maxItems: number
}

const CSS_HANDLES = [
  'recently-viewed__global-container',
  'recently-viewed__title'
]

const ProductViewedShelf = ({
  ProductListContext,
  productShelfTitle = "Recently Viewed",
  maxItems = 10
}:ProductViewedShelfProps) => {

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //GRAPHQL QUERIES
  const [getProductsQuery , { data }] = useLazyQuery(getListOfProducts);

  //LOCAL STORAGE VALIDATION
  const dataLocalStorage = canUseDOM
    ? window.localStorage.getItem('ProductViewedTracker')
    : null

  //STATES
  const [productsToRender, setProductsToRender] = useState<any[]>([]);

  //EFFECTS
  useEffect(() => {
    if (dataLocalStorage) {
      let productIdInLocalStorage: any[] = JSON.parse(dataLocalStorage)
      const productsParameters = {
        variables: {
          productsId: productIdInLocalStorage
        }
      }
      getProductsQuery(productsParameters)
    }

  }, [dataLocalStorage])

  useEffect(() => {
    if(data) {
      setProductsToRender(organizeProducts(dataLocalStorage, data.productsByIdentifier));
    }
  },[data])

  //METHODS
  const organizeProducts = (localeStorageItems:any, productsData:any) => {
    const productsMap = new Map();
    productsData.forEach((product:any) => productsMap.set(product.productId, product))

    const mostRecentViewedProducts: any[] = JSON.parse(localeStorageItems).reverse();
    const productsOrganized: any[] = [];
    let count = 0;
    for (let productId of mostRecentViewedProducts.entries()) {
      if(count < maxItems) {
        const newProducto = productsMap.get(productId[1]);
        if(newProducto) {
          productsOrganized.push(newProducto);
          count++;
        }
      } else {
        break;
      }
    }
    return productsOrganized;
  }


  //JSX
  if (productsToRender.length > 2) {
    return (
      <div className={`${handles['recently-viewed__global-container']}`}>
        <h3 className={`${handles['recently-viewed__title']}`}>{productShelfTitle}</h3>
        <ProductListContext
          products={productsToRender}
        />
      </div>
    )
  }

  return null;
}

ProductViewedShelf.schema = ProductViewedShelfSchema;

export default ProductViewedShelf;
