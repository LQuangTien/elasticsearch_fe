export const api =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/"
    : "http://http://52.0.166.104:3500/";
export const domain =
  process.env.REACT_APP_MODE === "production"
    ? "https://quangtien-ecommerce-be.herokuapp.com/admin"
    : "http://http://52.0.166.104:3500";

export const clientDomain =
  process.env.REACT_APP_MODE === "production"
    ? "https://ecommerce-client-teal.vercel.app/"
    : "http://http://52.0.166.104:3000/";
export const generatePictureUrl = (filename) => {
  return filename;
};
