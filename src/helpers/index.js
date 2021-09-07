export const fetchData = async (points) => {
  try {
    const response = await fetch(`https://qrng.anu.edu.au/API/jsonI.php?length=${points}&type=uint8&size=1`)
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("error", error);
  }
};
