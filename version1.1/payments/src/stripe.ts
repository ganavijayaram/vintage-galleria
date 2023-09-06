// creatinf strip instance which can be used in other parts of our service
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2023-08-16'
})