import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="bg-[#020617] text-white overflow-hidden">



            <section className="relative min-h-screen flex items-center justify-center px-6">



                <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] top-20 left-20 animate-pulse"></div>

                <div className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] bottom-10 right-10 animate-pulse"></div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">



                    <div>

                        <p className="uppercase tracking-[0.35em] text-blue-400 mb-5 font-semibold">
                            Welcome To ShopFix
                        </p>

                        <h1 className="text-5xl md:text-7xl font-black leading-tight">

                            Modern

                            <br />

                            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text">
                                Shopping
                            </span>

                            <br />

                            Experience
                        </h1>

                        <p className="text-gray-400 text-lg mt-8 leading-8 max-w-xl">

                            ShopFix is a modern e-commerce platform designed to
                            deliver a fast, secure and intelligent shopping
                            experience. Discover products effortlessly using
                            AI-powered search, organized categories and a clean,
                            responsive interface built for today's shoppers.

                        </p>

                        <div className="flex gap-5 mt-10">

                            <Link
                                to="/products"
                                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition duration-300 font-semibold shadow-lg shadow-blue-900/40"
                            >
                                Explore Products
                            </Link>

                            <Link
                                to="/"
                                className="px-8 py-4 rounded-xl border border-blue-800 hover:border-blue-500 transition duration-300"
                            >
                                Home
                            </Link>

                        </div>

                    </div>



                    <div className="relative flex justify-center">

                        <div className="absolute w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[90px]"></div>

                        <div className="relative w-[360px] h-[360px] rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.35)]">

                            <span className="text-[140px]">
                                🛒
                            </span>

                        </div>

                    </div>

                </div>

            </section>





            <section className="max-w-7xl mx-auto px-6 py-28">

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div>

                        <p className="uppercase tracking-[0.3em] text-blue-400 mb-5">
                            About ShopFix
                        </p>

                        <h2 className="text-5xl font-bold mb-8">

                            Built For A Better
                            <span className="text-blue-400"> Shopping Experience.</span>

                        </h2>

                        <p className="text-gray-400 leading-8 mb-6">

                            ShopFix combines modern technologies with a clean
                            shopping experience to help customers discover,
                            compare and purchase products effortlessly.

                        </p>

                        <p className="text-gray-400 leading-8 mb-6">

                            Every section of the platform has been carefully
                            designed to prioritize speed, security and ease of
                            use. From AI-powered product discovery to secure
                            authentication and organized product categories,
                            ShopFix delivers a premium shopping journey.

                        </p>

                        <p className="text-gray-400 leading-8">

                            Whether you're browsing electronics, fashion,
                            sports, books or home essentials, ShopFix provides
                            an intuitive interface backed by a powerful backend
                            architecture.

                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <div className="bg-[#081223] border border-blue-900 rounded-3xl p-8 hover:-translate-y-2 duration-300">

                            <div className="text-5xl mb-5">
                                ⚡
                            </div>

                            <h3 className="text-2xl font-semibold mb-4">
                                Fast
                            </h3>

                            <p className="text-gray-400 leading-7">

                                Optimized APIs and efficient architecture
                                provide a seamless shopping experience.

                            </p>

                        </div>

                        <div className="bg-[#081223] border border-blue-900 rounded-3xl p-8 hover:-translate-y-2 duration-300">

                            <div className="text-5xl mb-5">
                                🔒
                            </div>

                            <h3 className="text-2xl font-semibold mb-4">
                                Secure
                            </h3>

                            <p className="text-gray-400 leading-7">

                                Built with JWT authentication, refresh tokens
                                and secure HTTP-only cookies.

                            </p>

                        </div>

                        <div className="bg-[#081223] border border-blue-900 rounded-3xl p-8 hover:-translate-y-2 duration-300">

                            <div className="text-5xl mb-5">
                                🤖
                            </div>

                            <h3 className="text-2xl font-semibold mb-4">
                                AI Search
                            </h3>

                            <p className="text-gray-400 leading-7">

                                Discover products naturally using intelligent
                                semantic search powered by AI.

                            </p>

                        </div>

                        <div className="bg-[#081223] border border-blue-900 rounded-3xl p-8 hover:-translate-y-2 duration-300">

                            <div className="text-5xl mb-5">
                                📦
                            </div>

                            <h3 className="text-2xl font-semibold mb-4">
                                Organized
                            </h3>

                            <p className="text-gray-400 leading-7">

                                Browse products across carefully structured
                                categories with rich product variants.

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <section className="py-28 px-6 bg-[#040b18]">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-20">

                        <p className="uppercase tracking-[0.3em] text-blue-400 mb-4">
                            Why ShopFix
                        </p>

                        <h2 className="text-5xl font-bold">

                            Everything You Need

                            <span className="text-blue-400">
                    {" "}In One Place
                </span>

                        </h2>

                        <p className="text-gray-400 mt-6 max-w-3xl mx-auto leading-8">

                            ShopFix combines modern technologies with a carefully designed
                            shopping experience to help customers browse products faster,
                            discover better recommendations and shop with confidence.

                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

                        <div className="group bg-[#081223] border border-blue-950 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]">

                            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-4xl mb-8 group-hover:rotate-12 transition duration-500">
                                🛍️
                            </div>

                            <h3 className="text-2xl font-bold mb-5">
                                Premium Shopping
                            </h3>

                            <p className="text-gray-400 leading-8">

                                Explore products from multiple categories with a clean,
                                responsive interface built for effortless shopping.

                            </p>

                        </div>

                        <div className="group bg-[#081223] border border-blue-950 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]">

                            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-4xl mb-8 group-hover:rotate-12 transition duration-500">
                                🤖
                            </div>

                            <h3 className="text-2xl font-bold mb-5">
                                AI Discovery
                            </h3>

                            <p className="text-gray-400 leading-8">

                                Search products naturally with semantic AI search that
                                understands intent instead of only exact keywords.

                            </p>

                        </div>

                        <div className="group bg-[#081223] border border-blue-950 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]">

                            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-4xl mb-8 group-hover:rotate-12 transition duration-500">
                                🔐
                            </div>

                            <h3 className="text-2xl font-bold mb-5">
                                Secure Platform
                            </h3>

                            <p className="text-gray-400 leading-8">

                                Built with secure authentication, refresh tokens and modern
                                backend practices to protect every account.

                            </p>

                        </div>

                        <div className="group bg-[#081223] border border-blue-950 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)]">

                            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-4xl mb-8 group-hover:rotate-12 transition duration-500">
                                ⚡
                            </div>

                            <h3 className="text-2xl font-bold mb-5">
                                High Performance
                            </h3>

                            <p className="text-gray-400 leading-8">

                                Optimized backend architecture and responsive frontend
                                ensure a fast and smooth shopping experience.

                            </p>

                        </div>

                    </div>

                </div>

            </section>





            <section className="py-28 px-6">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-20">

                        <p className="uppercase tracking-[0.3em] text-blue-400 mb-4">
                            Technologies
                        </p>

                        <h2 className="text-5xl font-bold">

                            Built With Modern

                            <span className="text-blue-400">
                    {" "}Technologies
                </span>

                        </h2>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

                        {[
                            "React",
                            "Redux Toolkit",
                            "Node.js",
                            "Express",
                            "MongoDB",
                            "Cloudinary",
                            "JWT",
                            "Gemini AI",
                            "Tailwind CSS",
                            "REST API"
                        ].map((tech) => (

                            <div
                                key={tech}
                                className="bg-[#081223] border border-blue-950 rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]"
                            >

                                <h3 className="font-semibold text-lg">
                                    {tech}
                                </h3>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            <section className="py-28 px-6 bg-[#040b18]">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-20">

                        <p className="uppercase tracking-[0.3em] text-blue-400 mb-4">
                            Our Mission
                        </p>

                        <h2 className="text-5xl font-bold">

                            Shopping Should Feel

                            <span className="text-blue-400">
                    {" "}Effortless
                </span>

                        </h2>

                    </div>

                    <div className="max-w-5xl mx-auto">

                        <div className="space-y-10">

                            <div className="flex gap-8 items-start">

                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                                    1
                                </div>

                                <div>

                                    <h3 className="text-2xl font-bold mb-3">
                                        Discover Products
                                    </h3>

                                    <p className="text-gray-400 leading-8">
                                        Browse carefully organized categories or use
                                        intelligent AI-powered search to quickly find
                                        products that match your needs.
                                    </p>

                                </div>

                            </div>

                            <div className="w-1 h-14 bg-blue-700 ml-7 rounded-full"></div>

                            <div className="flex gap-8 items-start">

                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                                    2
                                </div>

                                <div>

                                    <h3 className="text-2xl font-bold mb-3">
                                        Choose The Perfect Variant
                                    </h3>

                                    <p className="text-gray-400 leading-8">
                                        Explore available product variants, compare options
                                        and select the one that fits your preferences.
                                    </p>

                                </div>

                            </div>

                            <div className="w-1 h-14 bg-blue-700 ml-7 rounded-full"></div>

                            <div className="flex gap-8 items-start">

                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                                    3
                                </div>

                                <div>

                                    <h3 className="text-2xl font-bold mb-3">
                                        Secure Checkout
                                    </h3>

                                    <p className="text-gray-400 leading-8">
                                        Enjoy a secure authentication system, protected
                                        checkout flow and a seamless ordering experience.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>




            <section className="py-32 px-6">

                <div className="max-w-6xl mx-auto">

                    <div className="relative overflow-hidden rounded-[40px] border border-blue-900 bg-gradient-to-br from-[#081223] via-[#06111f] to-[#020617] p-16 text-center">

                        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-600/20 blur-[100px]"></div>

                        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px]"></div>

                        <div className="relative">

                            <h2 className="text-5xl font-black leading-tight">

                                Ready To Explore

                                <br />

                                ShopFix?

                            </h2>

                            <p className="text-gray-400 max-w-3xl mx-auto mt-8 text-lg leading-8">

                                Discover premium products across multiple categories,
                                experience AI-powered search and enjoy a smooth shopping
                                journey designed with modern technologies.

                            </p>

                            <div className="mt-12 flex justify-center gap-5">

                                <Link
                                    to="/products"
                                    className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition duration-300 font-semibold shadow-xl shadow-blue-900/30"
                                >
                                    Explore Products
                                </Link>

                                <Link
                                    to="/"
                                    className="px-10 py-4 rounded-xl border border-blue-800 hover:border-blue-500 transition duration-300"
                                >
                                    Back Home
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>




            <footer className="border-t border-blue-950 py-14">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <h2 className="text-3xl font-bold mb-4">

                        ShopFix

                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto leading-8">

                        ShopFix is built to provide a modern shopping experience through
                        intelligent search, secure authentication and a clean, responsive
                        interface designed for every user.

                    </p>

                    <div className="mt-10 flex justify-center gap-8 text-gray-400">

                        <Link
                            to="/"
                            className="hover:text-blue-400 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            className="hover:text-blue-400 transition"
                        >
                            Products
                        </Link>

                        <Link
                            to="/contact"
                            className="hover:text-blue-400 transition"
                        >
                            Contact
                        </Link>

                    </div>

                    <div className="mt-12 border-t border-blue-950 pt-8 text-gray-500">

                        © {new Date().getFullYear()} ShopFix.
                        All Rights Reserved.

                    </div>

                </div>

            </footer>

        </div>
    );
};

export default About;