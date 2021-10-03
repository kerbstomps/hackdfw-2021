import * as React from "react"

import Layout from "./layout"

const Login = (word) => (
  <Layout>
    <Seo title="Your Word Is" />
    <p>your word is {word}</p>
  </Layout>
)

export default WordPage