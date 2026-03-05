// aws-exports.js
export default {
    Auth: {
        region: 'eu-north-1',           // CHANGE THIS to your region
        userPoolId: 'eu-north-1_BvCKQbeku', // CHANGE THIS to your User Pool ID
        userPoolWebClientId: '5m51fkhs33gug83g5vm70q6nmv', // CHANGE THIS to your App Client ID
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
};