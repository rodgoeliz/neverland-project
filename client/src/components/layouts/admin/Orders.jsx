import React from 'react';
import { Desctiption, LabelContainer, Image, NavigationArrow, RowContainer, Price, Status } from '../../UI/Row'

function Orders() {
    return (
        <>
            <RowContainer>
                <LabelContainer labelText="11/20/2020 - Today">
                    <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                    <Desctiption
                        order='100333'
                        title='Hayley Leibson'
                        content={['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']}
                    />
                    <Price>
                        100$
						</Price>
                </LabelContainer>
                <Status>
                    NEEDS TO BE FULFILLED
					</Status>
                <NavigationArrow to='/home' />
            </RowContainer>
            <RowContainer>
                <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                <Desctiption
                    order='100333'
                    title='Hayley Leibson'
                    content={['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']}
                />
                <Price flexGrow="1">
                    100$
					</Price>
            </RowContainer>
        </>
    );
}


export default Orders;