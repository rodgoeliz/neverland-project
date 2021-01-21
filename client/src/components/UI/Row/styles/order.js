import BrandStyles from 'components/BrandStyles';

export const getStatusColor = (status) => {
  switch (status)  {
    case 'need-to-fulfill':
      return BrandStyles.transparentColor.maroonStatus;
    case 'shipped':
      return BrandStyles.transparentColor.yellowStatus;
    case 'delivered':
      return BrandStyles.transparentColor.greenStatus;
    case 'paid-out':
      return BrandStyles.transparentColor.blueStatus;
    default:
      return BrandStyles.transparentColor.maroonStatus;
  }
}