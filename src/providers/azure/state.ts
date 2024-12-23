import { z } from "zod"
import { CommonProvisionOutputV1Schema, CommonProvisionInputV1Schema, InstanceStateV1Schema, AbstractInstanceInputs } from "../../core/state/state"
import { CLOUDYPAD_PROVIDER_AZURE, PUBLIC_IP_TYPE_DYNAMIC, PUBLIC_IP_TYPE_STATIC } from "../../core/const"

const AzureProvisionOutputV1Schema = CommonProvisionOutputV1Schema.extend({
    vmName: z.string().describe("Azure VM name"),
    resourceGroupName: z.string().describe("Azure Resource Group name"),
})

const AzureProvisionInputV1Schema = CommonProvisionInputV1Schema.extend({
    vmSize: z.string().describe("Azure VM size"),
    diskSize: z.number().describe("Disk size in GB"),
    publicIpType: z.enum([PUBLIC_IP_TYPE_STATIC, PUBLIC_IP_TYPE_DYNAMIC]).describe("Type of public IP address"),
    subscriptionId: z.string().describe("Azure Subscription ID"),
    location: z.string().describe("Azure location/region"),
    useSpot: z.boolean().describe("Whether to use spot instances"),
})

const AzureInstanceStateV1Schema = InstanceStateV1Schema.extend({
    provision: z.object({
        provider: z.literal(CLOUDYPAD_PROVIDER_AZURE),
        output: AzureProvisionOutputV1Schema.optional(),
        input: AzureProvisionInputV1Schema,
    }),
})

type AzureInstanceStateV1 = z.infer<typeof AzureInstanceStateV1Schema>
type AzureProvisionOutputV1 = z.infer<typeof AzureProvisionOutputV1Schema>
type AzureProvisionInputV1 = z.infer<typeof AzureProvisionInputV1Schema>

type AzureInstanceInput = AbstractInstanceInputs<AzureProvisionInputV1>

export {
    AzureProvisionOutputV1Schema,
    AzureProvisionInputV1Schema,
    AzureInstanceStateV1Schema,
    AzureInstanceStateV1,
    AzureProvisionOutputV1,
    AzureProvisionInputV1,
    AzureInstanceInput,
}

// V0

export interface AzureProviderStateV0 {
    vmName?: string
    resourceGroupName?: string
    provisionArgs?: AzureProvisionArgsV0
}

export interface AzureProvisionArgsV0 {
    create: {
        vmSize: string
        diskSize: number
        publicIpType: string
        subscriptionId: string
        location: string
        useSpot: boolean
    }
}

