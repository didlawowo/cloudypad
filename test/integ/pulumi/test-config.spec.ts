import { PulumiStackConfigAws } from "../../../src/tools/pulumi/aws"
import { PulumiStackConfigAzure } from "../../../src/tools/pulumi/azure";
import { PulumiStackConfigGcp } from "../../../src/tools/pulumi/gcp";

// Test key, not used anywhere but here
const pubKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC0fvAW244z7LT8sE1g2Zl6mi5LL1V7Otw5ZfzF1Zsh+OufH+AbmkLOmrhtbUE7OmIQduDSXbttCGPocW6Va2vEeq0SIsn7ZjxdsIlwP7xCzDDwA6R29uCrgy4YLdJhz7FOhgI+n1td9JP8444I1+duaoOrOcihxHJZkqjh+GCc6bXrTsJ2fVCqZRGRG7nyMRpIJKfCFkNkSawF2wrX6BWKTkNolMLJUz9FZWPn3mtOWDaVVVrInSwzmqYf5f9gLC17rydH6YnMEIgHvCRJYh4Dpz3A2Sw6fogwWgNGtt4k25HcUX0kMY0KbRFAG4rSJrHScmQ5FA8fKyDcZB25cHd6/hT2435IKXnBT4Jjw96PNQQwI4PjTFBK8IMlUMEUC4B51cSmcLCV0ia69bDEltSjLv92BiZA/W6dFCg9b6DYprAIHeSESRHUwOJg2boFPVdVGyxJc7PNRNY4uBZxVILYdUDPEwfyM1kqW1aHhq5Is8TX69bNU4X9t5l5J53vYhk="

export const awsConfig: PulumiStackConfigAws = {
    region: "eu-central-1",
    instanceType: "g4dn.xlarge",
    rootVolumeSizeGB: 100,
    publicSshKeyContent: pubKey,
    publicIpType: "static",
    useSpot: false
}

export const azureConfig: PulumiStackConfigAzure = {
    subscriptionId: "0dceb5ed-9096-4db7-b430-2609e7cc6a15",
    location: "francecentral",
    vmSize: "Standard_NC8as_T4_v3",
    rootDiskSizeGB: 100,
    publicSshKeyContent: pubKey,
    publicIpType: "static",
    useSpot: false
}

export const gcpConfig: PulumiStackConfigGcp = {
    projectId: "crafteo-sandbox" ,
    region: "europe-west4",
    zone: "europe-west4-b",
    machineType: "n1-standard-8",
    acceleratorType: "nvidia-tesla-p4",
    rootDiskSize: 100,
    publicSshKeyContent: pubKey,
    publicIpType: "static",
    useSpot: false        
}