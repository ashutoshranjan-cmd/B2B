import React from 'react'
import  "./footer.css";

const Footer = () => {
  return (
    <>
              
      <footer
        className="relative bg-cover bg-left text-slate-200 mt-10"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/90"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

                  <div className="lg:col-span-2">
            <img src="/logo/l_black.png" alt="logo" className="w-40 mb-6" />
            <p className="text-slate-400 leading-relaxed mb-6">
              We connect verified buyers with trusted sellers, enabling
              transparent pricing, bulk procurement, and scalable B2B commerce.
            </p>

            <div className='discoverButton'>
          Discover More
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"></path>
          </svg>          
        </div>
          </div>

                  <div>
            <h3 className="text-xl font-semibold mb-5 text-white">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Our Team", "Pricing", "Careers", "Blog"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-cyan-400 cursor-pointer transition"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        
                  <div>
            <h3 className="text-xl font-semibold mb-5 text-white">
              Seller Services
            </h3>
            <ul className="space-y-3">
              {[
                "Product Listings",
                "Bulk Orders",
                "Verified Leads",
                "Logistics Support",
                "Payment Protection",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-cyan-400 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
            
                      <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Newsletter
            </h3>
            <p className="text-slate-400 mb-6">
              Get B2B insights, seller updates & buyer deals.
            </p>

        
          <div className="subscribe-form">
            <input type="email" placeholder="Enter Your E-Mail*" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

                      <div className="relative border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <p>© 2025 B2B Bye & Sell . All rights reserved.</p>

            <div className="footer-bottom social-icons flex items-center gap-4">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"></path></svg>      
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>      
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>      
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"></path></svg>      

        </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer