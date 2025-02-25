import React from 'react';
import p1 from "/news/post01.png";
import p2 from "/news/post02.png";
import p3 from "/news/post03.png";

function BlogSection() {
  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="flex flex-col mb-10 text-center">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-0">Get inspiration for your next trip</h2>
            <p className="text-gray-500 mt-1">Interdum et malesuada fames</p>
          </div>
        </div>
        <div className="flex flex-wrap mt-10">
          <div className="w-full lg:w-1/3 px-4 mb-8">
            <div className="blog-card flex flex-col">
              <div className="relative w-full rounded overflow-hidden">
                <figure className="mb-0 img-effect">
                  <img src={p1} className="w-full h-auto" alt="news articles" />
                </figure>
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold my-3">10 European ski destinations you should visit this winter</h2>
                <div className="my-3">
                  <a href="#" className="text-sm font-bold text-gray-500">
                    <i className="bi bi-calendar4-week mr-2 text-gray-800"></i>
                    April 06, 2022
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Repeat */}
          <div className="w-full lg:w-1/3 px-4 mb-8">
            <div className="blog-card flex flex-col">
              <div className="relative w-full rounded overflow-hidden">
                <figure className="mb-0 img-effect">
                  <img src={p2} className="w-full h-auto" alt="news articles" />
                </figure>
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold my-3">Where can I go? 5 amazing countries that are open right now</h2>
                <div className="my-3">
                  <a href="#" className="text-sm font-bold text-gray-500">
                    <i className="bi bi-calendar4-week mr-2 text-gray-800"></i>
                    April 16, 2022
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Repeat */}
          <div className="w-full lg:w-1/3 px-4 mb-8">
            <div className="blog-card flex flex-col">
              <div className="relative w-full rounded overflow-hidden">
                <figure className="mb-0 img-effect">
                  <img src={p3} className="w-full h-auto" alt="news articles" />
                </figure>
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold my-3">Booking travel during Corona: good advice in an uncertain time</h2>
                <div className="my-3">
                  <a href="#" className="text-sm font-bold text-gray-500">
                    <i className="bi bi-calendar4-week mr-2 text-gray-800"></i>
                    April 23, 2022
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Repeat */}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;