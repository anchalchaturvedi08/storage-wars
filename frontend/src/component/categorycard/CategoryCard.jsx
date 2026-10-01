import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import "./CategoryCard.css";

/* Takes a real category document, so the link carries an ObjectId that
   /auctions can actually filter on. It used to take a plain string and
   build /auctions?category=Vehicles, which matched nothing. */

function CategoryCard({ category }) {
  const childCount = (category.children || []).length;

  return (
    <Link
      to={`/auctions?category=${category._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-cream transition hover:-translate-y-1 hover:shadow-soft"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="grid aspect-[4/3] w-full place-items-center bg-white">
          <Tag size={22} className="text-muted" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <b className="block capitalize">{category.name}</b>

        {childCount > 0 && (
          <p className="mt-1 text-xs text-muted">
            {childCount} subcategor{childCount === 1 ? "y" : "ies"}
          </p>
        )}

        <p className="mt-auto pt-6 text-xs font-bold text-gold">
          Explore auctions &rarr;
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;