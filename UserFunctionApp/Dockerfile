FROM mcr.microsoft.com/azure-functions/node:4-node18

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

# Install dependencies & build
COPY . /home/site/wwwroot
WORKDIR /home/site/wwwroot
RUN npm install && npm run build
