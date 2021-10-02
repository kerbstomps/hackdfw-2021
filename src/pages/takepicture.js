import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage = () => (
    <Layout>
        <Seo title="Take a picture!" />
        <h1>Take a picture!</h1>
        <input type="file" accept="image/*"/>
    </Layout>
)

export default SecondPage
