/************************************************************
 *  @ADD_PRODUCT
 *  @route http://localhost:5000/api/product
 *  @description controller used for creating a new product
 *  @description only admin can create a coupon
 *  @description uses AWS S3 Bucket for Image Upload
 *  @parameters name, email ,password
 *  @returns  Produce object
 ***********************************************************/

import { config } from "dotenv";
import { Mongoose } from "mongoose";
import { asyncHandler } from "../services/asyncHandler";
import CustomError from "../utils/customError";

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(
          err.message || " Something went wrong in add products",
          500
        );
      }

      let productId = new Mongoose.Types.ObjectId().toHexString();

      if (
        !(
          fields.name ||
          fields.price ||
          fields.description ||
          fields.collectionId
        )
      ) {
        throw new CustomError("Please fill all details", 500);
      }

      let imgArrayResp = Promise.all(
        Object.keys(files).map(async (fileKey, index) => {
          const element = files[fileKey];

          const data = fs.readFileSync(element.filepath);

          const upload = await s3FileUpload({
            bucketName: config.S3_BUCKET_NAME,
            key: `products/${productId}/photo_${index + 1}.png`,
            body: data,
            contentType: element.mimeType,
          });
          return {
            secure_url: upload.Location,
          };
        })
      );



      // This code appears to be performing the following tasks:
/*
It creates a new Promise called imgArrayResp using the Promise.all() method.
It uses the Object.keys() method to get an array of keys from the files object.
It uses the map() method to iterate over the array of keys and perform an async function on each key.
Inside the async function, it reads the file data from a file located at element.filepath using fs.readFileSync().
It then calls the s3FileUpload() function, passing in several arguments including the file data, the bucket name, and the desired file key.
It returns an object containing the secure URL of the uploaded file.
This code seems to be uploading multiple files to an Amazon S3 bucket, where each file is associated with a product identified by the productId variable. The Promise.all() method is used to wait for all of the file uploads to complete before returning the array of secure URLs.  */



      const imgArray = await imgArrayResp;

      const product = await Product.create({
        _id: productId,
        photos: imgArray,
        ...fields,
      });

      if (!product) {
        throw new CustomError("Product was not created", 400);
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      console.log(err.message);

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  });
});




export const getProduct