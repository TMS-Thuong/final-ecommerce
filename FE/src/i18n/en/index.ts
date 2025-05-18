import { TransEnum } from '@/enums/i18n'
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      home: "Home",
      products: "Products",
      loading: "Loading...",
      error: "An error occurred. Please try again."
    },
    [TransEnum.Error]: {
      EmailRequired: 'Email is required.',
      emailInvalid: 'Invalid email address.',
      emailNotVerified: 'Email has not been verified.',
      emailUsed: 'Email is already in use.',
      emailNotFound: 'Email not found.',
      verificationEmailFailed: 'Could not send verification email.',
      verificationEmailAlreadySent: 'Token is still valid.',
      alreadyVerified: 'Email is already verified.',
      emailNotSent: 'Error occurs when sending the confirmation email. Please try again later.',

      passwordRequired: 'Password is required.',
      passwordMinLength: 'Password must be at least 8 characters long.',
      passwordMaxLength: 'Password must not exceed 16 characters.',
      passwordPattern:
        'Password must include at least one uppercase letter, one lowercase letter, and one special character.',
      passwordsDoNotMatch: 'Passwords do not match.',
      passwordIncorrect: 'Incorrect password.',

      firstNameRequired: 'First name is required.',
      lastNameRequired: 'Last name is required.',
      birthDateRequired: 'Birth date is required.',
      birthDateInvalid: 'Invalid birth date format.',
      genderInvalid: 'Invalid gender value.',
      userInfoIncomplete: 'User information is incomplete.',
      userNotFound: 'User not found.',
      userNotActive: 'Account is not active.',
      googleAccountCannotReset: 'This account was logged in via Google. You cannot use the password reset feature.',

      tokenRequired: 'Token is required.',
      tokenNotSaved: 'Token is not saved.',
      refreshTokenRequired: 'Refresh token is required.',
      tokenInvalid: 'Invalid or expired token.',
      refreshTokenInvalid: 'Invalid refresh token.',
      tokenNotFound: 'Token not found.',
      tokenExpired: 'Token has expired.',
      tokenIdInvalid: 'Invalid token ID.',

      invalidCredentials: 'Incorrect email or password.',
      unauthorized: 'unauthorized access.',
      notVerified: 'Google email has not been verified.',

      googleApiNotInitialized: "Google API has not been initialized.",
      googleAuthInstanceNotFound: "Unable to get the GoogleAuth instance.",
      googleSigninFailed: "An error occurred during Google Sign-In.",

      serverError: 'Server error.',
      failedToSendEmail: 'Failed to send email.',
      invalidResetData: 'Invalid reset data.',
      INVALID_DATA: 'Invalid request data.',
      unexpectedError: 'An unexpected error occurred.',
      requiredJwtSecret: 'JWT_SECRET is required',
      payloadInvalid: 'Invalid payload',
      noResponseData: 'API response does not contain expected data',
      http400: 'Bad request.',
      http401: 'Unauthorized.',
      http403: 'Forbidden.',
      http404: 'Not found.',
      http409: 'Conflict occurred.',
      http429: 'Too many requests.',
      http500: 'Internal server error',
    },
    [TransEnum.Success]: {
      registrationSuccess: 'Registration successful. Please check your email to verify your account.',
      registerGoogleSuccess: 'Sign up for an account with Google successfully.',
      googleSignInSuccess: "You have successfully signed in with Google!",
      verificationEmailSent: 'Verification email has been sent.',
      loginSuccess: 'Login successful.',
      passwordUpdated: 'Password has been updated.',
      resetEmailSent: 'Verify reset email has been sent.',
    },
    [TransEnum.Auth]: {
      login: {
        title: 'Login',
        welcomeBack: 'Welcome back',
        enterDetails: 'Please enter your details to sign in to your account',
        email: 'Email',
        inHere: "in here",
        password: 'Password',
        forgotPassword: 'Forgot password?',
        loginWith: 'Or login with',
        submitButton: 'Sign in',
        loginViaGoogle: "Sign in with Google",
      },
      register: {
        title: 'Register',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        password: 'Password',
        birthDate: 'Birth date',
        gender: 'Gender',
        submitButton: 'Register',
        emailVerifyText: 'If you did not receive the verification email.',
        resendButton: 'Resend email',
        loginWith: 'Or login with',
        alreadyHaveAccount: 'Already have an account?',
        registerDescription: 'Create your account to get started',
      },
      resetPassword: {
        title: 'Reset Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        submitButton: 'Reset Password',
        orLogin: 'Or login with',
      },
      forgotPassword: {
        title: 'Forgot Password',
        description: 'We will send you an email to reset your password.',
        email: 'Email',
        submitButton: 'Send Request',
        cancelButton: 'Cancel',
      },
    },
    benefits: {
      title: 'Member Benefits',
      shipping: 'Super fast shipping',
      productVariety: 'Diverse products',
      easyReturns: 'Easy returns',
      rewardPoints: 'Points to redeem for gifts',
      coupons: 'Many coupons for frequent members',
    },
    [TransEnum.Feature]: {
      freeShipping: {
        title: 'Free Shipping',
        desc: 'For orders over 500K'
      },
      warranty: {
        title: '1-Year Warranty',
        desc: 'Easy returns'
      },
      securePayment: {
        title: 'Secure Payment',
        desc: 'Multiple methods'
      },
      support: {
        title: '24/7 Support',
        desc: 'Always available'
      }
    },
    [TransEnum.Product]: {
      pageTitle: 'Products',
      showing: 'Showing {count} products',
      filters: {
        title: 'Filters',
        reset: 'Reset',
        categories: {
          title: 'Categories',
          phoneAccessories: 'Phone Accessories',
          computerAccessories: 'Computer Accessories',
          audio: 'Audio'
        },
        priceRange: {
          title: 'Price Range',
          under: 'Under',
          between: 'Between',
          above: 'Above'
        },
        brands: {
          title: 'Brands'
        },
        rating: {
          title: 'Rating',
          andAbove: 'and above'
        },
        stock: {
          title: 'Stock Status',
          inStockOnly: 'Show in-stock products only'
        },
        promotion: {
          title: 'Promotions',
          onSaleOnly: 'Show products on sale only'
        }
      },
      sort: {
        title: 'Sort by',
        newest: 'Newest',
        priceLowToHigh: 'Price: Low to High',
        priceHighToLow: 'Price: High to Low',
        topRated: 'Top Rated'
      },
      search: {
        placeholder: 'Search products...'
      },
      loadMore: 'Load More',
      detail: {
        stock: {
          inStock: "In Stock",
          outOfStock: "Out of Stock",
          status: "Status"
        },
        brand: "Brand",
        category: "Category",
        quantity: "Quantity",
        addToCart: "Add to Cart",
        description: "Product Description",
        features: "Key Features",
        specifications: "Specifications",
        reviews: "Reviews",
        updating: "Updating..."
      },
      tabs: {
        description: "Product Description",
        specifications: "Specifications",
        reviews: "Reviews"
      }
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
