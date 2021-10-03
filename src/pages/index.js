import * as React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const wordsToTranslate = ["Hi, what's your name?", "Hello", "Continue"];
const apiHost = "http://3.133.115.92:3000"


class IndexPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      translatedWords: {},
      submitted: false
    }

    this.onChangeName = this.onChangeName.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.translateWords = this.translateWords.bind(this);
  }

  componentDidMount() {
    this.translateWords(wordsToTranslate);
  }

  onChangeName(e) {
    this.setState({ name: e.target.value });
  }

  onSubmitName(e) {
    this.setState({ submitted: true }, () => {
      this.getUser();
    });
  }

  async getUser() {
    let { name } = this.state;
    try {
        const result = await (await fetch(`${apiHost}/user?name=${name}&apiKey=hackdfw2021`)).json();
        if (result) {
          setTimeout(() => navigate("/takepicture/", { state: result }), 500);
        }

    } catch(error) {
        console.log(error);
    }
}

async translateWords(words) {
  if (words) {
    const fields = words.join('&str=');
    const lang = navigator.languages.filter(lang => lang.length === 2)[0];
    
    try {
      const result = await (await fetch(`${apiHost}/translate?to=${lang}&str=${fields}&apiKey=hackdfw2021`)).json();
      if (result) {
        this.setState({
          translatedWords: result.translated
        });
      }
      
    } catch(error) {
        console.log(error);
    }
  }
}

  render() {
    let { name, translatedWords, submitted } = this.state;
    
    let prompt = translatedWords[0];
    let hello = translatedWords[1];
    let submit = translatedWords[2];

    return (prompt && hello && submit ?
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
            { !submitted ? 
              <h1>{prompt || ""}</h1>
              :
              <h1>{`${hello}, ${name}!`}</h1>
            }
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
              {submit}
            </Button>
        </Box>
      </Layout>
      :
      <Layout/>
      );
  }
}

export default IndexPage
