import { JSX } from 'react';
import styled from 'styled-components';

const NotificationCard = ({...props}): JSX.Element => {

  const StyledWrapper = styled.div`
  .error {
    position: absolute;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    width: 235px;
    padding: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    justify-between: space-between;
    gap: 30px;
    ${
      props.reject
        ? 'background: #cc1100;'
        :props.pending 
        ? 'background: #e3762d;'
        : "background: #008c2f;"
    }
    border-radius: 8px;
    box-shadow: 0px 0px 5px -3px #111;
    z-index: 10;
  }

  .error__icon {
    width: 20px;
    height: 20px;
    transform: translateY(-2px);
    margin-right: 8px;
  }

  .error__icon path {
    fill: #fff;
  }

  .error__title {
    font-weight: 500;
    font-size: 14px;
    color: #fff;
  }

  .error__close {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: auto;
  }

  .error__close path {
    fill: #fff;
  }`;

  return (
    <StyledWrapper>
      <div dir='rtl' className="error">
        <div className="error__icon">
          {props.pending
            ?(
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
            ): props.reject
            ?(
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
            )
          }
        </div>
        <div className="error__title">
          {props.pending
            ? "جاري المعالجة"
            : props.reject
            ? "تم رفض الشكوى"
            : "تم حل الشكوى"}
        </div>
        <div className="error__close"><svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 20 20" height={20}><path fill="#393a37" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" /></svg></div>
      </div>
    </StyledWrapper>
  );
}



export default NotificationCard;
