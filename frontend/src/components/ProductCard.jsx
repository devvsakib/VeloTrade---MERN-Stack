import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  return (
    <Card>
      <CardHeader>
        <img src={product.image} alt={product.name} className="h-48 w-full object-cover mb-2" />
        <h3 className="font-bold">{product.name}</h3>
        <p>{product.description}</p>
      </CardHeader>
      <CardFooter>
        <p>{product.price} BDT</p>
      </CardFooter>
      <Button
        onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
      >
        Add to Cart
      </Button>
      <Link to={`/product/${product._id}`}>
        <Button>View Details</Button>
      </Link>
    </Card>
  )
}
