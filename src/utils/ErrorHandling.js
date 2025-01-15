// src/utils/ErrorHandling.js

export function errorHandling(error) {
    const errorMessages = {
        'auth/admin-restricted-operation': 'This operation is restricted to administrators only.',
        'auth/argument-error': 'An invalid argument was provided.',
        'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
        'auth/app-not-installed': 'The app is not installed.',
        'auth/captcha-check-failed': 'The reCAPTCHA check failed.',
        'auth/code-expired': 'The code has expired.',
        'auth/cordova-not-ready': 'Cordova framework is not ready.',
        'auth/cors-unsupported': 'CORS is not supported.',
        'auth/credential-already-in-use': 'This credential is already in use.',
        'auth/custom-token-mismatch': 'The custom token does not match.',
        'auth/requires-recent-login': 'This operation requires a recent login.',
        'auth/dependent-sdk-initialized-before-auth': 'A dependent SDK was initialized before Firebase Auth.',
        'auth/dynamic-link-not-activated': 'Dynamic links are not activated.',
        'auth/email-change-needs-verification': 'Email change needs verification.',
        'auth/email-already-in-use': 'This email address is already in use.',
        'auth/emulator-config-failed': 'Emulator configuration failed.',
        'auth/expired-action-code': 'The action code has expired.',
        'auth/cancelled-popup-request': 'The popup request was cancelled.',
        'auth/internal-error': 'An internal error occurred.',
        'auth/invalid-api-key': 'The API key is invalid.',
        'auth/invalid-app-credential': 'The app credential is invalid.',
        'auth/invalid-app-id': 'The app ID is invalid.',
        'auth/invalid-user-token': 'The user token is invalid.',
        'auth/invalid-auth-event': 'The authentication event is invalid.',
        'auth/invalid-cert-hash': 'The certificate hash is invalid.',
        'auth/invalid-verification-code': 'The verification code is invalid.',
        'auth/invalid-continue-uri': 'The continue URI is invalid.',
        'auth/invalid-cordova-configuration': 'The Cordova configuration is invalid.',
        'auth/invalid-custom-token': 'The custom token is invalid.',
        'auth/invalid-dynamic-link-domain': 'The dynamic link domain is invalid.',
        'auth/invalid-email': 'The email address is invalid.',
        'auth/invalid-emulator-scheme': 'The emulator scheme is invalid.',
        'auth/invalid-credential': 'The credential is invalid.',
        'auth/invalid-message-payload': 'The message payload is invalid.',
        'auth/invalid-multi-factor-session': 'The multi-factor session is invalid.',
        'auth/invalid-oauth-client-id': 'The OAuth client ID is invalid.',
        'auth/invalid-oauth-provider': 'The OAuth provider is invalid.',
        'auth/invalid-action-code': 'The action code is invalid.',
        'auth/unauthorized-domain': 'The domain is unauthorized.',
        'auth/wrong-password': 'The password is incorrect.',
        'auth/invalid-persistence-type': 'The persistence type is invalid.',
        'auth/invalid-phone-number': 'The phone number is invalid.',
        'auth/invalid-provider-id': 'The provider ID is invalid.',
        'auth/invalid-recipient-email': 'The recipient email is invalid.',
        'auth/invalid-sender': 'The sender is invalid.',
        'auth/invalid-verification-id': 'The verification ID is invalid.',
        'auth/invalid-tenant-id': 'The tenant ID is invalid.',
        'auth/multi-factor-info-not-found': 'The multi-factor info was not found.',
        'auth/multi-factor-auth-required': 'Multi-factor authentication is required.',
        'auth/missing-android-pkg-name': 'The Android package name is missing.',
        'auth/missing-app-credential': 'The app credential is missing.',
        'auth/auth-domain-config-required': 'The auth domain configuration is required.',
        'auth/missing-verification-code': 'The verification code is missing.',
        'auth/missing-continue-uri': 'The continue URI is missing.',
        'auth/missing-iframe-start': 'The iframe start is missing.',
        'auth/missing-ios-bundle-id': 'The iOS bundle ID is missing.',
        'auth/missing-or-invalid-nonce': 'The nonce is missing or invalid.',
        'auth/missing-multi-factor-info': 'The multi-factor info is missing.',
        'auth/missing-multi-factor-session': 'The multi-factor session is missing.',
        'auth/missing-phone-number': 'The phone number is missing.',
        'auth/missing-verification-id': 'The verification ID is missing.',
        'auth/app-deleted': 'The app has been deleted.',
        'auth/account-exists-with-different-credential': 'An account already exists with a different credential.',
        'auth/network-request-failed': 'The network request failed.',
        'auth/null-user': 'The user is null.',
        'auth/no-auth-event': 'No authentication event.',
        'auth/no-such-provider': 'No such provider.',
        'auth/operation-not-allowed': 'The operation is not allowed.',
        'auth/operation-not-supported-in-this-environment': 'The operation is not supported in this environment.',
        'auth/popup-blocked': 'The popup was blocked.',
        'auth/popup-closed-by-user': 'The popup was closed by the user.',
        'auth/provider-already-linked': 'The provider is already linked.',
        'auth/quota-exceeded': 'The quota has been exceeded.',
        'auth/redirect-cancelled-by-user': 'The redirect was cancelled by the user.',
        'auth/redirect-operation-pending': 'A redirect operation is pending.',
        'auth/rejected-credential': 'The credential was rejected.',
        'auth/second-factor-already-in-use': 'The second factor is already in use.',
        'auth/maximum-second-factor-count-exceeded': 'The maximum second factor count has been exceeded.',
        'auth/tenant-id-mismatch': 'The tenant ID does not match.',
        'auth/timeout': 'The operation timed out.',
        'auth/user-token-expired': 'The user token has expired.',
        'auth/too-many-requests': 'Too many requests. Try again later.',
        'auth/unauthorized-continue-uri': 'The continue URI is unauthorized.',
        'auth/unsupported-first-factor': 'The first factor is unsupported.',
        'auth/unsupported-persistence-type': 'The persistence type is unsupported.',
        'auth/unsupported-tenant-operation': 'The tenant operation is unsupported.',
        'auth/unverified-email': 'The email address is unverified.',
        'auth/user-cancelled': 'The user cancelled the operation.',
        'auth/user-not-found': 'The user was not found.',
        'auth/user-disabled': 'The user is disabled.',
        'auth/user-mismatch': 'The user does not match.',
        'auth/user-signed-out': 'The user has signed out.',
        'auth/weak-password': 'The password is too weak.',
        'auth/web-storage-unsupported': 'Web storage is unsupported.',
        'auth/already-initialized': 'Firebase has already been initialized.',
        'auth/recaptcha-not-enabled': 'reCAPTCHA is not enabled.',
        'auth/missing-recaptcha-token': 'The reCAPTCHA token is missing.',
        'auth/invalid-recaptcha-token': 'The reCAPTCHA token is invalid.',
        'auth/invalid-recaptcha-action': 'The reCAPTCHA action is invalid.',
        'auth/missing-client-type': 'The client type is missing.',
        'auth/missing-recaptcha-version': 'The reCAPTCHA version is missing.',
        'auth/invalid-recaptcha-version': 'The reCAPTCHA version is invalid.',
        'auth/invalid-req-type': 'The request type is invalid.',
        'validation-error': 'Passwords do not match!',
        'terms-agreement-error': 'You must agree to the terms and conditions!',
        'missing-fields-error': 'All fields are required!',
        'missing-email-address': 'Email address is required!',
    };

    const message = errorMessages[error.code] || 'An unknown error occurred.';
    throw new Error(message);
}

export class ValidationError extends Error {
    constructor() {
        super();
        this.name = 'ValidationError';
        this.code = 'validation-error';
    }
}

export class TermsAgreementError extends Error {
    constructor() {
        super();
        this.name = 'TermsAgreementError';
        this.code = 'terms-agreement-error';
    }
}

export class MissingFieldsError extends Error {
    constructor() {
        super();
        this.name = 'MissingFieldsError';
        this.code = 'missing-fields-error';
    }
}

export class MissingEmailAddress extends Error {
    constructor() {
        super();
        this.name = 'MissingEmailAddress';
        this.code = 'missing-email-address';
    }
}