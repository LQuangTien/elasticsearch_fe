export const api =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/"
    : "http://localhost:3500/";
export const domain =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/admin"
    : "http://localhost:3500";

export const clientDomain =
  process.env.REACT_APP_MODE === "production"
    ? "https://ecommerce-client-teal.vercel.app/"
    : "http://localhost:3000/";
export const generatePictureUrl = (filename) => {
  return filename;
};
