import * as React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const defaultPrompt = "Hi, what's your name?";
const apiHost = "http://3.133.115.92:3000"


class IndexPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }

    this.onChangeName = this.onChangeName.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
  }

  onChangeName(e) {
    this.setState({ name: e.target.value });
  }

  onSubmitName(e) {
    this.getUser();
  }

  async getUser() {
    let { name } = this.state;
    try {
        const result = await (await fetch(`${apiHost}/user?name=${name}&apiKey=hackdfw2021`)).json();
        if (result)
          navigate("/takepicture/", { state: result });
          
    } catch(error) {
        console.log(error);
    }
}

  render() {
    let { name } = this.state;

    return (
      <Layout>
        <Seo title="Home" />
        <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1>Hi, what's your name?</h1>
            <TextField
                margin="normal"
                fullWidth
                id="name"
                label=""
                name="name"
                autoFocus
                variant="filled"
                value={name}
                onChange={this.onChangeName}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.onSubmitName}
            >
              Continue
            </Button>
        </Box>
      </Layout>
    );
  }
}

export default IndexPage
