import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Roboto", sans-serif;
    }

    :focus {
        outline: 0;
        box-shadow: 0 0 0 2px ${(props) => props.theme["blue-500"]};
    }

  body {
    background-color: ${(props) => props.theme["gray-900"]};
    color: ${(props) => props.theme["gray-300"]};
    -webkit-font-smoothing: subpixel-antialiased;
  }

  button {
    cursor: pointer;
  }

  input {
    padding: 0.4rem;
    border: none;
    border-radius: 0.3rem;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  body, input, textarea, button {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }
`;
