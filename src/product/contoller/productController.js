import Product from "../producModel/productSchema.js";
import { productSchema } from "../validator/schemaValidator.js";
import slugify from "slugify";

const addNewProduct = async (req, res) => {
  try {
    // 1. Ensure seller is authenticated
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can add products"
      });
    }

    // ✅ 2. Handle images
    const images = req.files?.map((file) => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      alt: file.originalname
    })) || [];

    // ✅ 3. Generate slug automatically
    const baseSlug = slugify(req.body.title, { lower: true, strict: true });

    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // ✅ 4. Prepare data
    const data = {
      ...req.body,
      slug,
      images,
      sellerId: req.user.id, // 🔥 secure seller ID from token
      tags: req.body.tags ? [].concat(req.body.tags) : [],
      status: req.body.status || "draft"
    };

    // ✅ 5. Validate using Zod
    const validation = productSchema.safeParse(data);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0].message
      });
    }

    // ✅ 6. Create product
    const product = await Product.create(validation.data);

    // ✅ 7. Response
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


// update controller

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ 1. Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // ✅ 2. Find product
    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ 3. Check ownership (only seller can update own product)
    if (
      req.user.role === "seller" &&
      product.sellerId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your products"
      });
    }

    // ✅ 4. Handle new images (optional)
    let images = product.images;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        alt: file.originalname
      }));

      // Replace or append (choose your strategy)
      images = newImages; // 👉 replace old images
    }

    // ✅ 5. Generate slug if title updated
    let slug = product.slug;

    if (req.body.title && req.body.title !== product.title) {
      const baseSlug = slugify(req.body.title, {
        lower: true,
        strict: true
      });

      slug = baseSlug;
      let counter = 1;

      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    // ✅ 6. Prepare updated data
    const updatedData = {
      ...product.toObject(),
      ...req.body,
      slug,
      images,
      tags: req.body.tags ? [].concat(req.body.tags) : product.tags
    };

    // ❌ remove unwanted fields
    delete updatedData._id;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    // ✅ 7. Validate
    const validation = productSchema.safeParse(updatedData);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0].message
      });
    }

    // ✅ 8. Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      validation.data,
      { new: true, runValidators: true }
    );

    // ✅ 9. Response
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export { addNewProduct, updateProduct };