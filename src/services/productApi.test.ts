import { lookupBarcode } from "src/services/productApi";

test("returns barcode from openfoodfacts", async () => {
    const product = await lookupBarcode("0");
    expect(product).toBeUndefined();
});

