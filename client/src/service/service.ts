export const getProducts = async () => {
  try {
    const res = await fetch("https://du-an-ca-nhan.onrender.com/products");
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
};
