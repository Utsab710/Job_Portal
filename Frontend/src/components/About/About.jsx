import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function About() {
  return (
    <>
      <Header />
      <div className="py-16 bg-white">
        <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div className="md:5/12 lg:w-5/12">
              <img
                src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
                alt="image"
              />
            </div>
            <div className="md:7/12 lg:w-6/12">
              <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
                JobPortal is an online job portal system
              </h2>
              <p className="mt-6 text-gray-600">
                Our system is an online job system where job seekers can look
                for there recommended jobs and they can apply for the job in the
                system that are avaliable the jobs when the employeers post the
                job vacancies.
              </p>
              <p className="mt-4 text-gray-600">
                In our system we have also a employeers who post the jobs of the
                organization so that the job seeker knew that the job are
                available and also the employeers can get the employee for their
                organization.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
