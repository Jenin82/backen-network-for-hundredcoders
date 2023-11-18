import { Injectable } from "@nestjs/common";
import { DSEPApiInterface } from "../dsep-api.interface";
import { DSEPRequestDto } from "../dto/request.dto";
import * as searchByName from "./response/response.searchByName.json";
import * as searchByLocation from "./response/response.searchByLocation.json";
import * as searchBySkill from "./response/response.searchBySkill.json";

@Injectable()
export class TalentService implements DSEPApiInterface {
    select(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    init(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    confirm(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    status(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    search(dsepRequestDto: DSEPRequestDto): any {
        const { message } = dsepRequestDto;
        const isSearchByTalentName = !!message?.intent?.item?.descriptor?.name;
        const isSearchByLocation = !!message?.intent?.locations?.gps;
        const isSearchOnCourseCategory = !!message?.intent?.provider?.categories?.length;

        if (isSearchByTalentName) {
            return searchByName;
        }
        if (isSearchByLocation && !isSearchOnCourseCategory) {
            return searchByLocation;
        }
        if (isSearchByLocation && isSearchOnCourseCategory) {
            return searchBySkill;
        }
    }

    cancel(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    track(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    update(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    support(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }

    rating(dsepRequestDto: DSEPRequestDto): any {
        return null;
    }
}
