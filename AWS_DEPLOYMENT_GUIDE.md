
# AWS Deployment Guide for Facial Recognition App

This guide provides step-by-step instructions to deploy the Facial Recognition application on AWS.

## Prerequisites

1. **AWS Account**: Create an AWS account if you don't have one
2. **AWS CLI**: Install and configure the AWS Command Line Interface
3. **Node.js and npm**: Ensure you have Node.js installed locally

## Option 1: AWS Amplify Deployment (Recommended)

AWS Amplify provides the easiest way to deploy a React application with continuous deployment.

### Step 1: Install AWS Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

Follow the prompts to set up your AWS credentials.

### Step 2: Initialize Amplify in Your Project

```bash
cd your-project-directory
amplify init
```

- Follow the prompts to set up your project
- Choose JavaScript as the language and React as the framework

### Step 3: Add Hosting

```bash
amplify add hosting
```

Choose "Hosting with Amplify Console" and select "Continuous deployment"

### Step 4: Connect to Git Repository

- Push your code to GitHub, GitLab, or Bitbucket
- Go to AWS Amplify Console in the AWS Management Console
- Click "Connect app" and follow the prompts to connect to your repository
- Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 5: Deploy

Click "Save and deploy" and Amplify will build and deploy your application.

## Option 2: Manual Deployment with S3 and CloudFront

### Step 1: Build Your Application

```bash
npm run build
```

This creates a `dist` folder with the production build.

### Step 2: Create an S3 Bucket

1. Go to the AWS Management Console
2. Navigate to S3
3. Create a new bucket (e.g., "facial-recognition-app")
4. Unblock all public access (since this is a static website)

### Step 3: Configure the Bucket for Static Website Hosting

1. Select your bucket and go to the "Properties" tab
2. Scroll down to "Static website hosting" and click "Edit"
3. Enable static website hosting
4. Set "index.html" as both the index document and error document
5. Save changes

### Step 4: Set Bucket Policy for Public Access

1. Go to the "Permissions" tab of your bucket
2. Click "Bucket Policy" and add the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

Replace "your-bucket-name" with your actual bucket name.

### Step 5: Upload Files to S3

```bash
aws s3 sync dist/ s3://your-bucket-name
```

### Step 6: Set Up CloudFront (Optional but Recommended)

1. Go to CloudFront in the AWS Console
2. Create a new distribution
3. For "Origin Domain Name", select your S3 bucket
4. Configure settings:
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Cache Policy: CachingOptimized
   - Origin Request Policy: CORS-S3Origin
5. For "Default Root Object", enter "index.html"
6. Create the distribution

### Step 7: Set Up Custom Error Response for Client-Side Routing

1. Go to your CloudFront distribution
2. Click on "Error Pages" and then "Create Custom Error Response"
3. Select "404: Not Found" for Error Code
4. Choose "Yes" for "Customize Error Response"
5. Set "/index.html" as the Response Page Path
6. Set "200: OK" as the HTTP Response Code
7. Save changes

Your application is now deployed and accessible via the CloudFront distribution URL!

## Special Considerations

### Camera Access

For webcam access to work on your domain:
1. Ensure you're using HTTPS (CloudFront or Amplify provides this)
2. Update your Content Security Policy to allow camera access:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; media-src 'self' blob:; connect-src 'self' https://*.amazonaws.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

Add this to your index.html file before deploying.

### Model Files

If you're using face-api.js with custom models, make sure the model files are included in your build and the paths are correctly set.

## Troubleshooting

1. **Camera Not Working**: Ensure your site is on HTTPS and the necessary permissions are granted
2. **404 Errors on Refresh**: Make sure CloudFront is configured for SPA routing as described in Step 7
3. **CORS Issues**: Add a CORS configuration to your S3 bucket if needed

## Maintenance and Updates

To update your application:
1. Make changes to your code
2. Build your application (`npm run build`)
3. If using Amplify: commit and push to your repository
4. If using S3/CloudFront: run `aws s3 sync dist/ s3://your-bucket-name` and create a CloudFront invalidation
