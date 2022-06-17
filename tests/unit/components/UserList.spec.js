import UserList from "../../../src/components/UserList.vue";
import {render, screen} from "@testing-library/vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import apiUrls from "../../../src/util/apiUrls.js";

const users = [
    { id: 1, username: "user1", email: "user1@mail.com", image: null },
    { id: 2, username: "user2", email: "user2@mail.com", image: null },
    { id: 3, username: "user3", email: "user3@mail.com", image: null },
    { id: 4, username: "user4", email: "user4@mail.com", image: null },
    { id: 5, username: "user5", email: "user5@mail.com", image: null },
    { id: 6, username: "user6", email: "user6@mail.com", image: null },
    { id: 7, username: "user7", email: "user7@mail.com", image: null },
];

const server = setupServer(
    rest.get(apiUrls.USER_CREATE, (req, res, context) => {
        let page = Number.parseInt(req.url.searchParams.get("page"));
        let size = Number.parseInt(req.url.searchParams.get("size"));
        if(Number.isNaN(page))
            page=0;
        if(Number.isNaN(size))
            size=5;
        return res(context.status(200), context.json(getPage(page,size)));
    })
);

const getPage = (page, size) =>{
    let start = page * size;
    let end = start + size;
    let totalPages = Math.ceil(users.length/size);
    return{
        content: users.slice(start, end),
        page,
        size,
        totalPages
    }
}

beforeAll(() => server.listen());

beforeEach(async () => server.resetHandlers());

afterAll(() => server.close());

describe("User List", () => {
    it("displays three users in list", async () => {
        render(UserList);
        const users = await screen.findAllByText(/user/);
        expect(users.length).toBe(3);
    });
});