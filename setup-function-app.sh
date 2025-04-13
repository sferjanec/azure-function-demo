#!/bin/bash

# Exit on error
set -e

# ----- Configurable values -----
RESOURCE_GROUP="users-func-rg"
LOCATION="eastus2"
STORAGE_ACCOUNT="usersfuncstor$RANDOM"
FUNCTION_APP="getuserfuncapp$RANDOM"
IDENTITY_NAME="usersfuncident$RANDOM"

# ----- Create Resource Group -----
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# ----- Create Storage Account -----
echo "Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --sku Standard_LRS

# ----- Create Function App (Consumption, Linux, Node 18) -----
echo "Creating Function App..."
az functionapp create \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --storage-account $STORAGE_ACCOUNT \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --os-type Linux

# ----- Create User Assigned Managed Identity -----
echo "Creating Managed Identity..."
az identity create \
  --name $IDENTITY_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# ----- Assign Identity to Function App -----
IDENTITY_ID=$(az identity show --name $IDENTITY_NAME --resource-group $RESOURCE_GROUP --query id -o tsv)
echo "Assigning Managed Identity to Function App..."
az functionapp identity assign \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --identities $IDENTITY_ID

# ----- Allow CORS for localhost (dev) -----
echo "Adding CORS for local testing..."
az functionapp cors add \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "http://localhost:4200"

# ----- Output -----
echo "\n✅ Deployment Complete"
echo "Function App: https://$FUNCTION_APP.azurewebsites.net"
echo "Managed Identity: $IDENTITY_NAME"
echo "Storage Account: $STORAGE_ACCOUNT"
