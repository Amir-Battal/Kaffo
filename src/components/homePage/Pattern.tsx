import styled from 'styled-components';

const Pattern = () => {
  return <StyledWrapper />;
};

const StyledWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* للخلفية، حتى لا تغطي العناصر */

  background-color: #fff;
  background-image: radial-gradient(rgba(0, 0, 0, 0.04) 2px, transparent 0);
  background-size: 15px 15px;
  background-position: -5px -5px;
`;

export default Pattern;
