import { asyncHandler } from "../services/asyncHandler";
import CustomError from "../utils/customError";

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.body;
});

/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const deactivateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.body;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError("no such coupon exists", 400);
  }

  res.status(200).json({
    message: " coupon deactivated",
    success: true,
    coupon,
  });
});

/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new CustomError(" error in finding the coupon", 400);
  }

  res.status(200).json({
    message: "Coupon deleted",
    success: true,
    coupon,
  });
});

/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getCoupons = asyncHandler(async (req, res) => {
  const { couponId } = req.body;

  const coupons = await Coupon.find({});

  if (!coupons) {
    throw new CustomError("Error in getting all coupons", 400);
  }

  res.status(200).json({
    success: true,
    message: "All Coupons are here!",
    coupons,
  });
});
