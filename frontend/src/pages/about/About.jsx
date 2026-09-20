import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../component/layout/Layout";
import "./About.css";

function About() {
  return (
    <Layout>
      <main className="container-x py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-gold">OUR STORY</p>
          <h1 className="mt-3 text-5xl font-black">About StorageWars</h1>
          <p className="mt-6 text-lg leading-8 text-muted">StorageWars is a modern auction marketplace inspired by the excitement of live auctions. Sellers list unique products while customers discover, compare and compete.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Discover", "Compete", "Win"].map((x, i) => (
              <div className="rounded-2xl bg-white p-6 shadow-soft" key={x}>
                <b className="text-gold">0{i + 1}</b>
                <h3 className="mt-5 font-black">{x}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default About;
