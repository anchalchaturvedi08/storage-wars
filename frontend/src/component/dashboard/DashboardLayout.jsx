import React from "react";
import { Link, useLocation } from "react-router-dom";
import { demoNav } from "../../navigation";
import Layout from "../layout/Layout";
import "./DashboardLayout.css";

function DashboardLayout({ role, title, children }) {
  const loc = useLocation();
  const links = demoNav[role];

  return (
    <Layout>
      <main className="container-x flex gap-6 py-10">

        <aside className="hidden w-60 shrink-0 rounded-2xl bg-ink p-4 text-white md:block">

          <p className="mb-5 px-3 text-xs font-bold tracking-widest text-gold">
            {role === "admin"
              ? "SUPER ADMIN"
              : role === "seller"
                ? "SELLER"
                : "CUSTOMER"}
          </p>

          {links.map(([x, to, I]) => (
            <Link
              to={to}
              className={
                "mb-1 flex gap-3 rounded-xl px-3 py-3 text-sm " +
                (loc.pathname === to
                  ? "bg-white text-ink font-bold"
                  : "text-white/75 hover:bg-white/10")
              }
              key={x}
            >
              <I size={17} />
              {x}
            </Link>
          ))}

        </aside>

        <div className="min-w-0 flex-1">

          <div className="mb-7 flex items-center justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gold">
                {role === "admin"
                  ? "Administration"
                  : role === "seller"
                    ? "Seller Workspace"
                    : "Customer Workspace"}
              </p>

              <h1 className="mt-2 text-4xl font-black">
                {title}
              </h1>
            </div>

          </div>

          {children}

        </div>

      </main>

    </Layout>
  );
}

export default DashboardLayout;