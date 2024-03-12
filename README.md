An AI SaaS built using in next 14 that makes a great boilerplate to build your own SaaS.

This repo is an implementation of [next13-ai-saas](https://github.com/AntonioErdeljac/next13-ai-saas)  from Antonio Erdeljac's original tutorial.
I have updated it to use next-14 and made some modifications, notably using local postgres rather than a cloud db.  Likely to add features as more AI models 
get released to the community. 

It is a [Next.js](https://nextjs.org/) project, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

You will need to create accounts with the following services in order to get api keys.

- [OpenAI](https://openai.com/)
- [Clerk](https://clerk.com/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)
- [Replicate](https://replicate.com/)

This repo assumes a local postgres database. You can use that or change to another. 
Note that prisma supports MySQL, MongoDB, PostGres, as well as some cloud db providers.

You need to create a .env file with the following:
```shell
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR-CLERK-PUBLISHABLE-KEY
CLERK_SECRET_KEY=YOUR-CLERK-SECRET-KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dash
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dash
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

# change this if your deploy is different. it must be the full absolute url
NEXT_PUBLIC_APP_URL="http://localhost:3000"

OPENAI_API_KEY=YOUR-OPENAI-API-KEY

REPLICATE_API_KEY=YOUR-REPLICATE-API-KEY

STRIPE_API_KEY=YOUR-STRIPE-API-KEY
STRIPE_WEBHOOK_SECRET=YOUR-STRIPE-WEBHOOK-SECRET

# This was inserted by `prisma init`:
# BE SURE TO CHANGE IT FOR YOUR INSTALL
DATABASE_URL="postgresql://user:password@localhost:5432/aisaas?schema=public"
```
First, initialize the db

```bash
npm run postinstall
```
This runs `npx prisma generate` which initializes the db. Note that if you make any 
modifications to the db schema, file `prisma/schema.prisma` , you will need to run
`npx prisma generate`

Now, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/(landing)/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To see the original tutorial:

- [Build A SaaS AI Platform](https://www.codewithantonio.com/projects/ai-saas) - Antonio Erdeljac's original next13-ai-saas tutorial

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.




