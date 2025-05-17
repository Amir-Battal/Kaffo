import { JSX } from 'react';
import styled from 'styled-components';

const FooterButton = ({...props}): JSX.Element => {
  return (
    <StyledWrapper>
      <button onClick={() => window.location.replace(`http://localhost:5173/${props.link}`)}>{props.title}</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    --color: oklch(55.2% 0.016 285.938);
    font-family: inherit;
    display: inline-block;
    width: 8em;
    height: 2.6em;
    line-height: 2.5em;
    margin: 20px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border: 2px solid var(--color);
    transition: color 0.5s;
    z-index: 1;
    font-size: 17px;
    border-radius: 6px;
    font-weight: 500;
    color: var(--color);
  }

  button:before {
    content: "";
    position: absolute;
    z-index: -1;
    background: var(--color);
    height: 150px;
    width: 200px;
    border-radius: 50%;
  }

  button:hover {
    color: #fff;
  }

  button:before {
    top: 100%;
    left: 100%;
    transition: all 0.7s;
  }

  button:hover:before {
    top: -30px;
    left: -30px;
  }

  button:active:before {
    background: oklch(44.2% 0.017 285.786);
    transition: background 0s;
  }`;

export default FooterButton;
