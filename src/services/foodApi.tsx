// interface Product {
//     id: string;
//     brands: string;
//     name: string;
//     nutriments: {
//         carbohydrates: number;
//         energy: number;
//         fat: number;
//         protein: number;
//     };
//     product_name: string;
//     stores: string;
// }

// interface apiResponse {
//     product: Product | undefined;
//     status: boolean;
// }

// async function lookupBarcode(barcode: string): Promise<Product | undefined> {
//     const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}`);
//     const data = await response.json() as apiResponse;
//     return data.product;
// }

// export { lookupBarcode };
