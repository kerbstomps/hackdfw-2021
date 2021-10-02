import * as React from "react"
//import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import WorldMap from 'react-svg-worldmap';

const data = [
  // {country: 'cn', value: 1389618778}, // china
  // {country: 'in', value: 1311559204}, // india
  {country: 'us', value: 1}, // united states
  // {country: 'id', value: 264935824}, // indonesia
  // {country: 'pk', value: 210797836}, // pakistan
  // {country: 'br', value: 210301591}, // brazil
  // {country: 'ng', value: 208679114}, // nigeria
  // {country: 'bd', value: 161062905}, // bangladesh
  // {country: 'ru', value: 141944641}, // russia
  {country: 'mx', value: 1}, // mexico
];

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    {/* <h1>hello</h1> */}
    <WorldMap
        color="red"
        title="Top 10 Populous Countries"
        value-suffix="people"
        data={data}
      />
    {/* <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </p> */}
  </Layout>
)

export default IndexPage
