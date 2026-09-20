import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import "./CategoryCard.css";

function CategoryCard({ category }) {
  return (
    <Link
      to={"/auctions?category=" + encodeURIComponent(category)}
      className="rounded-2xl border bg-cream p-5"
    >
      <Tag size={20} />
      <b className="mt-3 block">{category}</b>
      <p className="mt-8 text-xs text-muted">Explore auctions →</p>
    </Link>
  );
}
export default CategoryCard;
