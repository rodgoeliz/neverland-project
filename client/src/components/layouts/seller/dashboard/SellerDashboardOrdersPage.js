import React from 'react';
import { connect } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import { TextField } from '@material-ui/core';

import { ToggleVisibility, SoldAndQuantity, OrderDescription, LabelContainer, Image, NavigationArrow, RowContainer, Price, Status } from 'components/UI/Row'
import SellerDashboardNavWrapper from 'components/layouts/seller/dashboard/SellerDashboardNavWrapper';
import NButton from 'components/UI/NButton';


class SellerDashboardOrdersPage extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <SellerDashboardNavWrapper>
                <TextField variant="outlined" label="Search" />
                <NButton title="Search" />
                <RowContainer>
                    <LabelContainer labelText="11/20/2020 - Today">
                        <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                        <OrderDescription
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

                Product rows:
                <RowContainer>
                    <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                    <OrderDescription
                        order='100333'
                        title='Hayley Leibson'
                        content={['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']}
                    />
                    <Price>
                        100$
                        </Price>
                    <SoldAndQuantity sold={99} quantity={50} />
                    <ToggleVisibility text='IS VISIBLE' />
                    <NavigationArrow to='/home' />
                </RowContainer>


                <Pagination count={10} size="large" />
            </SellerDashboardNavWrapper>
        );
    }
}

const mapStateToProps = state => ({
    store: state.store
});

export default connect(mapStateToProps)(SellerDashboardOrdersPage);
