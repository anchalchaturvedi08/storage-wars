import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Gavel, Menu, X, Search, Heart, ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Send, ArrowUp, Users, Clock3, IndianRupee, Package, ShieldCheck, Plus, Check, Ban, Eye, Filter, Upload, BarChart3, Tag, LayoutDashboard, TrendingUp, LogOut, Boxes, Percent, FileText, Bell, ShoppingBag, Wallet, UserRound, Settings, Trash2, Edit3, CircleDollarSign, CalendarDays, ImagePlus, Save } from "lucide-react";
import { auctions, categories, demos, products } from "../../data";
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
import Layout from "../../component/layout/Layout";
import "./Categories.css";

function Categories(){return <Layout><main className="container-x py-12"><p className="text-xs font-black uppercase tracking-widest text-gold">Browse</p><h1 className="mt-2 text-4xl font-black">Categories</h1><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{categories.map(c=><Link to={"/auctions?category="+encodeURIComponent(c)} key={c} className="rounded-2xl bg-white p-7 shadow-soft"><Tag/><h3 className="mt-8 font-black">{c}</h3><p className="mt-2 text-xs text-muted">View auctions →</p></Link>)}</div></main></Layout>}

export default Categories;
