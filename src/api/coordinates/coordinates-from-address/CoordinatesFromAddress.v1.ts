'use strict';

import {RequestController} from "../../../routing-utilities/RequestController";
import {Request, Response, NextFunction} from "express";
import * as Joi from "joi";
import {Category} from "../../../db/models/Category.model";
import {XError} from "../../../routing-utilities/XError";
import {Shop} from "../../../db/models/Shop.model";
import * as request from "superagent";

export class CoordinatesFromAddressV1 extends RequestController {
    validate?: Joi.JoiObject = Joi.object().keys({
        query: {
            address: Joi.string().required(),
            city: Joi.string().allow(null),
            cap: Joi.number().allow(null)
        },

    });

    async retrieveCoordinatesFromAddress(address: string, city?: string, cap?: string): Promise<{lat: number, lng: number}> {
        // tslint:disable-next-line:no-shadowed-variable
        const response:any = await request.get("https://nominatim.openstreetmap.org/search")
            .query({street: address})
            .query({"city": city})
            .query({"cap:": cap})
            .query({email: 'simonestaffa96@gmail.com'})
            .query({format: 'json'});

        /*if (response.body.length > 0){
            response.body = response.body.filter((r: any) => {
                return !r.display_name.includes(cap.toString());
            });
        }*/
        try {
            const lat = response.body[0].lat;
            const lng = response.body[0].lon;
            /*if (!response.body[0].display_name.includes(cap.toString())) {
                throw new XError(Shop.AMBIGUOUS_ADDRESS_ERROR, 419, 'The address specified is ambiguous. Please be sure using the correct city and zipcode.')
            }*/
            return {
                lat,
                lng
            }
        } catch (error) {
            if (error instanceof XError) {
                throw error;
            } else {
                throw new XError(Shop.COORDINATES_NOT_FOUND_ERROR, 419, 'Invalid address: coordinates not found')
            }
        }
    }

    async exec(req: Request, res: Response, next: NextFunction): Promise<{lat: number, lng: number}> {
        return await this.retrieveCoordinatesFromAddress(req.query.address, req.query.city, req.query.cap);
    }

}


