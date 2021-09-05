FROM amazon/aws-lambda-nodejs:12
# Alternatively, you can pull the base image from Docker Hub: amazon/aws-lambda-nodejs:12
RUN npm install -g typescript

# Install Chrome to get all of the dependencies installed
RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install epel -y
RUN yum install -y chromium

COPY  tsconfig.json package*.json  ${LAMBDA_TASK_ROOT}

# Install NPM dependencies for function
RUN npm install

COPY ./src ${LAMBDA_TASK_ROOT}/src

RUN tsc

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "dist/index.Handler" ]  