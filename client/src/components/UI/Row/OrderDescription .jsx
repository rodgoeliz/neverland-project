import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";

const OrderText = styled.p`
  margin: 0;
  color: rgba(68,64,63,0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleText = styled.p`
  width: 100%;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
`

const LinkText = styled.p`
  width: 100%;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(30,29,205);
`

const OrderDescriptionContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  overflow: hidden;
`

export default function OrderDescription({ order, title, content }) {
  return (
    <OrderDescriptionContainer>
      <OrderText>
        Order #: {order}
      </OrderText>
      <TitleText>
        {title}
      </TitleText>
      {
        content && content.map((item, index) => (
          <LinkText key={index}>
            {item}
          </LinkText>
        ))
      }
    </OrderDescriptionContainer>
  );
}
