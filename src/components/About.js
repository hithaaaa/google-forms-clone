import React from "react";

export default function About() {
    return (
      <div className="flex justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Content Container */}
        <div className="max-w-2xl w-full">
          {/* Title */}
          <p className="text-5xl text-center font-bold py-8">
            About page
          </p>
  
          {/* Description */}
          <div className="text-xl py-8">
            <p className="mb-12 text-center">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <p className="mb-12 text-center">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).  
            </p>
            <p className = "text-center">
              If you have any questions or concerns about the system, please feel free to reach out to skurapat@purdue.edu.
            </p>
          </div>
        </div>
      </div>
    );
  }
  