import React, { useEffect, useState } from "react";

import Map from "./components/Map";
import Info from "./components/Info";
import Summary from "./components/Summary";
import wiki from "wikijs";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("iran");
  const [summary, setSummary] = useState("");
  const [info, setInfo] = useState(null);
  const [flag, setFlag] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const page = await wiki().page(selectedCountry);

      const [summary, info, images] = await Promise.all([
        page.summary(),
        page.info(),
        page.images(),
      ]);

      let flag = info.imageFlag.replace(/\s/g, "_");
      flag = flag.replace(/(\_\(.*?\))/g, "");

      setSummary(summary);
      setInfo(info);

      images.some((image) => {
        if (image.includes(flag)) {
          setFlag(image);
          return true;
        }
        return false;
      });
    }
    fetchData();
  }, [selectedCountry]);

  function handleSelectCountry(name) {
    setSelectedCountry(name);
    console.log(name);
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col col-md-9">
          <Map handleSelectCountry={handleSelectCountry} />
        </div>
        <div className="col-12 col-md-3">
          <Info info={info} flag={flag} />
        </div>
      </div>
      <div className="row mt-3">
        <Summary summary={summary} />
      </div>
    </div>
  );
}
