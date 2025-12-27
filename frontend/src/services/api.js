import axios from "axios";

export const products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1500, image: "https://via.placeholder.com/300" },
    { id: 2, name: "Riyadus Salihin", category: "Islamic Books", price: 400, image: "https://via.placeholder.com/300" },
    { id: 3, name: "Smart Watch Strap", category: "Accessories", price: 800, image: "https://via.placeholder.com/300" },
];

export const getProductById = (id) => products.find(p => p.id == id);


export const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const fetchProducts = () => api.get("/products");
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const fetchCategories = () => api.get("/products/categories");

