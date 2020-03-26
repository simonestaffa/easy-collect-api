import {AbstractRoutes} from "../routing-utilities/AbstractRoutes";
import {PathRoute} from "../routing-utilities/PathRoute";
import {Route} from "../routing-utilities/Route";
import {CategoriesRoutes} from "./categories";
import {ShopsRoutes} from "./shops";
import {CheckRoutes} from "./check";

export class IndexRoute extends AbstractRoutes {
    initializePathRoutes(): PathRoute[] {
        return [
            new PathRoute('/categories', new CategoriesRoutes()),
            new PathRoute('/check', new CheckRoutes()),
            new PathRoute('/shops', new ShopsRoutes()),
        ];
    }

    initializeRoutes(): Route[] {
        return [];
    }
}
