const ProductViewedShelfSchema = {
  title: "Product Viewed Shelf",
  type: "object",
  properties: {
    productShelfTitle: {
      title: "Product Shelf Title",
      type: "string",
      default: "Recently Viewed"
    },
    maxItems: {
      title: "Max Items To Render",
      type: "number",
      default: 10
    }
  }
}

export { ProductViewedShelfSchema }
