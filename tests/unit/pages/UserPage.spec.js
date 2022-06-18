import UserPage from "../../../src/pages/UserPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import {render, screen, waitFor}  from "@testing-library/vue";
import apiUrls from "../../../src/util/apiUrls.js";

const server = setupServer(
	rest.get(`${apiUrls.USER_GET_USER}:id`, (req, res, context) => {
			return res(context.status(200), context.json({
				id: 1,
				username: "user1",
				email: "user1@mail.com",
				image: null
			}));
	})
);

beforeAll(() => server.listen());

beforeEach(async () => server.resetHandlers());

afterAll(() => server.close());

describe("User Page", () =>{
	it("displays username on page when user is found", async() =>{
		render(UserPage, {
			global:{mocks:{$route: {params:{id: 1}}}}
		});
		await waitFor(()=>{
			expect(screen.queryByText("user1")).toBeInTheDocument();
		})
	});
})