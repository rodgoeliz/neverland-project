

module.exports.convertFrequencyToDate = (lastExecutedAt, freqTime, freqType) => {
  console.log("convertFrequencyToDate: ", lastExecutedAt, freqTime, freqType)
  if (!lastExecutedAt) {
    return new Date();
  }
  switch (freqType) {
    case 'seconds':
      return new Date(lastExecutedAt.getTime() + freqTime * 1000);
    case 'days':
      return new Date(lastExecutedAt.getTime() + freqTime * 24 * 60 * 60 * 1000);
    case 'minutes':
      return new Date(lastExecutedAt.getTime() + freqTime * 60 * 1000);
    case 'hours':
      return new Date(lastExecutedAt.getTime() + freqTime * 60 * 60 * 1000);
    case 'weeks': 
      return new Date(lastExecutedAt.getTime() + freqTime * 7 * 24 * 60 * 60 * 1000);
    case 'months':
      return new Date(lastExecutedAt.getTime() + freqTime * 4 * 24 * 60 * 60 * 1000);
    default:

  }
}