import Product from "../producModel/productSchema.js";
import { productSchema } from "../validator/schemaValidator.js";
async function addNewProduct(req, res, next) {
    try {
        const validatedData = productSchema.safeParse(req.body);
        if (!validatedData.success) {
            console.log("Validation errors:", validatedData.error.issues[0].message);
            return res.status(400).json({
                message: "Validation failed",
                errors: validatedData.error.issues[0].message
            });
        }
        const newProduct = new Product(validatedData.data);
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        next(error);
    }
}

export { addNewProduct };