import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";

function Categories() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await api.get("/categories?tree=true");

        // Hide anything an admin has switched off, at both levels.
        const active = (response.data.categories || [])
          .filter((root) => root.status !== "inactive")
          .map((root) => ({
            ...root,
            children: (root.children || []).filter(
              (child) => child.status !== "inactive"
            )
          }));

        setTree(active);
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return (
    <Layout>
      <main className="container-x py-12">

        <header className="max-w-2xl">
          <h1 className="text-4xl font-black">Browse Categories</h1>
          <p className="mt-2 text-muted">
            Explore what is up for auction, by category and subcategory.
          </p>
        </header>

        {loading ? (
          <p className="mt-10 text-muted">Loading categories...</p>
        ) : tree.length === 0 ? (
          <p className="mt-10 text-muted">No categories available yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tree.map((root) => (
              <article
                key={root._id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1"
              >
                {/* ---- image ---- */}
                <Link
                  to={`/auctions?category=${root._id}`}
                  className="block overflow-hidden"
                >
                  {root.image ? (
                    // object-cover is safe here because the backend normalises
                    // every upload to 4:3 at the Cloudinary layer, so there is
                    // nothing left for the crop to cut off.
                    <img
                      src={root.image}
                      alt={root.name}
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid aspect-[4/3] w-full place-items-center bg-cream text-sm text-muted">
                      No image available
                    </div>
                  )}
                </Link>

                {/* ---- body ---- */}
                <div className="flex flex-1 flex-col p-5">
                  <Link to={`/auctions?category=${root._id}`}>
                    <h2 className="text-xl font-black capitalize hover:text-gold">
                      {root.name}
                    </h2>
                  </Link>

                  {root.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                      {root.description}
                    </p>
                  )}

                  {/* ---- subcategories as chips ---- */}
                  {root.children && root.children.length > 0 ? (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">
                        {root.children.length} subcategor
                        {root.children.length === 1 ? "y" : "ies"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {root.children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/auctions?category=${child._id}`}
                            title={child.description || child.name}
                            className="rounded-full bg-cream px-3 py-1 text-xs font-bold capitalize transition hover:bg-ink hover:text-white"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs text-muted">
                        No subcategories yet
                      </p>
                    </div>
                  )}

                  {/* ---- footer pinned to the bottom ---- */}
                  <Link
                    to={`/auctions?category=${root._id}`}
                    className="mt-auto pt-4 text-sm font-bold text-gold"
                  >
                    Browse auctions &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Categories;