import { Local_Retail_Request_DTO } from "./dto/local-retail-request.dto";

export interface LocalRetailApiInterface {
    search: (request: Local_Retail_Request_DTO) => any;
    select: (request: Local_Retail_Request_DTO) => any;
    init: (request: Local_Retail_Request_DTO) => any;
    confirm: (request: Local_Retail_Request_DTO) => any;
    status: (request: Local_Retail_Request_DTO) => any;
    cancel: (request: Local_Retail_Request_DTO) => any;
    support: (request: Local_Retail_Request_DTO) => any;
    rating: (request: Local_Retail_Request_DTO) => any;
    update: (request: Local_Retail_Request_DTO) => any;
    track: (request: Local_Retail_Request_DTO) => any;
}
