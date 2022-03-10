import { ROUTE_PATHS } from "./config";
import Router from "./core/router";
import { NewsDetailPage, NewsFeedPage } from "./pages";
import Store from "./store";

const router = new Router();
const store = new Store();
const newsFeedPage = new NewsFeedPage("root", store);
const newsDetailPage = new NewsDetailPage("root", store);

router.setDefaultRoute(newsFeedPage, { page: 1 });
router.addRoutePath(ROUTE_PATHS.newsFeeds, newsFeedPage, { page: 1 });
router.addRoutePath(ROUTE_PATHS.newsDetail, newsDetailPage);

router.route();
