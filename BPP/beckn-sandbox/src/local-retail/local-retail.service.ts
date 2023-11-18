import { Injectable } from "@nestjs/common";
import { LocalRetailENUM } from "./local-retail-modules.enum";
import { RetailService } from "./retail/retail.service";
import { LocalRetailApiInterface } from "./local-retail-api.interface";
import { DomainNotFoundException } from "src/common/exception/domain-notfound.exception";

@Injectable()
export class LocalRetailService {
    get(domain: LocalRetailENUM): LocalRetailApiInterface {
        switch (domain) {
            case LocalRetailENUM.RETAIL:
                return new RetailService();
            default:
                throw new DomainNotFoundException();
        }
    }
}
