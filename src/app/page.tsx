"use client";
import * as React from "react";
import "@/lib/env";

import "../styles/page.css";

import IntroBlock from "@/components/IntroBlock";


const HomePage = () => {
  return (
    <>
      <IntroBlock
        title="Coming Soon..."
        image="/images/salmon.svg"
      />
    </>
  );
};

export default HomePage;
