import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div>
      <h1> Muri Khaa, tui authorized na....</h1>
      <Link to="/">Home</Link>
    </div>
  );
}
