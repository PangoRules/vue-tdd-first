import UserList from "../../../src/components/UserList.vue";
import {render, screen} from "@testing-library/vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import apiUrls from "../../../src/util/apiUrls.js";

const page1 = {
    content: [
      { id: 4, username: "user4", email: "user4@mail.com", image: null },
      { id: 5, username: "user5", email: "user5@mail.com", image: null },
      { id: 6, username: "user6", email: "user6@mail.com", image: null },
    ],
    page: 1,
    size: 3,
    totalPages: 9,
};

const server = setupServer(
    rest.get(apiUrls.USER_CREATE, (req, res, context) => {
        return res(context.status(200), context.json(page1));
    })
);

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