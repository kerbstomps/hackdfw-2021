import * as React from "react"

import Layout from "../components/layout"

const WordPage = (word, picture) => (
  <Layout>
    <Seo title="Your Word Is" />
    <p>your word is {word}</p>
  </Layout>
)

export default WordPage