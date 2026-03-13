import React, { useEffect, useState, useRef } from "react";
import { client, urlFor } from "../../sanity/SainityClient";
import { useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./insightDetail.css";

const query = `
*[_type=="insight" && slug.current==$slug][0]{
  title,
  featuredImage,
  content
}
`;

const InsightDetail = () => {

  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {

    client.fetch(query, { slug }).then((res) => {

      setData(res);

      /* Extract headings from portable text */

      const extractedHeadings = [];

      res?.content?.forEach((block) => {

        if (
          block._type === "block" &&
          block.style &&
          block.style.startsWith("h")
        ) {

          const text = block.children.map((c) => c.text).join("");

          extractedHeadings.push({
            text,
            id: text.replace(/\s+/g, "-").toLowerCase(),
          });

        }

      });

      setHeadings(extractedHeadings);

    });

  }, [slug]);

  /* Custom PortableText heading renderer */

  const components = {
    block: {

      h2: ({ children }) => {
        const text = children[0];
        const id = text.replace(/\s+/g, "-").toLowerCase();

        return <h2 id={id}>{children}</h2>;
      },

      h3: ({ children }) => {
        const text = children[0];
        const id = text.replace(/\s+/g, "-").toLowerCase();

        return <h3 id={id}>{children}</h3>;
      }

    }
  };

  const scrollToHeading = (id) => {

    const el = document.getElementById(id);

    if (el) {

      el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <section className="insight-detail section">
        <div className="top-detail">
            <div className="title-wrapper">
       <h1 className="details-title">{data.title}</h1>
            </div>
              

            {data.featuredImage && (
              <img
                src={urlFor(data.featuredImage).width(1200).url()}
                alt={data.title}
                className="featured-image"
              />
            )}
        </div>

        <div className="container insight-layout">

          {/* LEFT SIDEBAR */}

          <aside className="insight-sidebar">

            <h4>Contents</h4>

            <ul>

              {headings.map((heading, index) => (

                <li
                  key={index}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </li>

              ))}

            </ul>

          </aside>

          {/* MAIN CONTENT */}

          <article className="insight-content">

        

            <div ref={contentRef} className="rich-text">

              <PortableText
                value={data.content}
                components={components}
              />

            </div>

          </article>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default InsightDetail;