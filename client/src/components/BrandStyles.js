const BrandStyles = {
  font: {
    contextualSectionHeader: {
      size: 18,
    },
  },
  spacing: {
    one: 8,
    two: 16,
    three: 24,
    four: 32,
  },
  color: {
    black: '#312A2D',
    darkGray: '#4B4246',
    green: '#477138',
    yellow: '#DCBC4D',
    blue: '#1E1DCD',
    darkBlue: '#2928AA',
    xdarkBlue: '#100f65',
    purple: '#6227AD',
    maroon: '#9F2458',
    font: '#312a2d',
    lightBeige: '#FAF6F0',
    xlightBeige: '#FFFDFB',
    warmlightBeige: '#F6F0E6',
    beige: '#efe6d8',
    mediumBeige: '#F2EDE5',
    highContrastDarkBeige: '#EFE6D8',
    darkBeige: '#D8D2C9',
    xdarkBeige: '#B9B3A9',
    orange: '#d47b14',
  },
  transparentColor: {
    maroon: 'rgba(158, 36, 87, 0.5)',
    maroon10: 'rgba(158, 36, 87, 0.25)',
    maroonStatus: 'rgba(159, 36, 88, .40)',
    yellowStatus: 'rgba(220,188,77, .40)',
    greenStatus: 'rgba(71, 113 , 56 , .49)',
    blueStatus: 'rgba(30, 29, 205, .40)'
  },
  components: {
    card: {
      container: {
        backgroundColor: '#FFFDFB',
        borderRadius: 8,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
        paddingBottom: 32,
        marginTop:8,
        marginBottom:8
      },
    },
    onboarding: {
      container: {
        marginBottom: 32,
        backgroundColor: '#FAF6F0',
        margin: 'auto',
        minHeight: '100vh',
        maxWidth: 1200,
        boxShadow: "10px 10px 64px rgba(0,0,0,0.1)",
        borderRadius: 64,
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        paddingRight: 16,
        paddingLeft: 16,
      },
    },
    inputBase: {
      wrapper: {
        marginBottom: 8,
      },
      contentWrapper: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
      },
      textInput: {
        fontSize: 18,
        flex: 1,
        paddingLeft: 16,
        backgroundColor: 'transparent',
        border: 0,
        '& :hover': {
          backgroundColor: 'blue'
        },
        '& :active': {
          outline: 'none'
        },
        '& :focus': {
          outline: 'none' 
        }
      },
      container: {
        backgroundColor: '#F6F0E6',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottom: '2px solid #1E1DCD',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: '#1E1DCD',
        marginLeft: 16,
        marginRight: 16,
        paddingLeft: 16,
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      errorContainer: {
        backgroundColor: '#F6F0E6',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottom: '2px solid #9f2458',
        marginLeft: 16,
        marginRight: 16,
        paddingLeft: 16,
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      validationIcon: {
        color: '#477138',
        marginRight: 16
      },
      label: {
        color: '#1E1DCD',
        paddingLeft: 1,
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 4,
      },
      errorLabel: {
        color: '#9F2458',
        paddingLeft: 1,
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 4,
      },
      errorMessage: {
        color: '#9F2458',
        fontSize: 12,
        paddingLeft: 16,
        paddingTop: 2,
      },
    },
    containerStart: {
      backgroundColor: '#efe6d8',
      display: 'flex',
      flex: 1,
      paddingRight: 16,
      paddingLeft: 16,
    },
    container: {
      backgroundColor: '#efe6d8',
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      paddingRight: 16,
      paddingLeft: 16,
    },
    listItemLiteContainer: {
      backgroundColor: '#FFFDFB', 
      shadowColor: 'rgba(0,0,0, 0.1)',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
      justifyContent: 'space-between',
      fontSize: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      fontSize: 16,
      color: '#312A2D',
    },
    lightContainer: {
      backgroundColor: '#FAF6F0',
      paddingRight: 16,
      paddingLeft: 16,
    },
    xlightContainer: {
      backgroundColor: '#FFFDFB',
      height: '100vh', 
      padding: 16,
    },
    phoneNumberErrorInput: {
      backgroundColor: '#FAF6F0',
      borderRadius: 8,
      borderBottomWidth: 2,
      borderColor: '#9F2458',
      marginBottom: 8,
      marginTop: 8,
      minHeight: 50,
      paddingLeft: 16,
    },
    errorInput: {
      backgroundColor: '#FAF6F0',
      borderRadius: 8,
      borderBottomWidth: 2,
      paddingLeft: 8,
      borderColor: '#9F2458',
      marginBottom: 8,
      marginTop: 8,
    },
    iconBlue: {
      fontSize: 24,
      color: '#1E1DCD', // xtradarkbeige
    },
    icon: {
      fontSize: 24,
      color: '#312A2D', // xtradarkbeige
    },
    iconPlaceholder: {
      fontSize: 16,
      color: '#B9B3A9', // xtradarkbeige
    },
    saveIconStyle: {
      shadowColor: 'rgba(0,0,0, 0.5)',
      shadowOffset: { height: 3, width: 1 },
      textShadowOffset: { height: -10, width: -1 },
      shadowOpacity: 1,
      shadowRadius: 0.2,
      elevation: 1,
      padding: 8,
    },
    placeholderText: {
      fontSize: 16,
      color: '#B9B3A9', // xtradarkbeige
    },
    label: {
      textTransform: 'uppercase',
      color: '#4B4246', // xdarkBeige,
      fontSize: 12,
      paddingLeft: 8,
      marginTop: 4,
      marginBottom: 4,
      fontWeight: 'bold',
    },
    phoneNumberInput: {
      backgroundColor: '#FAF6F0',
      borderRadius: 8,
      borderBottomWidth: 0,
      paddingLeft: 16,
      minHeight: 50,
    },
    multiInput: {
      backgroundColor: '#FAF6F0',
      borderRadius: 8,
      borderBottomWidth: 0,
      paddingLeft: 8,
      minHeight: 80,
    },
    input: {
      backgroundColor: '#FAF6F0',
      borderRadius: 8,
      borderBottomWidth: 0,
      paddingLeft: 8,
      minHeight: 40,
    },
    errorMessage: {
      color: '#9F2458',
      fontSize: 12,
      paddingLeft: 16,
    },
  },
};

export default BrandStyles;
