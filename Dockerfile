FROM amazon/aws-lambda-nodejs:12

# Install Chrome to get all of the dependencies installed
RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install epel -y
RUN yum install -y chromium

COPY  tsconfig.json package*.json  ${LAMBDA_TASK_ROOT}

# Install NPM dependencies for function
RUN npm install
# put source code at path where Lambda expects it
COPY ./src ${LAMBDA_TASK_ROOT}/src

RUN npm run build

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "dist/index.Handler" ]  