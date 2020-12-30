import React from 'react';

import { connect } from 'react-redux';

import { SoldAndQuantity, OrderDescription, ToggleVisibility, LabelContainer, Image, NavigationArrow, RowContainer, Price, Status } from 'components/UI/Row'

class SellerDashboardOrdersPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: true
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
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


                <RowContainer>
                    <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                    <OrderDescription
                        order='100333'
                        title='Hayley Leibson'
                        content={['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']}
                    />
                    <Price flexGrow="1">
                        100$
                    </Price>
                </RowContainer>


                <RowContainer>
                    <Image src='https://www.interfacemedia.com/media/2350/img-vr-tilt-brush-website-hero-shot.jpg' />
                    <ToggleVisibility
                        text="IS VISIBLE"
                        checked={this.state.checked}
                        toggleChecked={() => { this.setState({ checked: !this.state.checked }) }}
                    />
                    <SoldAndQuantity sold={44} quantity={99} />
                    <Price>
                        100$
                    </Price>
                </RowContainer>
            </>
        );
    }
}

const mapStateToProps = state => ({
    store: state.store
});

export default connect(mapStateToProps)(SellerDashboardOrdersPage);
