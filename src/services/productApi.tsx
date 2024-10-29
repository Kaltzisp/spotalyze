interface Product {
    id: string;
    brands: string;
    name?: string;
    product_name?: string;
    nutriments: {
        carbohydrates?: number;
        energy?: number;
        fat?: number;
        protein?: number;
    };
}

interface ApiResponse {
    product?: Product;
}

/**
 * Looks up a barcode on the openfoodfacts database and returns the corresponding product if found.
 * @param barcode the barcode to lookup.
 */
async function lookupBarcode(barcode: string): Promise<Product | null> {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}`);
    const data = (await response.json()) as ApiResponse;
    if (data.product) {
        return {
            id: data.product.id,
            brands: data.product.brands,
            name: data.product.product_name,
            nutriments: {
                carbohydrates: data.product.nutriments.carbohydrates,
                energy: data.product.nutriments.energy,
                fat: data.product.nutriments.fat,
                protein: data.product.nutriments.protein
            }
        };
    }
    return null;
}

export { lookupBarcode };


/**
 * Scan item on phone (barcode)
 * OR manually input barcode
 * Check barcode against database
 * THEN
 * If barcode exists return product
 * Else SUGGEST (non modal) to create new product
 * THEN query amount consumed
 * Then add to calories database
 */
